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


import { Component, OnInit, Output, EventEmitter, Inject, Input, Injector } from '@angular/core';
import { DashboardHttpServices } from '../http-service/http-service.service';
import { dataService } from '../services/dataService/data.service';
import { NotificationService } from '../services/notificationService/notification-service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'alerts-notifications',
  templateUrl: './alerts-notifications.component.html',
})
export class AlertsNotificationComponent implements OnInit {
  // roleID: any;
  // workingLocationID: any;
  // service: any;
  // profile: any;

  // alertConfig: any;
  // notificationConfig: any;
  // languageConfig:any;
  // locationConfig:any;

  // alerts: any=[];
  // notifications: any=[];
  // languageAlerts:any=[];
  // locationAlerts:any=[];

  // alertPostData: any;
  // notificationPostData: any;
  // languagePostData:any;
  // locationPostData:any;

  // providerServiceMapID:any;

  // languageIDs:any=[];
  // officeIDs:any=[];

  // current_userData:any;

  // @Output() hide_component: EventEmitter<any> = new EventEmitter<any>();

  userId: any;
  providerServiceMapID: any;
  roleId: any;
  workingLocationID: any;

  alertCount: any = 0;
  notificationCount: any = 0;
  othersCount: any = 0;

  alertConfig: any;
  notificationConfig: any;
  othersConfig: any;
  @Input() alertRefresh: number;
  currentLanguageSet: any;

  constructor(private dashboardHttpServices: DashboardHttpServices,
    private dataService: dataService,
    private notificationService: NotificationService,
    public dialog: MdDialog, private alertService: ConfirmationDialogsService,public httpServices:HttpServices) { }


  ngOnInit() {

    this.assignSelectedLanguage();
    this.userId = this.dataService.uid;
    this.providerServiceMapID = this.dataService.currentService.serviceID;
    this.roleId = this.dataService.currentRole.RoleID;
    this.workingLocationID = this.dataService.current_workingLocationID;
    this.getCount();

    // this.roleID = this.dataService.current_roleID;
    // this.workingLocationID = this.dataService.current_workingLocationID;
    // this.service = this.dataService.current_service;

    // this.providerServiceMapID=this.service.serviceID;

    // this.current_userData=this.dataService.Userdata;
    // this.setLanguageIDs(this.current_userData.m_UserLangMappings);

    // console.log("providerServiceMapID" + this.service.serviceID);

    this.notificationService.getNotificationTypes(this.providerServiceMapID)
      .subscribe((response) => {
        console.log(response, "notification Types in dashboard Alert component");
        if (response) {
          this.alertConfig = response.filter((notification) => {
            return notification.notificationType == "Alert";
          });

          this.notificationConfig = response.filter((notification) => {
            return notification.notificationType == "Notification";
          });

          this.othersConfig = response.filter((notification) => {
            return notification.notificationType == "Location Message";
          });
        }
      },
      (err) => {
        console.log(err);
      });
  }
  ngDoCheck() {
		this.assignSelectedLanguage();
	  }
	
	  assignSelectedLanguage() {
			const getLanguageJson = new SetLanguageComponent(this.httpServices);
			getLanguageJson.setLanguage();
			this.currentLanguageSet = getLanguageJson.currentLanguageObject;
		  }
  getCount() {
    this.notificationService.getCount({
      'userID': this.userId,
      'roleID': this.roleId,
      'providerServiceMapID': this.providerServiceMapID
    }).subscribe((response) => {
      console.log("count api response", response.data);
      if (response.data.userNotificationTypeList.length > 0) {
        let alertObj = response.data.userNotificationTypeList.filter((item) => {
          return item.notificationType == 'Alert';
        });
        let othersObj = response.data.userNotificationTypeList.filter((item) => {
          return item.notificationType == 'Location Message';
        });
        let notificationObj = response.data.userNotificationTypeList.filter((item) => {
          return item.notificationType == 'Notification';
        });
        if (alertObj.length > 0) {
          this.alertCount = alertObj[0].notificationTypeUnreadCount;
        }
        else {
          this.alertCount = 0;
        }
        if (othersObj.length > 0) {
          this.othersCount = othersObj[0].notificationTypeUnreadCount;
        }
        else {
          this.othersCount = 0;
        }
        if (notificationObj.length > 0) {
          this.notificationCount = notificationObj[0].notificationTypeUnreadCount;
        }
        else {
          this.notificationCount = 0;
        }
        console.log("alertCount:", this.alertCount, "othersCount:", this.othersCount, "notificationCount:", this.notificationCount);
      }
      else {
        this.alertCount = 0;
        this.notificationCount = 0;
        this.othersCount = 0;
      }
    },
      (error) => {
        console.log(error);
      })
  }

  ngOnChanges() {
    if (this.alertRefresh > 1) {
      this.getCount();
    }
  }


  // getAlertsandNotifications() {
  //   if (this.alertPostData) {
  //     console.log(this.alertPostData);
  //     this.notificationService.getAlerts(this.alertPostData)
  //     .subscribe((response) => {
  //       console.log(response);
  //       this.alerts = response.data;
  //     },
  //     (err) => {
  //       console.log(err);
  //     });
  //   }
  //   if (this.notificationPostData) {
  //     console.log(this.notificationPostData);
  //     this.notificationService.getNotifications(this.notificationPostData)
  //     .subscribe((response) => {
  //       console.log(response);
  //       this.notifications = response.data;
  //     },
  //     (err) => {
  //       console.log(err);
  //     });
  //   }

  //   if (this.languagePostData) {
  //     console.log(this.languagePostData,"Request object before api hit in language");
  //     this.notificationService.getAlerts(this.languagePostData)
  //     .subscribe((response) => {
  //       console.log(response,"LANGUAGE ALERTS");
  //       this.languageAlerts= response.data;
  //     },
  //     (err) => {
  //       console.log(err);
  //     });
  //   }

  //   if (this.locationPostData) {
  //     console.log(this.locationPostData,"Request object before api hit in Location");
  //     this.notificationService.getAlerts(this.locationPostData)
  //     .subscribe((response) => {
  //       console.log(response,"LOCATION ALERTS");
  //       this.locationAlerts= response.data;
  //     },
  //     (err) => {
  //       console.log(err);
  //     });
  //   }

  // }

  // alertClicked(alert, event) {
  //   event.preventDefault();
  //   let dialog = this.dialog.open(MessageDialogComponent, {
  //    width: '400px',
  //    disableClose : true,
  //   //  height: '250px',
  //    data: {
  //     message: alert.notificationDesc,
  //     type: "Alert",
  //     kmFilePath: alert.kmFilePath
  //   }
  // });
  // }

  // notificationClicked(notification, event) {
  //   event.preventDefault();
  //   let dialog = this.dialog.open(MessageDialogComponent, {
  //     width: '400px',
  //     disableClose : true,
  //     // height: '250px',
  //     data: {
  //       message: notification.notificationDesc,
  //       type: "Notification",
  //       kmFilePath: notification.kmFilePath
  //     }

  //   });
  // }

  // setLanguageIDs(languageArray)
  // {
  //   console.log("Language skill set array",languageArray);
  //   // languageID
  //   for(let j=0;j<languageArray.length;j++)
  //   {
  //     this.languageIDs.push(languageArray[j].languageID);
  //   }
  // }

  // close() {
  //   this.hide_component.emit("3");
  // };

  // getOffsetTime() {
  //   let date = new Date();
  //   return new Date((date.getTime() - 1 * (date.getTimezoneOffset() * 60 * 1000)));
  // }

  openNotificationsDialog(messages_type) {

    let notificationTypeId;

    if (messages_type == 'Alert') {
      notificationTypeId = this.alertConfig[0].notificationTypeID;
    }
    else if (messages_type == 'Notification') {
      notificationTypeId = this.notificationConfig[0].notificationTypeID;
    }
    else {
      notificationTypeId = this.othersConfig[0].notificationTypeID;
    }

    let messages = [];

    this.notificationService.getNotificationDetails({
      "userID": this.userId,
      "roleID": this.roleId,
      "notificationTypeID": notificationTypeId,
      "providerServiceMapID": this.providerServiceMapID
    }).subscribe((response) => {
      console.log(response.data, "notification details api response");
      messages = response.data;
      messages = messages.filter((item) => item.notificationState != 'future');
      if (messages.length > 0) {
        let dialogRef = this.dialog.open(AlertsNotificationsDialogComponent, {
          width: '650px',
          // height: '500px',
          disableClose: true,
          data: {
            'msg_type': messages_type,
            'messages': messages,
            "notificationTypeID": notificationTypeId
          }
        });

        dialogRef.afterClosed()
          .subscribe((response) => {
            this.getCount();
          },
          (error) => {
            console.log(error);
          });
      }
      else {
        this.alertService.alert(this.currentLanguageSet.no +' ' + messages_type.toLowerCase() + ' '+this.currentLanguageSet.messagesFound);
      }
    },
      (error) => {
        console.log(error);
      });

    // dummy data
    // messages = [
    //     {
    //         "userNotificationMapID": 1,
    //         "notificationID": 158,
    //         "userID": 714,
    //         "roleID": 464,
    //         "providerServiceMapID": 1272,
    //         "notificationState": "read",
    //         "notificationTypeID": 18,
    //         "notificationType": "Alert",
    //         "deleted": false,
    //         "createdDate": "2018-02-16T17:53:32.000Z",
    //         "notification": {
    //             "notificationID": 158,
    //             "notification": "plz cl",
    //            "notificationDesc": "call again",
    //             "notificationTypeID": 18,
    //             "notificationType": {
    //                 "notificationTypeID": 18,
    //                 "notificationType": "Alert",
    //                 "deleted": false,
    //                 "createdBy": "Admin"
    //             },
    //             "roleID": 464,
    //             "role": {},
    //             "providerServiceMapID": 1272,
    //             "providerServiceMapping": {},
    //             "validTill": "2017-11-30T00:00:00.000Z",
    //             "validFrom": "2017-11-28T00:00:00.000Z",
    //             "deleted": false,
    //             "createdBy": "mctskarnatka",
    //             "kmFileManagerID": 118,
    //             "kmFileManager": {
    //                 "kmFileManagerID": 118,
    //                 "fileUID": "b25515dc-78dc-4413-9d25-2214162d48a4",
    //                 "fileName": "New Doc 2017-11-13_1.jpg",
    //                 "fileExtension": ".jpg",
    //                 "versionNo": "V1",
    //                 "fileCheckSum": "a2844ee5da12d372aa08d432d0ba24a2",
    //                 "providerServiceMapID": 1272,
    //                 "userID": 714,
    //                 "kmUploadStatus": "Completed",
    //                 "validFrom": "2017-11-28T00:00:00.000Z",
    //                 "validUpto": "2017-11-30T00:00:00.000Z",
    //                 "deleted": false,
    //                 "createdBy": "mctskarnatka",
    //                 "createdDate": "2017-11-28T12:30:35.000Z"
    //             }
    //         }
    //     },
    //     {
    //         "userNotificationMapID": 2,
    //         "notificationID": 160,
    //         "userID": 714,
    //         "roleID": 464,
    //         "providerServiceMapID": 1272,
    //         "notificationState": "read",
    //         "notificationTypeID": 18,
    //         "notificationType": "Alert",
    //         "deleted": false,
    //         "createdDate": "2018-02-16T17:59:14.000Z",
    //         "notification": {
    //             "notificationID": 160,
    //             "notification": "plz cl",
    //             "notificationDesc": "call again....",
    //             "notificationTypeID": 18,
    //             "notificationType": {
    //                 "notificationTypeID": 18,
    //                 "notificationType": "Alert",
    //                 "deleted": false,
    //                 "createdBy": "Admin"
    //             },
    //             "roleID": 466,
    //             "role": {},
    //             "providerServiceMapID": 1272,
    //             "providerServiceMapping": {},
    //             "validTill": "2017-12-01T00:00:00.000Z",
    //             "validFrom": "2017-11-28T00:00:00.000Z",
    //             "deleted": false,
    //             "createdBy": "mctskarnatka",
    //             "kmFileManagerID": 120,
    //             "kmFileManager": {
    //                 "kmFileManagerID": 120,
    //                 "fileUID": "13ef922c-07b8-4f48-b72b-838497ba6773",
    //                 "fileName": "New Doc 2017-11-13_1.jpg",
    //                 "fileExtension": ".jpg",
    //                 "versionNo": "V3",
    //                 "fileCheckSum": "a2844ee5da12d372aa08d432d0ba24a2",
    //                 "providerServiceMapID": 1272,
    //                 "userID": 714,
    //                 "kmUploadStatus": "Completed",
    //                 "validFrom": "2017-11-28T00:00:00.000Z",
    //                 "validUpto": "2017-11-30T00:00:00.000Z",
    //                 "deleted": false,
    //                 "createdBy": "mctskarnatka",
    //                 "createdDate": "2017-11-28T12:30:37.000Z"
    //             }
    //         }
    //    }
    // ];
  }

}


@Component({
  selector: 'app-alerts-notifications-dialog',
  templateUrl: './alerts-notifications-dialog.html',
})
export class AlertsNotificationsDialogComponent {

  messages: any = [];
  heading: any;
  notificationTypeID: any;
  notificationIDArray: any = [];
  currentLanguageSet: any;
  

  constructor( @Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog,
    private httpServiceService: HttpServices,
    public dialogRef: MdDialogRef<AlertsNotificationsDialogComponent>,
    private notificationService: NotificationService,public httpServices:HttpServices,
    private dataService: dataService, private alertService: ConfirmationDialogsService,private injector:Injector) {
    this.initialize(this.data);
    this.httpServices = injector.get(HttpServices);

  }

  ngOnInit (){
    this.assignSelectedLanguage();
  }

  ngDoCheck() {
		this.assignSelectedLanguage();
	  }
	
	  assignSelectedLanguage() {
			const getLanguageJson = new SetLanguageComponent(this.httpServices);
			getLanguageJson.setLanguage();
			this.currentLanguageSet = getLanguageJson.currentLanguageObject;
		  }

  initialize(data) {
    this.messages = data.messages;
    this.heading = data.msg_type;
    this.notificationTypeID = data.notificationTypeID;
    this.messages.map((item) => {
      this.notificationIDArray.push(item.userNotificationMapID);
    }, this);
  }

  unreadAll() {
    console.log("call api and on success re initialize messages");
    this.notificationService.changeNotificationStatus({
      "notficationStatus": "unread",
      "userNotificationMapIDList": this.notificationIDArray
    }).subscribe((response) => {
      console.log(response.data, "unread all api response");
      if (response.data.status == 'success')
        this.reInitialize();
    },
      (error) => {
        console.log(error);
      });
  }

  readAll() {
    console.log("call api and on success re initialize messages");
    this.notificationService.changeNotificationStatus({
      "notficationStatus": "read",
      "userNotificationMapIDList": this.notificationIDArray
    }).subscribe((response) => {
      console.log(response.data, "read all api response");
      if (response.data.status == 'success')
        this.reInitialize();
    },
      (error) => {
        console.log(error);
      });
  }

  unreadSingle(id) {
    let notificationIDArray = [id];
    this.notificationService.changeNotificationStatus({
      "notficationStatus": "unread",
      "userNotificationMapIDList": notificationIDArray
    }).subscribe((response) => {
      if (response.data.status == 'success') {
        this.reInitialize();
      }
    },
      (error) => {
        console.log(error);
      });
  }
  readSingle(id) {
    let notificationIDArray = [id];
    this.notificationService.changeNotificationStatus({
      "notficationStatus": "read",
      "userNotificationMapIDList": notificationIDArray
    }).subscribe((response) => {
      if (response.data.status == 'success') {
        this.reInitialize();
      }
    },
      (error) => {
        console.log(error);
      });
  }

  deleteNotification(id) {
    console.log(id, "use id and call api, on success re initialize messages");
    this.alertService.confirm('', this.currentLanguageSet.areYouSureYouWantToDelete)
      .subscribe((res) => {
        if(res) {
        this.notificationService.deleteNotification({
          "isDeleted": true,
          "userNotificationMapIDList": [
            id
          ]
        }).subscribe((response) => {
          console.log(response.data, "delete notification api response");
          if (response.data.status == 'success')
            this.reInitialize();
        },
          (error) => {
            console.log(error);
          })
        }
      },
      (error) => {
        console.log(error);
      })
    
  }

  reInitialize() {
    this.notificationService.getNotificationDetails({
      "userID": this.dataService.uid,
      "roleID": this.dataService.currentRole.RoleID,
      "notificationTypeID": this.notificationTypeID,
      "providerServiceMapID": this.dataService.currentService.serviceID
    }).subscribe((response) => {
      console.log(response.data, "notification messages refreshed response");
      this.messages = response.data;
      this.messages = this.messages.filter((item) => item.notificationState != 'future');
      this.notificationIDArray = [];
      this.messages.map((item) => {
        this.notificationIDArray.push(item.userNotificationMapID);
      }, this);
    },
      (error) => {
        console.log(error);
      });
  }

}
