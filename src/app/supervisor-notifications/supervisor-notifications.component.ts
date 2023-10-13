/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


import { Component, DoCheck, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { NotificationService } from "../services/notificationService/notification-service";
import { dataService } from "../services/dataService/data.service";
import { NotificationsDialogComponent } from "../notifications-dialog/notifications-dialog.component";
import { MdDialog } from "@angular/material";
import { EditNotificationsComponent } from "../edit-notifications/edit-notifications.component";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";
@Component({
  selector: "app-supervisor-notifications",
  templateUrl: "./supervisor-notifications.component.html",
  styleUrls: ["./supervisor-notifications.component.css"],
})
export class SupervisorNotificationsComponent implements OnInit, DoCheck {
  serviceProviderID: any;
  providerServiceMapID: any;
  serviceID: any;
  stateID: any;
  createdBy: any;
  userId: any;
  notificationTypes = [];
  roleObjArray = [];
  notifications = [];
  notificationPostData: any;
  onConfigSubmit: boolean = false;
  p: number = 1;
  minDate: Date;
  roleIDs = [];

  sDate: Date = new Date();
  eDate: Date = new Date();

  visibility_Flag: boolean = true;

  @ViewChild("showNotificationForm") showNotificationForm: NgForm;
  currentLanguageSet: any;

  constructor(
    private notificationService: NotificationService,
    private alertService: ConfirmationDialogsService,
    public commonDataService: dataService,
    public dialog: MdDialog,
    private httpServices: HttpServices
  ) {}

  ngOnInit() {
    this.assignSelectedLanguage();
    this.minDate = new Date();
    this.providerServiceMapID = this.commonDataService.currentService.serviceID;
    this.createdBy = this.commonDataService.uname;
    this.userId = this.commonDataService.uid;
    this.notificationService
      .getNotificationTypes(this.providerServiceMapID)
      .subscribe(
        (response) => {
          console.log(response);
          this.notificationTypes = response.data;
        },
        (error) => {
          console.log(error);
        }
      );
    this.notificationService.getRoles(this.providerServiceMapID).subscribe(
      (response) => {
        console.log(response);
        this.roleObjArray = response.data;
        for (var i = 0; i < this.roleObjArray.length; i++) {
          this.roleIDs.push(this.roleObjArray[i].roleID);
        }
      },
      (error) => {
        console.log(error);
      }
    );

    this.notificationService
      .getServiceProviderID(this.providerServiceMapID)
      .subscribe((response) => this.getProviderIDSuccess(response));
  }
  /* Multilingual implementation - JA354063 */
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  /* Ends*/

  notification_type: any;
  show: any = 0;
  checkNotificationType(notification_type) {
    if (notification_type.toUpperCase() === "Language Message".toUpperCase()) {
      this.show = 1;
      this.visibility_Flag = true;
    } else if (
      notification_type.toUpperCase() === "User Message".toUpperCase() ||
      notification_type.toUpperCase() === "User Ratings".toUpperCase()
    ) {
      this.show = 2;
      this.visibility_Flag = true;
    } else if (
      notification_type.toUpperCase() === "Location Message".toUpperCase()
    ) {
      this.show = 3;
      this.visibility_Flag = true;
    } else if (
      notification_type.toUpperCase() === "Emergency Contact".toUpperCase()
    ) {
      let today = new Date();
      let future_day: Date;

      this.visibility_Flag = false;
      this.show = -1;

      future_day = new Date(today);
      future_day.setFullYear(
        today.getFullYear() + 10,
        today.getMonth(),
        today.getDate()
      );

      console.log("sDate:", today, "edate:", future_day);
      this.sDate = new Date();
      this.eDate = future_day;

      this.showNotificationForm.value.startDate = this.sDate;
      this.showNotificationForm.value.endDate = this.eDate;
    } else {
      this.show = 0;
      this.visibility_Flag = true;
    }
  }

  getProviderIDSuccess(response) {
    this.serviceProviderID = response.serviceProviderID;
    console.log(this.serviceProviderID, "SP_ID");
    this.serviceID = response.serviceID;
    this.stateID = response.stateID;
    // invoke these all
    this.getAllLanguages();
    this.getOffices(this.serviceProviderID, this.stateID, this.serviceID);
    this.getUsers(this.providerServiceMapID);
  }

  getAllLanguages() {
    this.notificationService
      .getLanguages()
      .subscribe((response) => this.getLanguageSuccessHandeler(response));
  }

  languages: any = [];
  users: any = [];
  offices: any = [];
  getLanguageSuccessHandeler(response) {
    console.log(response, "Languages");
    this.languages = response;
  }

  getOffices(providerID, stateID, serviceID) {
    // this.notificationService.getOffices(providerID,stateID,serviceID).subscribe(response=>this.getOfficesSuccessHandeler(response));
  }

  getOfficesSuccessHandeler(response) {
    console.log(response, "offices");
    this.offices = response;
  }

  getUsers(psmID) {
    this.notificationService
      .getUsersByProviderID(psmID)
      .subscribe((response) => this.getUsersSuccessHandeler(response));
  }

  getUsersSuccessHandeler(response) {
    console.log(response, "users");
    this.users = response;
  }

  createNotification() {
    let dialog = this.dialog.open(NotificationsDialogComponent, {
      disableClose: true,
      data: {
        notificationTypes: this.notificationTypes,
        roleObjArray: this.roleObjArray,
      },
    });
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        this.notificationService.createNotification(data).subscribe(
          (response) => {
            console.log(response);
            if (response.data.length > 0) {
              this.alertService.alert(
                this.currentLanguageSet.successfullyCreatedNotification,
                "success"
              );
             
            }
          },
          (error) => {
            console.log(error);
            this.alertService.alert(this.currentLanguageSet.failedToCreateNotification, "error");
          }
        );
      }
    });
  }
  onSubmitShowForm() {
    let today = new Date();
    let future_day: Date;
    console.log(this.showNotificationForm.value);
    // console.log(new Date((this.showNotificationForm.value.startDate) - 1 * (this.showNotificationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z");
    this.onConfigSubmit = true;

    let roleIDs = undefined;
    if (this.show === 0) {
      roleIDs =
        this.showNotificationForm.value.roles == ""
          ? this.roleIDs
          : this.showNotificationForm.value.roles;
    }

    if (this.show === -1) {
      roleIDs = undefined;
      future_day = new Date(today);
      future_day.setFullYear(
        today.getFullYear() + 10,
        today.getMonth(),
        today.getDate()
      );

      console.log("sDate:", today, "edate:", future_day);
      this.sDate = new Date();
      this.eDate = future_day;

      this.showNotificationForm.value.startDate = this.sDate;
      this.showNotificationForm.value.endDate = this.eDate;
    }

    let languageIDs = undefined;
    if (this.show === 1) {
      languageIDs =
        this.showNotificationForm.value.Languages == ""
          ? languageIDs
          : this.showNotificationForm.value.Languages;
    }

    let workingLocationIDs = undefined;
    if (this.show === 3) {
      workingLocationIDs =
        this.showNotificationForm.value.Offices == ""
          ? workingLocationIDs
          : this.showNotificationForm.value.Offices;
    }

    let userIDs = undefined;
    if (this.show === 2) {
      userIDs = [
        this.showNotificationForm.value.Users == ""
          ? userIDs
          : this.showNotificationForm.value.Users,
      ];
    }

    let startDate: Date = new Date(this.showNotificationForm.value.startDate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    let endDate: Date = new Date(this.showNotificationForm.value.endDate);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    this.notificationPostData = {
      providerServiceMapID: this.providerServiceMapID,
      notificationTypeID: this.showNotificationForm.value.notificationType,
      roleIDs: roleIDs,
      userIDs: userIDs,
      workingLocationIDs: workingLocationIDs,
      languageIDs: languageIDs,
      validStartDate: startDate,
      validEndDate: endDate,
    };

    console.log(JSON.stringify(this.notificationPostData));
    this.notificationService
      .getSupervisorNotifications(this.notificationPostData)
      .subscribe(
        (response) => {
          this.notifications = response.data;
          console.log(this.notifications);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onEditClick(row, event) {
    event.preventDefault();
    let dialog = this.dialog.open(EditNotificationsComponent, {
      data: row,
      disableClose: true,
    });
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        this.notificationService.updateNotification(data).subscribe(
          (response) => {
            console.log(response);
            if (response.data != {}) {
              this.alertService.alert(
                this.currentLanguageSet.successfullyEditedNotification,
                "success"
              );
              this.notificationService
                .getSupervisorNotifications(this.notificationPostData)
                .subscribe(
                  (response) => {
                    this.notifications = response.data;
                  },
                  (error) => {
                    this.alertService.alert(error.status, "error");
                  }
                );
            }
          },
          (error) => {
            console.log(error);
      this.alertService.alert(this.currentLanguageSet.failedToEditNotification, "error");
          }
        );
      }
    });
  }
  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }
}
