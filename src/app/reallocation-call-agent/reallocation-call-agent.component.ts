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


import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { AgentSearchRecordService } from '../services/supervisorService/agent-search-records.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { LoaderComponent } from '../loader/loader.component';
import { MdDialog } from '@angular/material';
import { ACAService } from '../services/supervisorService/agent-call-allocation.service';
import { NotificationService } from '../services/notificationService/notification-service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';
declare var jQuery: any;

@Component({
  selector: 'app-reallocation-call-agent',
  templateUrl: './reallocation-call-agent.component.html',
  styleUrls: ['./reallocation-call-agent.component.css']
})
export class ReallocationCallAgentComponent implements OnInit {

  @ViewChild('reallocationForm') reallocationForm: NgForm;
  showFlag: boolean = false;
  onAgentSelected: boolean = false;
  tab: number = 1;
  providerServiceMapID: any;
  totalAgentsRecords: any;
  agentIDs = [];
  agentNames = [];
  records: any;
  postData: any;
  users: any;
  roleObjArray = [];
  agentChoice1: number;
  selectedAgent: string;
  sDate: any;
  eDate: any;
  languageComponent: SetLanguageComponent;
  showDateValidation: boolean = false;
  
  currentLanguageSet: any;

  constructor(private dataService: dataService, private ASRService: AgentSearchRecordService,private httpServiceService: HttpServices, public dialog: MdDialog, private _ACAService: ACAService, private notificationService: NotificationService, private alertService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.fetchLanguageResponse();
    this.providerServiceMapID = this.dataService.currentService.serviceID;
    this.notificationService.getRoles(this.providerServiceMapID)
      .subscribe((response) => {
        console.log(response);
        this.roleObjArray = response.data;
        this.roleObjArray = this.roleObjArray.filter((obj) => {
          return obj.roleName.trim().toLowerCase() != "provideradmin" && obj.roleName.trim().toLowerCase() != "supervisor";
        })
        // this.agentChoice1 = this.roleObjArray.filter((obj)=>{
        // 	return obj.roleName.trim().toLowerCase()=="anm";
        // })[0].roleID;
        // console.log('this.agentChoice1',this.agentChoice1);

        // this._ACAService.getAgents({
        // 	"providerServiceMapID": this.providerServiceMapID,
        // 	"RoleID": this.agentChoice1
        // }).subscribe((resProviderData) =>{
        // 		console.log("reading...") 
        // 		this.users = resProviderData.data;
        // 		console.log("users: ",this.users); 
        // });
      })
  }

  setStartDate(value) {
    this.sDate = new Date(value);
    this.sDate.setHours(0);
    this.sDate.setMinutes(0);
    this.sDate.setSeconds(0);
    this.sDate.setMilliseconds(0)
  }
  setEndDate(value) {
    this.eDate = new Date(value);
    this.eDate.setHours(23);
    this.eDate.setMinutes(59);
    this.eDate.setSeconds(59);
    this.eDate.setMilliseconds(0);
  }

  searchReqObjChange(choice) {
    this.agentChoice1 = choice;
    console.log('this.agentChoice1 on sellect', this.agentChoice1);

    this._ACAService.getAgents({
      "providerServiceMapID": this.providerServiceMapID,
      "RoleID": this.agentChoice1
    }).subscribe((resProviderData) => {
      console.log("reading...")
      this.users = resProviderData.data;
      console.log("users: ", this.users);
    });
    // this.reallocationForm.form.patchValue({
    // 	agentName: []
    // });
    this.onAgentSelected = false;
    this.reallocationForm.form.reset();
  }

  onSubmit() {
    console.log(this.reallocationForm.value);
    //  let loader = this.dialog.open(LoaderComponent,{
    //     height: '75px',
    //     width: '400px',
    //     disableClose: true
    //  });
    this.postData = {
      "mctsOutboundCall": {
        "providerServiceMapID": this.providerServiceMapID
        // "callDateFrom": new Date((this.reallocationForm.value.startDate) - 1 * (this.reallocationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0,10)+"T00:00:00.000Z",
        // "callDateTo": new Date((this.reallocationForm.value.endDate) - 1 * (this.reallocationForm.value.endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0,10)+"T23:59:59.999Z"
      },
      "userIDs": this.reallocationForm.value.agentName,
      "recordType": this.reallocationForm.value.recordsType
    };
    console.log(this.reallocationForm.value);
    if (this.reallocationForm.value.startDate != '' && this.reallocationForm.value.startDate != null) {
      this.postData.mctsOutboundCall["callDateFrom"] = new Date((this.reallocationForm.value.startDate) - 1 * (this.reallocationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";
    }
    if (this.reallocationForm.value.endDate != '' && this.reallocationForm.value.endDate != null) {
      this.postData.mctsOutboundCall["callDateTo"] = new Date((this.reallocationForm.value.endDate) - 1 * (this.reallocationForm.value.endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T23:59:59.999Z";
    }
    console.log(JSON.stringify(this.postData));
    this.onAgentSelected = false;
    this.showFlag = false;
    this.agentNames = [];
    this.ASRService.getReallocationCalls(this.postData)
      .subscribe((resProviderData) => {
        // loader.close();
        console.log(resProviderData.data);
        this.totalAgentsRecords = resProviderData.data;
        this.agentIDs = Object.keys(resProviderData.data);
        for (var i = 0; i < this.agentIDs.length; i++) {
          var user = this.users.filter(function (user) {
            return user.userID == this.agentIDs[i];
          }, this);
          this.agentNames.push(user[0].firstName + " " + user[0].lastName);
          console.log(this.agentNames, "names array");
        }
        if (this.totalAgentsRecords[this.agentIDs[0]].length == 0 && this.agentIDs.length == 1) {
          this.alertService.alert(this.currentLanguageSet.noRecordsAvailable);
        }
        else {
          this.onAgentSelected = true;
        }
      },
      (error) => {
        console.log(error);
        //  loader.close();
      });
  }

  reallocationDone() {
    this.showFlag = false;
    //refreshing reallocation screen

    // let loader = this.dialog.open(LoaderComponent,{
    //     height: '75px',
    //     width: '400px',
    //     disableClose: true
    // });
    this.agentNames = [];
    this.ASRService.getReallocationCalls(this.postData)
      .subscribe((resProviderData) => {
        // loader.close();
        // console.log(resProviderData.data);
        this.totalAgentsRecords = resProviderData.data;
        this.agentIDs = Object.keys(resProviderData.data);
        for (var i = 0; i < this.agentIDs.length; i++) {
          var user = this.users.filter(function (user) {
            return user.userID == this.agentIDs[i];
          }, this);
          this.agentNames.push(user[0].firstName + " " + user[0].lastName);
          console.log(this.agentNames, "names array");
        }
      },
      (error) => {
        console.log(error);
        // loader.close();
      });
  }

  moveToBin(records, event) {
    this.ASRService.moveToBin(records)
      .subscribe((response) => {
        console.log(response);
        this.alertService.alert(response.data.response, 'success');

        //refreshing reallocation screen

        // let loader = this.dialog.open(LoaderComponent,{
        //     height: '75px',
        //     width: '400px',
        //     disableClose: true
        // });
        this.agentNames = [];
        this.ASRService.getReallocationCalls(this.postData)
          .subscribe((resProviderData) => {
            // loader.close();
            // console.log(resProviderData.data);
            this.totalAgentsRecords = resProviderData.data;
            this.agentIDs = Object.keys(resProviderData.data);
            for (var i = 0; i < this.agentIDs.length; i++) {
              var user = this.users.filter(function (user) {
                return user.userID == this.agentIDs[i];
              }, this);
              this.agentNames.push(user[0].firstName + " " + user[0].lastName);
              console.log(this.agentNames, "names array");
            }
          },
          (error) => {
            console.log(error);
            // loader.close();
          });
      },
      (error) => {
        console.log(error);
      })
  }

  blockKey(e: any) {
    if (e.keyCode === 9) {
      return true;
    }
    else {
      return false;
    }
  }

  allocateCalls(agentName, values: any, event) {
    this.selectedAgent = agentName;
    console.log("selectedAgent", this.selectedAgent);
    // console.log(event.target.className);
    if (event.target.className == "mat-button-wrapper") {
      for (var i = 0; i < event.target.parentNode.parentNode.parentNode.parentNode.children.length; i++) {
        event.target.parentNode.parentNode.parentNode.parentNode.children[i].className = "";
      }
      event.target.parentNode.parentNode.parentNode.className = "highlightTrBg";
    }
    else {
      for (var i = 0; i < event.target.parentNode.parentNode.parentNode.children.length; i++) {
        event.target.parentNode.parentNode.parentNode.children[i].className = "";
      }
      event.target.parentNode.parentNode.className = "highlightTrBg";
    }
    this.showFlag = true;
    this.records = values;

  }

  //BU40088124 23/10/2021 Integrating Multilingual Functionality --Start--
ngDoCheck(){
	this.fetchLanguageResponse();
  }
  
  fetchLanguageResponse() {
	this.languageComponent = new SetLanguageComponent(this.httpServiceService);
	this.languageComponent.setLanguage();
	this.currentLanguageSet = this.languageComponent.currentLanguageObject; 
  }
    
  validateDateRange(fromDate, toDate) {

    const oneWeekInDays = 7; // One week in days
    
  if(fromDate && toDate){
    
    const dateDiff = Math.floor((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24) ) ; // Difference between dates in days
    
    if(dateDiff > oneWeekInDays){
    
    this.showDateValidation = true;
    
    } else {
    
    this.showDateValidation = false;
    
    }
    
    }
    
    }
  
  
  //--End--
}
