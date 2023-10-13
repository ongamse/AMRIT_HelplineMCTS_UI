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


import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { enableProdMode } from '@angular/core';
//import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { MdDialog } from '@angular/material';
import { AgentSearchRecordService } from '../services/supervisorService/agent-search-records.service';
import { QuestionaireService } from '../services/questionaireService/questionaire-service';
import { dataService } from '../services/dataService/data.service';
import { LoaderComponent } from '../loader/loader.component';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';
//import { DatePipe } from '@angular/common';
//import {formatDate} from '@angular/common';
//import {formatDate} from '@angular/common';

declare var jQuery: any;

@Component({
  selector: 'app-agent-search-records',
  templateUrl: './agent-search-records.component.html',
  styleUrls: ['./agent-search-records.component.css'],
  providers:[]
})

export class AgentSearchRecordsComponent implements OnInit {
  public showCreateFlag = false;
  serviceProviders: string[];
  data: any;
  count: any;
  records: any;

  showFlag: boolean = false;
  _unAllocatedCalls = [];
  mother_unAllocatedCalls = [];
  mother_callSplit = [];
  child_unAllocatedCalls = [];
  child_callSplit = [];
  ancCallTypes = [];
  pncCallTypes = [];
  _motherCalls = [];
  _childCalls = [];
  _mother_selfNoCalls_HRS = [];
  _mother_selfNoCalls_HRS_callSplit = [];
  _mother_selfNoCalls_NRM = [];
  _mother_selfNoCalls_NRM_callSplit = [];
  _mother_otherNoCalls_HRS = [];
  _mother_otherNoCalls_HRS_callSplit = [];
  _mother_otherNoCalls_NRM = [];
  _mother_otherNoCalls_NRM_callSplit = [];
  _child_selfNoCalls = [];
  _child_selfNoCalls_callSplit = [];
  _child_otherNoCalls = [];
  _child_otherNoCalls_callSplit = [];
  _mother_allocated_calls = [];
  _child_allocated_calls = [];


  tot_unAllocatedCalls: any;
  tot_mother_unAllocatedCalls: any;
  tot_child_unAllocatedCalls: any;
  tot_mother_selfNoCalls_HRS: any;
  tot_mother_selfNoCalls_NRM: any;
  tot_mother_otherNoCalls_HRS: any;
  tot_mother_otherNoCalls_NRM: any;
  tot_child_selfNoCalls: any;
  tot_child_otherNoCalls: any;
  tot_mother_allocated_calls: any;
  tot_child_allocated_calls: any;
  public providerServiceMapID;
  public userID;
  public createdBy;
  public moved: string;
  postData: any;
  _object: any;
  @ViewChild('f') dateForm: NgForm;
  minDate: Date;
  refreshPostObj: any;
  allocateAllFlag = true;
  sDate: any;
  eDate: any;
  newDate: any;
  pDate: any;
  qDate: any;
  currentLanguageSet: any;
  showDateValidation: boolean = false;
 
  

  constructor(private _ASRService: AgentSearchRecordService,public httpServices:HttpServices,
     private dataService: dataService, public dialog: MdDialog, private questionaireService: QuestionaireService, private alertService: ConfirmationDialogsService) 
     
     {
    this.serviceProviders;
    
    
  }

  ngOnInit() {
    this.providerServiceMapID = this.dataService.currentService.serviceID;
    this.userID = this.dataService.uid;
    this.createdBy = this.dataService.uname;
    this.getCallTypes();
    
    var someDate = new Date();
    var numberOfDaysToAdd = 7;
    var result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
    var final = new Date(result);
    console.log(new Date(result))
    
   
    this._object = {
      "providerServiceMapID": this.providerServiceMapID,

  

           "callDateFrom" : (new Date().toISOString().slice(0,10)) + "T00:00:00.000Z",
            "callDateTo": (new Date().toISOString().slice(0,10)) + "T23:59:59.999Z"

     
     
    
    };

    
    this.getUnallocatedCalls(this._object);
    this.minDate = new Date();

     
    

  }


  ngDoCheck() {
		this.assignSelectedLanguage();
	  }
	
	  assignSelectedLanguage() {
			const getLanguageJson = new SetLanguageComponent(this.httpServices);
			getLanguageJson.setLanguage();
			this.currentLanguageSet = getLanguageJson.currentLanguageObject;
		  }
  getCallTypes() {
    this.questionaireService.getCallTypes({
      "providerServiceMapID": this.providerServiceMapID
    }).subscribe((response) => {
      this.pncCallTypes = response.data.filter((obj) => {
        return obj.outboundCallType.slice(0, -1) == "PNC";
      });
      this.ancCallTypes = response.data.filter((obj) => {
        return obj.outboundCallType.slice(0, -1) == "ANC";
      });
    },
      (error) => {

      });
  }

  getUnallocatedCalls(reqObject) {
    this._ASRService.getUnallocatedCalls(reqObject)
      .subscribe(resProviderData => {
        //console.log(resProviderData, "response from unallocated calls api");
        this._unAllocatedCalls = resProviderData.data;
        console.log("this._unAllocatedCalls.length", this._unAllocatedCalls.length);

        if (this._unAllocatedCalls.length != 0) {
          this._motherCalls = this._unAllocatedCalls.filter(each => {
            // return each.outboundCallType.slice(0, -1) == "ANC";
            // console.log("ANC", each.outboundCallType.indexOf("ANC"));
            
            return each.outboundCallType.indexOf("ANC") === 0;
          });

          console.log("this._motherCalls.length", this._motherCalls.length);

          this._mother_allocated_calls = this._motherCalls.filter(eachdata => {
            if (eachdata.mctsDataReaderDetail && eachdata.allocationStatus ) {
              return eachdata.allocationStatus === "allocated"
            }
          });

          console.log("this._mother_allocated_calls.length", this._mother_allocated_calls.length);

          this.mother_unAllocatedCalls = this._motherCalls.filter(eachdata => {
            if (eachdata.mctsDataReaderDetail && eachdata.allocationStatus ) {
              return eachdata.allocationStatus === "unallocated"
            }
          });
          console.log("this.mother_unAllocatedCalls.length", this.mother_unAllocatedCalls.length);

          // this.mother_unAllocatedCalls = this._unAllocatedCalls.filter(each => {
          //   return each.outboundCallType.slice(0, -1) == "ANC";
          // });

          this._childCalls = this._unAllocatedCalls.filter(each => {
            // return each.outboundCallType.slice(0, -1) == "PNC";
            // console.log("PNC", each.outboundCallType.indexOf("PNC"));
            return each.outboundCallType.indexOf("PNC") === 0;
          })
          console.log("this._childCalls.length", this._childCalls.length);

          this._child_allocated_calls = this._childCalls.filter(eachdata => {
            if (( eachdata.mctsDataReaderDetail || eachdata.childValidDataHandler) && eachdata.allocationStatus ) {
              return eachdata.allocationStatus === "allocated"
            }
          });
          console.log("this._child_allocated_calls.length", this._child_allocated_calls.length);

          this.child_unAllocatedCalls = this._childCalls.filter(eachdata => {
            if (( eachdata.mctsDataReaderDetail || eachdata.childValidDataHandler) && eachdata.allocationStatus ) {
              return eachdata.allocationStatus === "unallocated"
            }
          });
          console.log("this.child_unAllocatedCalls.length", this.child_unAllocatedCalls.length);

          this.tot_mother_allocated_calls = this._mother_allocated_calls.length;
          this.tot_child_allocated_calls = this._child_allocated_calls.length;
          this.tot_unAllocatedCalls = this._unAllocatedCalls.length;
          console.log(this.tot_unAllocatedCalls, "total calls");
          if (this.mother_unAllocatedCalls) {
            console.log('Unallocated calls :', this.mother_unAllocatedCalls)
            this.tot_mother_unAllocatedCalls = this.mother_unAllocatedCalls.length;
            console.log(this.tot_mother_unAllocatedCalls, "mother calls");
            this._mother_selfNoCalls_HRS = this.mother_unAllocatedCalls.filter(eachdata => {
              if (eachdata.mctsDataReaderDetail && eachdata.mctsDataReaderDetail.PhoneNo_Of_Whom && eachdata.mctsDataReaderDetail.High_Risk) {
                return eachdata.mctsDataReaderDetail.PhoneNo_Of_Whom === "Self" && eachdata.mctsDataReaderDetail.High_Risk == true
              }
            });

            this._mother_selfNoCalls_NRM = this.mother_unAllocatedCalls.filter(eachdata => {
              if (eachdata.mctsDataReaderDetail && eachdata.mctsDataReaderDetail.PhoneNo_Of_Whom) {
                return eachdata.mctsDataReaderDetail.PhoneNo_Of_Whom === "Self"
              }
            });

            this._mother_otherNoCalls_HRS = this.mother_unAllocatedCalls.filter(eachdata => {
              if (eachdata.mctsDataReaderDetail && eachdata.mctsDataReaderDetail.PhoneNo_Of_Whom && eachdata.mctsDataReaderDetail.High_Risk) {
                return eachdata.mctsDataReaderDetail.PhoneNo_Of_Whom != "Self" && eachdata.mctsDataReaderDetail.High_Risk == true
              }
            });

            this._mother_otherNoCalls_NRM = this.mother_unAllocatedCalls.filter(eachdata => {
              if (eachdata.mctsDataReaderDetail && eachdata.mctsDataReaderDetail.PhoneNo_Of_Whom) {
                return eachdata.mctsDataReaderDetail.PhoneNo_Of_Whom != "Self"
              }
            });

            this.tot_mother_selfNoCalls_HRS = this._mother_selfNoCalls_HRS.length;

            //console.log('this._mother_selfNoCalls_HRS', this._mother_selfNoCalls_HRS);

            this.tot_mother_selfNoCalls_NRM = this._mother_selfNoCalls_NRM.length;

            //console.log('_mother_selfNoCalls_NRM', this._mother_selfNoCalls_NRM);

            this.tot_mother_otherNoCalls_HRS = this._mother_otherNoCalls_HRS.length;

            //console.log('this._mother_otherNoCalls_HRS', this._mother_otherNoCalls_HRS);

            this.tot_mother_otherNoCalls_NRM = this._mother_otherNoCalls_NRM.length;

            //console.log('this._mother_otherNoCalls_NRM', this._mother_otherNoCalls_NRM);


            this.mother_callSplit = [];
            this._mother_selfNoCalls_HRS_callSplit = [];
            this._mother_selfNoCalls_NRM_callSplit = [];
            this._mother_otherNoCalls_NRM_callSplit = [];
            this._mother_otherNoCalls_HRS_callSplit = [];

            for (var i = 1; i <= this.ancCallTypes.length; i++) {
              this.mother_callSplit.push(this.mother_unAllocatedCalls.filter((obj) => {
                return obj.outboundCallType == "ANC" + i;
              }).length);
              this._mother_selfNoCalls_HRS_callSplit.push(this._mother_selfNoCalls_HRS.filter((obj) => {
                return obj.outboundCallType == "ANC" + i;
              }).length);
              this._mother_selfNoCalls_NRM_callSplit.push(this._mother_selfNoCalls_NRM.filter((obj) => {
                return obj.outboundCallType == "ANC" + i;
              }).length);
              this._mother_otherNoCalls_NRM_callSplit.push(this._mother_otherNoCalls_NRM.filter((obj) => {
                return obj.outboundCallType == "ANC" + i;
              }).length);
              this._mother_otherNoCalls_HRS_callSplit.push(this._mother_otherNoCalls_HRS.filter((obj) => {
                return obj.outboundCallType == "ANC" + i;
              }).length);
            }
          }
          if (this.child_unAllocatedCalls) {
            console.log('Child Unallocated calls :', JSON.stringify(this.child_unAllocatedCalls, null, 4))

            this.tot_child_unAllocatedCalls = this.child_unAllocatedCalls.length;
            console.log(this.tot_child_unAllocatedCalls, "child calls");
            this._child_selfNoCalls = this.child_unAllocatedCalls.filter((eachdata) => {
              if (eachdata.childValidDataHandler && eachdata.childValidDataHandler.Phone_No_of) {
                return eachdata.childValidDataHandler.Phone_No_of === "Self"
              }
              if (eachdata.mctsDataReaderDetail && eachdata.mctsDataReaderDetail.PhoneNo_Of_Whom) {
                return eachdata.mctsDataReaderDetail.PhoneNo_Of_Whom === "Self"
              }
            });

            this._child_otherNoCalls = this.child_unAllocatedCalls.filter(eachdata => {
              if (eachdata.childValidDataHandler && eachdata.childValidDataHandler.Phone_No_of) {
                return eachdata.childValidDataHandler.Phone_No_of != "Self"
              }
              if (eachdata.mctsDataReaderDetail && eachdata.mctsDataReaderDetail.PhoneNo_Of_Whom) {
                return eachdata.mctsDataReaderDetail.PhoneNo_Of_Whom != "Self"
              }
            });

            this.tot_child_selfNoCalls = this._child_selfNoCalls.length;
            this.tot_child_otherNoCalls = this._child_otherNoCalls.length;

            this.child_callSplit = [];
            this._child_selfNoCalls_callSplit = [];
            this._child_otherNoCalls_callSplit = [];

            for (var i = 1; i <= this.pncCallTypes.length; i++) {
              this.child_callSplit.push(this.child_unAllocatedCalls.filter((obj) => {
                return obj.outboundCallType == "PNC" + i;
              }).length);
              this._child_selfNoCalls_callSplit.push(this._child_selfNoCalls.filter((obj) => {
                return obj.outboundCallType == "PNC" + i;
              }).length);
              this._child_otherNoCalls_callSplit.push(this._child_otherNoCalls.filter((obj) => {
                return obj.outboundCallType == "PNC" + i;
              }).length);
            }
          }
        }
        else {
                this.tot_mother_unAllocatedCalls = 0;
                this.tot_mother_selfNoCalls_NRM = 0;
                this.tot_mother_otherNoCalls_NRM = 0;
                this.tot_mother_selfNoCalls_HRS = 0;
                this.tot_mother_otherNoCalls_HRS = 0;
      
                this.tot_child_unAllocatedCalls = 0;
                this.tot_child_selfNoCalls = 0;
                this.tot_child_otherNoCalls = 0;
      
                this.mother_callSplit = [];
                this._mother_selfNoCalls_NRM_callSplit = [];
                this._mother_otherNoCalls_NRM_callSplit = [];
                this._mother_selfNoCalls_HRS_callSplit = [];
                this._mother_otherNoCalls_HRS_callSplit = [];
      
                this.child_callSplit = [];
                this._child_selfNoCalls_callSplit = [];
                this._child_otherNoCalls_callSplit = [];
      
                this.alertService.alert(this.currentLanguageSet.noRecordsAvailable);
              }
      });
  }

  onSubmit() {
    this.showFlag = false;
    this.postData = {
      "providerServiceMapID": this.providerServiceMapID,
      "callDateFrom": new Date((this.dateForm.value.fromDate) - 1 * (this.dateForm.value.fromDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z",
      "callDateTo": new Date((this.dateForm.value.toDate) - 1 * (this.dateForm.value.toDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T23:59:59.999Z"
    };
    console.log(JSON.stringify(this.postData));
    this.getUnallocatedCalls(this.postData);
  }

  blockKey(e: any) {
    if (e.keyCode === 9) {
      return true;
    }
    else {
      return false;
    }
  }

  allocationDone() {
    this.showFlag = false;
    console.log("refreshing after allocation");
    if (this.postData == undefined) {
      this.refreshPostObj = this._object;
    }
    else {
      this.refreshPostObj = this.postData;
    }
    this.getUnallocatedCalls(this.refreshPostObj);
  }

  trs: any;
  allocateCalls(values: any, event) {

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
    console.log("records passed", this.records.length);
    console.log("function parameter", values.length);
  }

  tab: number = 1;
  changeService(val) {
    if (val != this.tab) {
      this.showFlag = false;
    }
    this.tab = val;
    jQuery("#service" + val).parent().find("li").removeClass();
    jQuery("#service" + val).addClass("animation-nav-active");

    jQuery("#service" + val).parent().find('a').removeClass();
    jQuery("#service" + val + " a").addClass("f-c-o");
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
}

function dateformate(newDate: any) {
  throw new Error('Function not implemented.');
}
