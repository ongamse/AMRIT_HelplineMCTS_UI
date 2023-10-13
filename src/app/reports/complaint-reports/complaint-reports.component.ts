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


import { Component, OnInit, } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import { dataService } from '../../services/dataService/data.service';
import { CallClosureService } from '../../services/mcts-agent/call-closure/call-closure.service';
import { ReportService } from './../report-services/report.service';
import { ConfirmationDialogsService } from '../../services/dialog/confirmation.service';
import * as XLSX from 'xlsx';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-complaint-reports',
  templateUrl: './complaint-reports.component.html',
  styleUrls: ['./complaint-reports.component.css']
})
export class ComplaintReportsComponent implements OnInit {
  searchForm: FormGroup;
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
  

  constructor(private formBuilder: FormBuilder, private dataService: dataService,
    private callClosureService: CallClosureService, private reportService: ReportService,
    private httpServiceService: HttpServices,
    private alertService: ConfirmationDialogsService) {
  }
  providerServiceMapID: any;
  types = [{ typeName: 'Mother', typeId: true }, { typeName: 'Child', typeId: false }];
  designations = [];
  feedbackTypes = [];
  feedbackNatureTypes = [];

  reportList = [];
  motherReportList = [];
  childReportList = [];

  feedbackIdObject: any;
  dateOffset: any;

  today: Date;
  minEndDate: Date;
  maxDate: any;
  maxEndDate: Date;

  //added to get agent ids
  agents: any = [];

  //boolean added to check if mother or child or both
  whichReport: Boolean;

  ngOnInit() {
    this.fetchLanguageResponse();
    this.providerServiceMapID = {
      'providerServiceMapID': this.dataService.currentService.serviceID
    };
    this.types;
    this.designations;
    this.feedbackTypes;
    this.feedbackNatureTypes;
    this.agents;
    this.today = new Date();
    this.getDesignations();
    this.getFeedbackTypes();
    this.getAgentIDs();
    this.createSearchForm();

    this.dateOffset = (24 * 60 * 60 * 1000);
    this.maxEndDate = new Date();
    this.maxEndDate.setDate(this.today.getDate() -1 );
  }

  checkEndDate() {
    console.log('', this.startDate);

    // if (this.endDate == null) {
    //   this.minEndDate = new Date(this.startDate);
    // } else {
    //   this.searchForm.patchValue({
    //     endDate: null, isMother: null, designationID: null,
    //     feedbackTypeID: null, feedbackNatureID: null, agentID: null
    //   })
    // }

    this.minEndDate = new Date(this.startDate);
    if(this.endDate != null) {
      this.searchForm.patchValue({
        endDate: null, isMother: null, designationID: null,
        feedbackTypeID: null, feedbackNatureID: null, agentID: null
      })
    }
  }

  getDesignations() {
    console.log('this.providerServiceMapID', this.providerServiceMapID);

    this.callClosureService.getDesignations(this.providerServiceMapID).subscribe((response) => {
      //console.log("Designations : ", response);
      this.designations = response.data;
    })
  }

  getFeedbackTypes() {
    this.callClosureService.getFeedbackTypes(this.providerServiceMapID).subscribe((response) => {
      //console.log('Feedback Types: ', response);
      this.feedbackTypes = response.data;
    })
  }

  getFeedbackNatureTypes() {
    //console.log("this.feedbackTypeID", this.feedbackTypeID);
    this.feedbackIdObject = {
      "feedbackTypeID": this.feedbackTypeID
    }
    this.callClosureService.getFeedbackNature(this.feedbackIdObject).subscribe((response) => {
      //console.log('Feedback nature types: ', JSON.stringify(response));
      this.feedbackNatureTypes = response.data;
      //console.log('Feedback nature types: ', JSON.stringify(this.feedbackNatureTypes, null, 4));
    })
  }

  getAgentIDs() {
    console.log('this.providerServiceMapID', this.providerServiceMapID);

    this.callClosureService.getAgentIDs(this.providerServiceMapID).subscribe((response) => {
      //console.log("Agents : ", response);
      this.agents = response.data;
    })
  }

  createSearchForm() {
    this.searchForm = this.formBuilder.group({
      startDate: null,
      endDate: null,
      designationID: null,
      feedbackTypeID: null,
      feedbackNatureID: null,
      isMother: null,
      providerServiceMapID: this.providerServiceMapID.providerServiceMapID,
      agentID: null
    })
  }
  searchReport() {
    let startDate: Date = new Date(this.searchForm.value.startDate);
    let endDate: Date = new Date(this.searchForm.value.endDate);

    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    console.log(this.searchForm.value);
    let reqObjForComplaintReport = {
      "startDate": new Date(startDate.valueOf() - 1 * startDate.getTimezoneOffset() * 60 * 1000),
      "endDate": new Date(endDate.valueOf() - 1 * endDate.getTimezoneOffset() * 60 * 1000),
      "designationID": this.searchForm.value.designationID,
      "feedbackTypeID": this.searchForm.value.feedbackTypeID,
      "feedbackNatureID": this.searchForm.value.feedbackNatureID,
      "isMother": this.searchForm.value.isMother,
      "providerServiceMapID": this.searchForm.value.providerServiceMapID,
      "userID": this.searchForm.value.agentID,
      "fileName": (this.searchForm.value.isMother == null ||  this.searchForm.value.isMother == undefined) ? "Complaint_Report" : ( this.searchForm.value.isMother ?  "Complaint_Report_of_mother" : "Complaint_Report_of_child")
    }
    this.whichReport = this.searchForm.value.isMother;
    this.reportService.getComplaintReports(reqObjForComplaintReport).subscribe((response) => {
      // console.log("Json data of response: ", JSON.stringify(response, null, 4));
      if (response) {
        saveAs(response,  reqObjForComplaintReport.fileName+".xlsx");
        this.alertService.alert((this.searchForm.value.isMother == null ||  this.searchForm.value.isMother == undefined) ? this.currentLanguageSet.complaintReportDownloaded : ( this.searchForm.value.isMother ?  this.currentLanguageSet.complaintReportOfMotherDownloaded : this.currentLanguageSet.complaintReportOfChildDownloaded));
        // this.qualityReportList = response;
        // console.log("RESPONSE, ", this.qualityReportList);
        // this.getResponseOfSearchThenDo();
      }else {
        this.alertService.alert(this.currentLanguageSet.noDataFound);
      }
    }, (error) => {
      console.log(error);
      // this.alertService.alert(error, 'error');
      if(error.status === 500)
      {
        this.alertService.alert(this.currentLanguageSet.noDataFound, 'info');
      }
      else    
      this.alertService.alert(this.currentLanguageSet.errorWhileFetchingReport, 'error');
    });

    // this.reportService.getComplaintReports(reqObjForComplaintReport).subscribe((response) => {
    //   console.log("Search form data", JSON.stringify(reqObjForComplaintReport, null, 4));
    //   console.log("Json data of response: ", JSON.stringify(response, null, 4));
    //   if (response.statusCode == 200) {
    //     this.reportList = response.data;
    //     console.log('checxk here to enable');
    //     this.getResponseOfSearchThenDo();
    //   }
    // })
  }

  downloadReport(downloadFlag) {
    if (downloadFlag == true) {
      this.searchReport();
    }
  }

  get startDate() {
    return this.searchForm.controls['startDate'].value;
  }

  get endDate() {
    return this.searchForm.controls['endDate'].value;
  }

  get designationID() {
    return this.searchForm.controls['designationID'].value;
  }

  get feedbackTypeID() {
    return this.searchForm.controls['feedbackTypeID'].value;
  }

  get feedbackNatureID() {
    return this.searchForm.controls['feedbackNatureID'].value;
  }

  get type() {
    return this.searchForm.controls['isMother'].value;
  }

  get agentID() {
    return this.searchForm.controls['agentID'].value;
  }

  getResponseOfSearchThenDo() {
    let criteria: any = [];
    criteria.push({ 'Filter_Name': 'Start_Date', 'value': this.startDate });
    criteria.push({ 'Filter_Name': 'End_Date', 'value': this.endDate });
    criteria.push({ 'Filter_Name': 'Type', 'value': this.type });
    criteria.push({ 'Filter_Name': 'Agent_ID', 'value': this.agentID });
    this.exportToxlsx(criteria);
  }
  exportToxlsx(criteria: any) {
    if (this.reportList.length > 0) {
      if (this.whichReport) {
        let array = this.reportList.filter(function (obj) {
          delete obj.beneficiaryAlternatePhoneNumber;
          for (var key in obj) {
            if (obj[key] == null) {
              obj[key] = "";
            }
          }
          return obj;
        });
        if (array.length != 0) {
          var head = Object.keys(array[0]);
          console.log(" head", head);
          let wb_name = "Complaint Report of mother";
          const criteria_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(criteria);
          const report_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.reportList, { header: (head) });

          // below code added to modify the headers

          let i = 65;    // starting from 65 since it is the ASCII code of 'A'.
          let count = 0;
          while (i < head.length + 65) {
            let j;
            if (count > 0) {
              j = i - (26 * count);
            }
            else {
              j = i;
            }
            let cellPosition = String.fromCharCode(j);
            let finalCellName: any;
            if (count == 0) {
              finalCellName = cellPosition + "1";
              console.log(finalCellName);
            }
            else {
              let newcellPosition = String.fromCharCode(64 + count);
              finalCellName = newcellPosition + cellPosition + "1";
              console.log(finalCellName);
            }
            let newName = this.modifyHeader(head, i);
            delete report_worksheet[finalCellName].w; report_worksheet[finalCellName].v = newName;
            i++;
            if (i == 91 + (count * 26)) {
              // i = 65;
              count++;
            }
          }
          // --------end--------

          const workbook: XLSX.WorkBook = { Sheets: { 'Report': report_worksheet, 'Criteria': criteria_worksheet }, SheetNames: ['Criteria', 'Report'] };
          const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: "array" });
          let blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, wb_name);
          }
          else {
            var link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute('visibility', 'hidden');
            link.download = wb_name.replace(/ /g, "_") + ".xlsx";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          this.alertService.alert(this.currentLanguageSet.complaintReportOfMotherDownloaded);
        }
      }
      if (this.whichReport == false) {
        let array = this.reportList.filter(function (obj) {
          delete obj.beneficiaryAlternatePhoneNumber;
          for (var key in obj) {
            if (obj[key] == null) {
              obj[key] = "";
            }
          }
          return obj;
        });
        if (array.length != 0) {
          var head = Object.keys(array[0]);
          console.log(" head", head);
          let wb_name = "Complaint Report of child";
          const criteria_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(criteria);
          const report_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.reportList, { header: (head) });

          // below code added to modify the headers

          let i = 65;    // starting from 65 since it is the ASCII code of 'A'.
          let count = 0;
          while (i < head.length + 65) {
            let j;
            if (count > 0) {
              j = i - (26 * count);
            }
            else {
              j = i;
            }
            let cellPosition = String.fromCharCode(j);
            let finalCellName: any;
            if (count == 0) {
              finalCellName = cellPosition + "1";
              console.log(finalCellName);
            }
            else {
              let newcellPosition = String.fromCharCode(64 + count);
              finalCellName = newcellPosition + cellPosition + "1";
              console.log(finalCellName);
            }
            let newName = this.modifyHeader(head, i);
            delete report_worksheet[finalCellName].w; report_worksheet[finalCellName].v = newName;
            i++;
            if (i == 91 + (count * 26)) {
              // i = 65;
              count++;
            }
          }
          // --------end--------

          const workbook: XLSX.WorkBook = { Sheets: { 'Report': report_worksheet, 'Criteria': criteria_worksheet }, SheetNames: ['Criteria', 'Report'] };
          const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: "array" });
          let blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, wb_name);
          }
          else {
            var link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute('visibility', 'hidden');
            link.download = wb_name.replace(/ /g, "_") + ".xlsx";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          this.alertService.alert(this.currentLanguageSet.complaintReportOfChildDownloaded);
        }
      }
      if (this.whichReport == null) {
        let array = this.reportList.filter(function (obj) {
          delete obj.beneficiaryAlternatePhoneNumber;
          for (var key in obj) {
            if (obj[key] == null) {
              obj[key] = "";
            }
          }
          return obj;
        });
        if (array.length != 0) {
          var head = Object.keys(array[0]);
          console.log(" head", head);
          let wb_name = "Complaint Report";
          const criteria_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(criteria);
          const report_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.reportList, { header: (head) });

          // below code added to modify the headers

          let i = 65;    // starting from 65 since it is the ASCII code of 'A'.
          let count = 0;
          while (i < head.length + 65) {
            let j;
            if (count > 0) {
              j = i - (26 * count);
            }
            else {
              j = i;
            }
            let cellPosition = String.fromCharCode(j);
            let finalCellName: any;
            if (count == 0) {
              finalCellName = cellPosition + "1";
              console.log(finalCellName);
            }
            else {
              let newcellPosition = String.fromCharCode(64 + count);
              finalCellName = newcellPosition + cellPosition + "1";
              console.log(finalCellName);
            }
            let newName = this.modifyHeader(head, i);
            delete report_worksheet[finalCellName].w; report_worksheet[finalCellName].v = newName;
            i++;
            if (i == 91 + (count * 26)) {
              // i = 65;
              count++;
            }
          }
          // --------end--------

          const workbook: XLSX.WorkBook = { Sheets: { 'Report': report_worksheet, 'Criteria': criteria_worksheet }, SheetNames: ['Criteria', 'Report'] };
          const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: "array" });
          let blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, wb_name);
          }
          else {
            var link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute('visibility', 'hidden');
            link.download = wb_name.replace(/ /g, "_") + ".xlsx";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          this.alertService.alert(this.currentLanguageSet.complaintReportDownloaded);
        }
      }
    } else {
      this.alertService.alert(this.currentLanguageSet.noRecordFound);
    }
  }

  modifyHeader(headers, i) {
    let modifiedHeader: String;
    modifiedHeader = headers[i - 65].toString().replace(/([A-Z])/g, ' $1').trim();
    modifiedHeader = modifiedHeader.charAt(0).toUpperCase() + modifiedHeader.substr(1);
    modifiedHeader = modifiedHeader.replace(/child/g, " / Child");
    console.log( "modifiedHeader",modifiedHeader);
    return modifiedHeader.replace(/I D/g, "ID");
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