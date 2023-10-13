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
  selector: 'app-valid-records-report',
  templateUrl: './valid-records-report.component.html',
  styleUrls: ['./valid-records-report.component.css']
})
export class ValidRecordsReportComponent implements OnInit {

  validRecordsForm: FormGroup;
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
  

  constructor(private formBuilder: FormBuilder, private dataService: dataService,
    private callClosureService: CallClosureService, private reportService: ReportService,
    private httpServiceService: HttpServices,
    private alertService: ConfirmationDialogsService) { }

  providerServiceMapID: any;
  today: Date;
  minEndDate: Date;
  maxDate: any;
  maxEndDate: Date;
  validRecordsList = [];
  dateOffset: any;

  //added to get agent ids
  agents: any = [];

  ngOnInit() {
    this.fetchLanguageResponse();
    this.providerServiceMapID = { 'providerServiceMapID': this.dataService.currentService.serviceID };
    // this.types;
    this.agents;
    this.getAgentIDs();
    this.createValidRecordsForm();
    this.today = new Date();

    this.dateOffset = (24 * 60 * 60 * 1000);
    // this.maxEndDate = new Date(this.today.setTime(this.today.getTime()));
    this.maxEndDate = new Date();
    this.maxEndDate.setDate(this.today.getDate() -1 );
  }

  createValidRecordsForm() {
    this.validRecordsForm = this.formBuilder.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      providerServiceMapID: this.providerServiceMapID.providerServiceMapID,
      agentID: [null, Validators.required],
    })
  }

  get startDate() {
    return this.validRecordsForm.controls['startDate'].value;
  }

  get endDate() {
    return this.validRecordsForm.controls['endDate'].value;
  }

  get agentID() {
    return this.validRecordsForm.controls['agentID'].value;
  }

  checkEndDate() {
    console.log('', this.startDate);

    this.minEndDate = new Date(this.startDate);
    if (this.endDate == null) {
      console.log("new Date(this.today.getDate() - 1);", new Date(this.today));
    } else {
      this.validRecordsForm.patchValue({
        endDate: null, agentID: null
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
    let startDate: Date = new Date(this.validRecordsForm.value.startDate);
    let endDate: Date = new Date(this.validRecordsForm.value.endDate);

    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    console.log("Data form value...", JSON.stringify(this.validRecordsForm.value));
    let reqObjForValidRecordsReport = {
      "startDate": new Date(startDate.valueOf() - 1 * startDate.getTimezoneOffset() * 60 * 1000),
      "endDate": new Date(endDate.valueOf() - 1 * endDate.getTimezoneOffset() * 60 * 1000),
      "providerServiceMapID": this.validRecordsForm.value.providerServiceMapID,
      "userID": this.validRecordsForm.value.agentID
    }
    console.log("Data form data", JSON.stringify(reqObjForValidRecordsReport, null, 4));

    this.reportService.getValidRecordsReports(reqObjForValidRecordsReport).subscribe((response) => {
      console.log("Json data of response: ", JSON.stringify(response, null, 4));
      if (response.statusCode == 200) {
        this.validRecordsList = response.data;
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
    if (this.validRecordsList.length > 0) {
      let array = this.validRecordsList.filter(function (obj) {
        for (var key in obj) {
          if (obj[key] == null) {
            obj[key] = "";
          }
        }
        return obj;
      });
      var head = Object.keys(array[0]);
      console.log(" head", head);
      // new Angular2Csv(array, 'Valid Records Report', { headers: (head) });
      this.alertService.alert(this.currentLanguageSet.validRecordsReportDownloaded);
    } else {
      this.alertService.alert(this.currentLanguageSet.noRecordFound);
    }
  }

  //AN40085822 23/10/2021 Integrating Multilingual Functionality --Start--
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
