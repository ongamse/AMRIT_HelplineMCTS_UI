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
  selector: 'app-data-reports',
  templateUrl: './data-reports.component.html',
  styleUrls: ['./data-reports.component.css']
})
export class DataReportsComponent implements OnInit {

  dataForm: FormGroup;
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
  

  constructor(private formBuilder: FormBuilder, private dataService: dataService,
    private callClosureService: CallClosureService, private reportService: ReportService,
    private httpServiceService: HttpServices,
    private alertService: ConfirmationDialogsService) { }

  providerServiceMapID: any;
  types = [{ typeName: 'Mother', typeId: true }, { typeName: 'Child', typeId: false }];
  today: Date;
  minEndDate: Date;
  maxDate: any;
  maxEndDate: Date;
  dataList = [];
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
    this.createDataForm();
    this.today = new Date();
    this.getAgentIDs();
    this.dateOffset = (24 * 60 * 60 * 1000);
    // this.maxEndDate = new Date(this.today.setTime(this.today.getTime()));
    this.maxEndDate = new Date();
    this.maxEndDate.setDate(this.today.getDate() -1 );
  }

  createDataForm() {
    this.dataForm = this.formBuilder.group({
      startDate: null,
      endDate: null,
      isMother: [null, Validators.required],
      agentID: null,
      providerServiceMapID: this.providerServiceMapID.providerServiceMapID
    })
  }

  getAgentIDs() {
    console.log('this.providerServiceMapID', this.providerServiceMapID);

    this.callClosureService.getAgentIDs(this.providerServiceMapID).subscribe((response) => {
      //console.log("Agents : ", response);
      this.agents = response.data;
    })
  }

  get startDate() {
    return this.dataForm.controls['startDate'].value;
  }

  get endDate() {
    return this.dataForm.controls['endDate'].value;
  }

  get type() {
    return this.dataForm.controls['isMother'].value;
  }

  get agentID() {
    return this.dataForm.controls['agentID'].value;
  }

  checkEndDate() {
    console.log('', this.startDate);

    this.minEndDate = new Date(this.startDate);
    if (this.endDate == null) {
      console.log("new Date(this.today.getDate() - 1);", new Date(this.today));
    } else {
      this.dataForm.patchValue({
        endDate: null, isMother: null, agentID: null
      })
    }
  }
  searchReport() {
    let startDate: Date = new Date(this.dataForm.value.startDate);
    let endDate: Date = new Date(this.dataForm.value.endDate);

    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    console.log("Data form value...", JSON.stringify(this.dataForm.value));
    let reqObjForDataReport = {
      "startDate": new Date(startDate.valueOf() - 1 * startDate.getTimezoneOffset() * 60 * 1000),
      "endDate": new Date(endDate.valueOf() - 1 * endDate.getTimezoneOffset() * 60 * 1000),
      "isMother": this.dataForm.value.isMother,
      "providerServiceMapID": this.dataForm.value.providerServiceMapID,
      "userID": this.dataForm.value.agentID,
      "fileName": this.dataForm.value.isMother ? "Data_Report_of_mother" : "Data_Report_of_child"
    }
    this.whichReport = this.dataForm.value.isMother;
    console.log("Data form data", JSON.stringify(reqObjForDataReport, null, 4));

    this.reportService.getDataReports(reqObjForDataReport).subscribe((response) => {
      // console.log("Json data of response: ", JSON.stringify(response, null, 4));
      if (response) {
        saveAs(response,  reqObjForDataReport.fileName+".xlsx");
        this.alertService.alert(this.dataForm.value.isMother ? this.currentLanguageSet.dataReportOfMotherDownloaded : this.currentLanguageSet.dataReportOfChildDownloaded );
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

  //   this.reportService.getDataReports(reqObjForDataReport).subscribe((response) => {
  //     console.log("Json data of response: ", JSON.stringify(response, null, 4));
  //     if (response.statusCode == 200) {
  //       this.dataList = response.data;
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
    criteria.push({ 'Filter_Name': 'Type', 'value': this.type });
    this.exportToxlsx(criteria);
  }
  exportToxlsx(criteria: any) {
    if (this.dataList.length > 0) {
      if (this.whichReport) {
        let array = this.dataList.filter(function (obj) {
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
          let wb_name = "Data Report of mother";
          const criteria_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(criteria);
          const report_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataList, { header: (head) });
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
          this.alertService.alert(this.currentLanguageSet.dataReportOfMotherDownloaded);
        }
      }
      if (this.whichReport == false) {
        let array = this.dataList.filter(function (obj) {
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
          let wb_name = "Data Report of child";
          const criteria_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(criteria);
          const report_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataList, { header: (head) });

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
          this.alertService.alert(this.currentLanguageSet.dataReportOfChildDownloaded);
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
    modifiedHeader = modifiedHeader.replace(/Phc/g, "PHC");
    modifiedHeader = modifiedHeader.replace(/Gp/g, "GP");
    modifiedHeader = modifiedHeader.replace(/Jsy/g, "JSY");
    modifiedHeader = modifiedHeader.replace(/Anm/g, "ANM");
    modifiedHeader = modifiedHeader.replace(/Lmp/g, "LMP");
    modifiedHeader = modifiedHeader.replace(/Anc/g, "ANC");
    modifiedHeader = modifiedHeader.replace(/Tt/g, "TT");
    modifiedHeader = modifiedHeader.replace(/Pnc/g, "PNC");
    modifiedHeader = modifiedHeader.replace(/E ID/g, "EID");
    modifiedHeader = modifiedHeader.replace(/Mdds/g, "MDDS");
    
    //console.log(modifiedHeader);
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
