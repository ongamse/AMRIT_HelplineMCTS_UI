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
import * as XLSX from 'xlsx';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-call-details-unique-report',
  templateUrl: './call-details-unique-report.component.html',
  styleUrls: ['./call-details-unique-report.component.css']
})
export class CallDetailsUniqueReportComponent implements OnInit {

  callDetailsUniqueForm: FormGroup;
  languageComponent: SetLanguageComponent;
  
  currentLanguageSet: any;

  constructor(private formBuilder: FormBuilder,private httpServiceService: HttpServices, private dataService: dataService,
    private callClosureService: CallClosureService, private reportService: ReportService,
    private alertService: ConfirmationDialogsService) { }

  providerServiceMapID: any;
  today: Date;
  minEndDate: Date;
  maxDate: any;
  maxEndDate: Date;
  callDetailsUniqueList = [];
  dateOffset: any;

  //added to get agent ids
  agents: any = [];

  ngOnInit() {
    this.providerServiceMapID = { 'providerServiceMapID': this.dataService.currentService.serviceID };
    this.agents;
    this.fetchLanguageResponse();
    this.getAgentIDs();
    this.createCallDetailsUniqueForm();
    this.today = new Date();

    this.dateOffset = (24 * 60 * 60 * 1000);
    // this.maxEndDate = new Date(this.today.setTime(this.today.getTime()));
    this.maxEndDate = new Date();
    this.maxEndDate.setDate(this.today.getDate() -1 );
  }

  createCallDetailsUniqueForm() {
    this.callDetailsUniqueForm = this.formBuilder.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      providerServiceMapID: this.providerServiceMapID.providerServiceMapID,
      agentID: [null, Validators.required],
    })
  }

  get startDate() {
    return this.callDetailsUniqueForm.controls['startDate'].value;
  }

  get endDate() {
    return this.callDetailsUniqueForm.controls['endDate'].value;
  }

  get agentID() {
    return this.callDetailsUniqueForm.controls['agentID'].value;
  }

  checkEndDate() {
    console.log('', this.startDate);

    this.minEndDate = new Date(this.startDate);
    if (this.endDate == null) {
      console.log("new Date(this.today.getDate() - 1);", new Date(this.today));
    } else {
      this.callDetailsUniqueForm.patchValue({
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
    let startDate: Date = new Date(this.callDetailsUniqueForm.value.startDate);
    let endDate: Date = new Date(this.callDetailsUniqueForm.value.endDate);

    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    console.log("Data form value...", JSON.stringify(this.callDetailsUniqueForm.value));
    let reqObjForCallDetailsUniqueReport = {
      "startDate": new Date(startDate.valueOf() - 1 * startDate.getTimezoneOffset() * 60 * 1000),
      "endDate": new Date(endDate.valueOf() - 1 * endDate.getTimezoneOffset() * 60 * 1000),
      "providerServiceMapID": this.callDetailsUniqueForm.value.providerServiceMapID,
      "userID": this.callDetailsUniqueForm.value.agentID,
      "fileName": "Call_Details_Unique_Report"
    }
    console.log("Data form data", JSON.stringify(reqObjForCallDetailsUniqueReport, null, 4));
    this.reportService.getCallDetailsUniqueReports(reqObjForCallDetailsUniqueReport).subscribe((response) => {
      // console.log("Json data of response: ", JSON.stringify(response, null, 4));
      if (response) {
        saveAs(response,  reqObjForCallDetailsUniqueReport.fileName+".xlsx");
        this.alertService.alert(this.currentLanguageSet.callDetailsUniqueReportDownloaded);
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
    
  }


  //   this.reportService.getCallDetailsUniqueReports(reqObjForCallDetailsUniqueReport).subscribe((response) => {
  //     console.log("Json data of response: ", JSON.stringify(response, null, 4));
  //     if (response.statusCode == 200) {
  //       this.callDetailsUniqueList = response.data;
  //       this.getResponseOfSearchThenDo();
  //     }
  //   })
  // }

  downloadReport(downloadFlag) {
    if (downloadFlag == true) {
      this.searchReport();
    }
  }

  getResponseOfSearchThenDo() {
    let criteria: any = [];
    criteria.push({ 'Filter_Name': 'Start_Date', 'value': this.startDate });
    criteria.push({ 'Filter_Name': 'End_Date', 'value': this.endDate });
    criteria.push({ 'Filter_Name': 'Agent_ID', 'value': this.agentID });
    this.exportToxlsx(criteria);
  }
  exportToxlsx(criteria: any) {
    if (this.callDetailsUniqueList.length > 0) {
      let array = this.callDetailsUniqueList.filter(function (obj) {
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
        let wb_name = "Call Details Unique Report";
        const criteria_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(criteria);
        const report_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.callDetailsUniqueList, { header: (head) });

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
      }
      this.alertService.alert(this.currentLanguageSet.callDetailsUniqueReportDownloaded);
    } else {
      this.alertService.alert(this.currentLanguageSet.noRecordFound);
    }
  }

  modifyHeader(headers, i) {
    let modifiedHeader: String;
    modifiedHeader = headers[i - 65].toString().replace(/([A-Z])/g, ' $1').trim();
    modifiedHeader = modifiedHeader.charAt(0).toUpperCase() + modifiedHeader.substr(1);
    //console.log(modifiedHeader);
    return modifiedHeader.replace(/I D/g, "ID");
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
