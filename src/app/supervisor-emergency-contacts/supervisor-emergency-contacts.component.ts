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
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";

@Component({
  selector: "app-supervisor-emergency-contacts",
  templateUrl: "./supervisor-emergency-contacts.component.html",
  styleUrls: ["./supervisor-emergency-contacts.component.css"],
})
export class SupervisorEmergencyContactsComponent implements OnInit, DoCheck {
  // ngModels
  name: any;
  designation: any;
  location: any;
  contactNumber: any;

  // arrays
  emergencyList: any = [];
  designations: any = [];
  roles: any = [];

  // flags
  showTable = true;
  showForm = false;
  showEditForm = false;

  // variables
  providerServiceMapID: any;
  notificationTypeID: any;
  emergency_contact_related_data: any = [];
  bufferArray: any = [];
  createdBy: any;

  editData: any;
  currentDate: Date = new Date();

  @ViewChild("emergencyContact") emergencyContactForm: NgForm;

  @ViewChild("editEmergencyContact") editEmergencyContactForm: NgForm;
  currentLanguageSet: any;

  constructor(
    public notification_service: NotificationService,
    public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService,
    private httpServices: HttpServices
  ) {}

  ngOnInit() {
    this.assignSelectedLanguage();
    this.providerServiceMapID =
      this.commonDataService.userPriveliges[0].providerServiceMapID;
    this.createdBy = this.commonDataService.uname;
    this.getNotificationTypeID();
    this.getAllDesignations();
    this.getAllRoles(this.providerServiceMapID);

    this.currentDate.setHours(0);
    this.currentDate.setMinutes(0);
    this.currentDate.setSeconds(0);
    this.currentDate.setMilliseconds(0);
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
  getAllRoles(providerServiceMapID) {
    this.notification_service.getRoles(this.providerServiceMapID).subscribe(
      (response) => {
        if (response.data.length != 0) {
          this.roles = response.data.filter((item) => {
            return item.featureName.length != 0;
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAllDesignations() {
    this.notification_service.getAllDesignations().subscribe(
      (response) => {
        if (response.length > 0) {
          console.log(response, "designations");
          this.designations = response;
        }
      },
      (err) => {
        console.log(err, "error in getting designations");
      }
    );
  }

  getNotificationTypeID() {
    this.notification_service
      .getNotificationTypes(this.providerServiceMapID)
      .subscribe(
        (response) => {
          this.notificationTypeSuccess(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  notificationTypeSuccess(res) {
    this.emergency_contact_related_data = res.filter((notification) => {
      return notification.notificationType == "Emergency Contact";
    });
    console.log(this.emergency_contact_related_data, "notificationTypeID");
    this.notificationTypeID =
      this.emergency_contact_related_data[0].notificationTypeID;

    // get emergency contacts history

    this.getEmergencyList(
      this.providerServiceMapID,
      this.emergency_contact_related_data[0].notificationTypeID
    );
  }

  getEmergencyList(providerServiceMapID, notificationTypeID) {
    const obj = {
      providerServiceMapID: providerServiceMapID,
      notificationTypeID: notificationTypeID,
    };

    this.notification_service.getSupervisorEmergencyContacts(obj).subscribe(
      (response) => {
        if (response.data) {
          console.log(
            "Supervisor Emergency Contacts success callback",
            response.data
          );
          this.emergencyList = response.data;
        }
      },
      (err) => {
        console.log("error", err);
      }
    );
  }

  push2buffer(object) {
    const obj = {
      providerServiceMapID: this.providerServiceMapID,
      notificationTypeID: this.notificationTypeID,
      createdBy: this.createdBy,
      designationID: object.designation.designationID,
      emergContactName:
        object.name !== undefined && object.name !== null
          ? object.name.trim()
          : null,
      location:
        object.location !== undefined && object.location !== null
          ? object.location.trim()
          : null,
      emergContactNo: object.contactNumber,
      designationName: object.designation.designationName,
    };
    if (this.bufferArray.length === 0) {
      let flag2 = false;
      for (let j = 0; j < this.emergencyList.length; j++) {
        if (this.emergencyList[j].emergContactNo === object.contactNumber) {
          flag2 = true;
          break;
        }
      }
      if (!flag2) {
        this.bufferArray.push(obj);
        this.emergencyContactForm.reset();
      } else {
        console.log("Duplicate exists");
        this.emergencyContactForm.reset();
      }
    } else if (this.bufferArray.length > 0) {
      let flag1 = false;
      let flag2 = false;
      for (let i = 0; i < this.bufferArray.length; i++) {
        if (this.bufferArray[i].emergContactNo === object.contactNumber) {
          flag1 = true;
          break;
        }
      }

      for (let j = 0; j < this.emergencyList.length; j++) {
        if (this.emergencyList[j].emergContactNo === object.contactNumber) {
          flag2 = true;
          break;
        }
      }

      if (flag1 === false && flag2 === false) {
        this.bufferArray.push(obj);
        this.emergencyContactForm.reset();
      } else {
        console.log("Duplicate exists");
        this.emergencyContactForm.reset();
      }
    }
  }

  remove(index) {
    this.bufferArray.splice(index, 1);
  }

  createEmergencyContact(array) {
    if (array.length !== 0) {
      this.notification_service.createEmergencyContacts(array).subscribe(
        (response) => {
          console.log(response, "create success");
          this.dialogService.alert(
            this.currentLanguageSet.successfullyCreated,
            "success"
          );
          // this.emergencyContactForm.reset();
          this.getEmergencyList(
            this.providerServiceMapID,
            this.notificationTypeID
          );
          this.tableMode();
          this.bufferArray = [];
          //emergency contacts array pushed as single socket notification to all roles
          let roomArray = [];
          for (var i = 0; i < this.roles.length; i++) {
            roomArray.push(this.roles[i].roleName);
          }
          this.notification_service
            .sendSocketNotification({
              room: roomArray,
              type: "Emergency_Contact",
              message: "Emergency Contacts added",
              subject: array.length.toString(),
            })
            .subscribe(
              (response) => {
                console.log(response.data);
              },
              (error) => {
                console.log(error);
              }
            );
        },
        (err) => {
          console.log("error", err);
          this.dialogService.alert(
            this.currentLanguageSet.failedToCreate,
            "error"
          );
        }
      );
    }
  }

  edit(object) {
    this.editMode();
    if (object !== undefined && object !== null) {
      this.editData = object;

      this.name = object.emergContactName;
      this.designation = object.designation.designationID;
      this.location = object.location;
      this.contactNumber = object.emergContactNo;
    }
  }

  update(formvalue) {
    this.editData["emergContactName"] = formvalue.name
      ? formvalue.name.trim()
      : null;
    this.editData["designationID"] = formvalue.designation
      ? formvalue.designation.trim()
      : null;
    this.editData["emergContactNo"] = formvalue.contactNumber
      ? formvalue.contactNumber.trim()
      : null;
    this.editData["location"] = formvalue.location
      ? formvalue.location.trim()
      : null;

    this.notification_service.updateEmergencyContacts(this.editData).subscribe(
      (response) => {
        if (response.data) {
          console.log(response.data.response, "edited successfully");
          this.dialogService.alert(
            this.currentLanguageSet.editedSuccessfully,
            "success"
          );
          // this.editEmergencyContactForm.reset();
          this.getEmergencyList(
            this.providerServiceMapID,
            this.notificationTypeID
          );
          this.tableMode();
        }
      },
      (err) => {
        console.log(err, "edit failed");
        this.dialogService.alert(this.currentLanguageSet.failedToEdit, "error");
      }
    );
  }

  activate(object, value) {
    if (object.deleted) {
      object.deleted = value;
    } else {
      object["deleted"] = value;
    }

    this.notification_service.updateEmergencyContacts(object).subscribe(
      (response) => {
        if (response.data) {
          console.log(response.data.response, "ACTIVATED SUCCESSFULLY");
          this.dialogService.alert(
            this.currentLanguageSet.activatedSuccessfully,
            "success"
          );
          this.getEmergencyList(
            this.providerServiceMapID,
            this.notificationTypeID
          );
        }
      },
      (err) => {
        console.log(err, "ACTIVATION FAILED");
        this.dialogService.alert(
          this.currentLanguageSet.failedToActivate,
          "error"
        );
      }
    );
  }

  deactivate(object, value) {
    if (object.deleted) {
      object.deleted = value;
    } else {
      object["deleted"] = value;
    }

    this.notification_service.updateEmergencyContacts(object).subscribe(
      (response) => {
        if (response.data) {
          console.log(response.data.response, "DEACTIVATED SUCCESSFULLY");
          this.dialogService.alert(
            this.currentLanguageSet.deactivatedSuccessfully,
            "success"
          );
          this.getEmergencyList(
            this.providerServiceMapID,
            this.notificationTypeID
          );
        }
      },
      (err) => {
        console.log(err, "DEACTIVATION FAILED");
        this.dialogService.alert(
          this.currentLanguageSet.failedToDeactivate,
          "error"
        );
      }
    );
  }

  tableMode() {
    this.showTable = true;
    this.showForm = false;
    this.showEditForm = false;
    this.bufferArray = [];
    this.editEmergencyContactForm.reset();
    this.emergencyContactForm.reset();
  }

  formMode() {
    this.showTable = false;
    this.showForm = true;
    this.showEditForm = false;
  }

  editMode() {
    this.showTable = false;
    this.showForm = false;
    this.showEditForm = true;
  }
}
