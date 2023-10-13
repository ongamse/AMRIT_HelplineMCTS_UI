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


import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import { dataService } from '../../services/dataService/data.service';
import { CallClosureService } from '../../services/mcts-agent/call-closure/call-closure.service';
import { ReportService } from './../report-services/report.service';
import { ConfirmationDialogsService } from '../../services/dialog/confirmation.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-call-summary-reports',
  templateUrl: './call-summary-reports.component.html',
  styleUrls: ['./call-summary-reports.component.css']
})
export class CallSummaryReportsComponent implements OnInit {

  callSummaryForm: FormGroup;
  languageComponent: SetLanguageComponent;
  
  currentLanguageSet: any;

  constructor(private formBuilder: FormBuilder,private httpServiceService: HttpServices, private dataService: dataService,
    private callClosureService: CallClosureService, private reportService: ReportService,
    private alertService: ConfirmationDialogsService) { }

  providerServiceMapID: any;
  types = [{ typeName: 'Mother', typeId: true }, { typeName: 'Child', typeId: false }];
  today: Date;
  minEndDate: Date;
  maxDate: any;
  maxEndDate: Date;
  callSummaryList = [];
  dateOffset: any;

  //added to get agent ids
  agents: any = [];

  //boolean added to check if mother or child or both
  whichReport: Boolean;

  ngOnInit() {
    this.fetchLanguageResponse();
    this.providerServiceMapID = { 'providerServiceMapID': this.dataService.currentService.serviceID };
    this.types;
    this.agents;
    this.getAgentIDs();
    this.createCallSummaryForm();
    this.today = new Date();

    this.dateOffset = (24 * 60 * 60 * 1000);
    // this.maxEndDate = new Date(this.today.setTime(this.today.getTime()));
    this.maxEndDate = new Date();
    this.maxEndDate.setDate(this.today.getDate() -1 );
  }

  createCallSummaryForm() {
    this.callSummaryForm = this.formBuilder.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      isMother: [null, Validators.required],
      providerServiceMapID: this.providerServiceMapID.providerServiceMapID,
      agentID: [null, Validators.required]
    })
  }

  get startDate() {
    return this.callSummaryForm.controls['startDate'].value;
  }

  get endDate() {
    return this.callSummaryForm.controls['endDate'].value;
  }

  get type() {
    return this.callSummaryForm.controls['isMother'].value;
  }

  get agentID() {
    return this.callSummaryForm.controls['agentID'].value;
  }

  checkEndDate() {
    console.log('', this.startDate);

    this.minEndDate = new Date(this.startDate);
    if (this.endDate == null) {
      console.log("new Date(this.today.getDate() - 1);", new Date(this.today));
    } else {
      this.callSummaryForm.patchValue({
        endDate: null, isMother: null, agentID: null
      })
    }
  }

  getAgentIDs() {
    console.log('this.providerServiceMapID', this.providerServiceMapID);

    this.callClosureService.getAgentIDs(this.providerServiceMapID).subscribe((response) => {
      //console.log("Agents : ", response);
      this.agents = response.data;
    })
  }
  
  searchReport() {
    let startDate: Date = new Date(this.callSummaryForm.value.startDate);
    let endDate: Date = new Date(this.callSummaryForm.value.endDate);

    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    console.log("Data form value...", JSON.stringify(this.callSummaryForm.value));
    let reqObjForCallSummaryReport = {
      "startDate": new Date(startDate.valueOf() - 1 * startDate.getTimezoneOffset() * 60 * 1000),
      "endDate": new Date(endDate.valueOf() - 1 * endDate.getTimezoneOffset() * 60 * 1000),
      "isMother": this.callSummaryForm.value.isMother,
      "providerServiceMapID": this.callSummaryForm.value.providerServiceMapID,
      "userID": this.callSummaryForm.value.agentID
    }
    this.whichReport = this.callSummaryForm.value.isMother;
    console.log("Data form data", JSON.stringify(reqObjForCallSummaryReport, null, 4));

    this.reportService.getCallSummaryReports(reqObjForCallSummaryReport).subscribe((response) => {
      console.log("Json data of response: ", JSON.stringify(response, null, 4));
      if (response.statusCode == 200) {
        this.callSummaryList = response.data;
        this.getResponseOfSearchThenDo();
      }
    })
  }

  downloadReport(downloadFlag) {
    if (downloadFlag == true) {
      this.searchReport();
    }
  }

  getResponseOfSearchThenDo() {
    if (this.callSummaryList.length > 0) {
      if (this.whichReport) {
        let array = this.callSummaryList.filter(function (obj) {
          for (var key in obj) {
            if (obj[key] == null) {
              obj[key] = "";
            }
          }
          return obj;
        });
        var head = Object.keys(array[0]);
        console.log(" head", head);
        // new Angular2Csv(array, 'Call Summary of mother', { headers: (head) });
        this.alertService.alert(this.currentLanguageSet.callSummaryOfMotherDownloaded);
      } else {
        let array = this.callSummaryList.filter(function (obj) {
          for (var key in obj) {
            if (obj[key] == null) {
              obj[key] = "";
            }
          }
          return obj;
        });
        var head = Object.keys(array[0]);
        console.log(" head", head);
        // new Angular2Csv(array, 'Call Summary of child', { headers: (head) });
        this.alertService.alert(this.currentLanguageSet.callSummaryOfChildDownloaded);
      }
    } else {
      this.alertService.alert(this.currentLanguageSet.noRecordFound);
    }
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
  //--End--

}
