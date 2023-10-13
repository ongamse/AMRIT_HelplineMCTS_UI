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


import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { Location } from "@angular/common";
import { DomSanitizer } from "@angular/platform-browser";
import { ConfigService } from "../services/config/config.service";
import { dataService } from "../services/dataService/data.service";
import { QualityAuditService } from "../services/supervisorService/quality-audit-service.service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { NgForm } from "@angular/forms";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from "@angular/material";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";

@Component({
  selector: "app-quality-audit",
  templateUrl: "./quality-audit.component.html",
  styleUrls: ["./quality-audit.component.css"],
})
export class QualityAuditComponent implements OnInit {
  // added during pdf download coding
  showCaseSheet = false;
  CaseSheetData: any;

  // arrays
  servicelines: any = [];
  agentIDs = [];
  allAgentIDs = [];
  roles = [];
  callTypes: any = [];
  callSubTypes: any = [];
  filteredCallList: any = [];

  // constants
  userID: any = "";
  providerServiceMapID: any = "";
  serviceProviderID: any = "";
  serviceID: any = "";

  // ngModels
  role: any;
  ioc: any;
  agent: any;
  phno: any;
  callGroupType: any;
  callsubtype: any;
  resForCaseSheet: any;
  audioURL: string;
  audioTag: any;
  audioResponse: any;
  dispFlag: any;
  displayIcon: boolean = false;
  recordingArray: any = [];
  apiCall: boolean = true;

  @ViewChild("qaForm") qaForm: NgForm;
  min: any;
  max: any;
  benCallID: any;
  today: Date;
  validFrom: Date;
  validTill: Date;
  maxEndDate: Date;
  pageNo: any = 1;
  pageSize = 5;
  pageCount: any;
  pager: any;
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
  

  constructor(
    public sanitizer: DomSanitizer,
    private commonData: dataService,
    private httpServiceService: HttpServices,
    private qualityAuditService: QualityAuditService,
    private alertService: ConfirmationDialogsService,
    public dialog: MdDialog,
    public location: Location
  ) {}

  ngOnInit() {
    this.fetchLanguageResponse();
    this.setTodaydate();
    this.userID = this.commonData.Userdata.userID;
    this.serviceProviderID = this.commonData.service_providerID;
    this.providerServiceMapID = this.commonData.currentService.serviceID;
    this.currentDateCallRecordingRequest(this.pageNo);
    this.getServiceProviderID();
  }
  setTodaydate() {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    this.validFrom = this.today;
    this.maxEndDate = new Date();
    this.maxEndDate.setHours(23, 59, 59, 0);
    this.validTill = this.maxEndDate;
  }
  currentDateCallRecordingRequest(pageNo) {
    const requestForCallrecords = {
      calledServiceID: this.providerServiceMapID,
      filterStartDate: new Date(
        this.validFrom.valueOf() -
          1 * this.validFrom.getTimezoneOffset() * 60 * 1000
      ),
      filterEndDate: new Date(
        this.validTill.valueOf() -
          1 * this.validTill.getTimezoneOffset() * 60 * 1000
      ),
      is1097: false,
      pageNo: pageNo,
    };
    this.getCallRecordingsList(requestForCallrecords, pageNo);
  }
  callRecordingRequestFordate(pageNo, formValues) {
    this.filteredCallList = [];
    const requestForCallrecords = {
      calledServiceID: this.providerServiceMapID,
      callTypeID: formValues.CallSubType,
      filterStartDate: new Date(
        formValues.startDate.valueOf() -
          1 * formValues.startDate.getTimezoneOffset() * 60 * 1000
      ),
      filterEndDate: new Date(
        formValues.endDate.valueOf() -
          1 * formValues.endDate.getTimezoneOffset() * 60 * 1000
      ),
      receivedRoleName: formValues.Role ? formValues.Role : null,
      phoneNo: formValues.benPhoneNo ? formValues.benPhoneNo : null,
      agentID: formValues.Agent ? formValues.Agent : null,
      inboundOutbound: formValues.InboundOutbound
        ? formValues.InboundOutbound
        : null,
      is1097: false,
      pageNo: pageNo,
    };
    this.getCallRecordingsList(requestForCallrecords, pageNo);
  }
  getCallRecordingsList(requestForCallrecords, pageNo) {
    this.qualityAuditService
      .getFilteredCallList(requestForCallrecords)
      .subscribe(
        (recordingsPerpage) => {
          if (!this.isWorkListHasData(recordingsPerpage)) {
            console.log("Call recording are not there");
            return;
          }
          this.callAuditingWorklistPerPage(recordingsPerpage, pageNo);
        },
        (err) => {
          console.log(err.errorMessage, "error");
        }
      );
  }
  callAuditingWorklistPerPage(recordingsPerpage, pageNo) {
    this.filteredCallList = recordingsPerpage.workList;
    this.pageCount = recordingsPerpage.totalPages;
    if (this.pageCount !== 0) {
      this.pager = this.getPager(pageNo);
    }
  }
  setPage(pageNo: number, formValues) {
    this.audioResponse = [];
    this.recordingArray = [];
    this.resetFlag();
    if (pageNo <= this.pageCount && pageNo >= 1) {
      this.callRecordingRequestFordate(pageNo, formValues);
    }
  }
  getPager(pageNo) {
    let startPage: number, endPage: number;
    const totalPages = this.pageCount;
    // ensure current page isn't out of range
    if (pageNo > totalPages) {
      pageNo = totalPages;
    }
    if (totalPages <= 5) {
      // less than 5 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 5 total pages so calculate start and end pages
      if (pageNo <= 2) {
        startPage = 1;
        endPage = 5;
      } else if (pageNo >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = pageNo - 2;
        endPage = pageNo + 2;
      }
    }
    return this.createPagination(endPage, startPage, pageNo, totalPages);
  }
  createPagination(endPage, startPage, pageNo, totalPages) {
    // create an array of pages to ng-repeat in the pager control
    const pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
      (i) => startPage + i
    );
    // return object with all pager properties required by the view
    return {
      currentPage: pageNo,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      pages: pages,
    };
  }
  isWorkListHasData(response) {
    return (
      response !== null &&
      response !== undefined &&
      response.workList.length > 0
    );
  }
  resetFlag() {
    this.dispFlag = 0;
  }
  check(agentID, sessionID, index) {
    console.log("AgentID", agentID);
    console.log("sessionID", sessionID);

    this.audioResponse = null;

    if (agentID > 0 && sessionID > 0) {
      if (this.recordingArray.length > 0) {
        this.recordingArray.forEach((element) => {
          if (sessionID === element.sessionId && agentID === element.agentId) {
            this.audioResponse = element.path;
            this.dispFlag = index;
            this.apiCall = false;
          }
        });
      }
      if (this.apiCall) {
        this.qualityAuditService.getAudio(agentID, sessionID).subscribe(
          (response) => {
            console.log("RESPONSEss", response.response);
            this.audioResponse = response.response;
            this.dispFlag = index;

            console.log("Audio Response1", this.audioResponse);
            this.recordingArray.push({
              sessionId: sessionID,
              agentId: agentID,
              path: this.audioResponse,
            });
            console.log("RecordingArray", this.recordingArray);
          },
          (err) => {
            this.alertService.alert(
              this.currentLanguageSet.failedToGetTheVoiceFilePath,
              "error"
            );
            console.log("ERROR", err);
          }
        );
      } else {
        this.apiCall = true;
      }
    }
  }

  setEndDate() {
    this.resetWorklistData();
    const timeDiff = this.validTill.getTime() - this.validFrom.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays >= 0) {
      if (diffDays > 31) {
        this.maxEndDate = new Date(this.validFrom);
        this.maxEndDate.setDate(this.maxEndDate.getDate() + 30);
        this.maxEndDate.setHours(23, 59, 59, 0);
        this.validTill = this.maxEndDate;
      }
      if (diffDays <= 31) {
        this.checkForEndDateDifference();
      }
    } else {
      this.checkForEndDateDifference();
    }
  }
  checkForEndDateDifference() {
    const endDateDiff = this.today.getTime() - this.validFrom.getTime();
    const enddiffDays = Math.ceil(endDateDiff / (1000 * 3600 * 24));
    if (enddiffDays > 31) {
      this.maxEndDate = new Date(this.validFrom);
      this.maxEndDate.setDate(this.maxEndDate.getDate() + 30);
      this.maxEndDate.setHours(23, 59, 59, 0);
      this.validTill = this.maxEndDate;
    } else {
      this.today.setHours(23, 59, 59, 0);
      this.validTill = this.today;
      this.maxEndDate = this.today;
    }
  }
  resetValuesOnchange() {
    this.resetWorklistData();
    this.validTill.setHours(23, 59, 59, 0);
  }
  resetWorklistData() {
    this.filteredCallList = [];
    this.pager = 0;
  }
  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }

  getServiceProviderID() {
    this.qualityAuditService
      .getServiceProviderID(this.providerServiceMapID)
      .subscribe(
        (response) => {
          console.log(response, "QA serviceproviderID success");
          this.serviceProviderID = response.serviceProviderID;
          this.getServicelines();
        },
        (err) => {
          console.log(err.errorMessage, "QA serviceProviderID error");
        }
      );
  }

  getServicelines() {
    this.qualityAuditService.getServices(this.userID).subscribe(
      (response) => {
        console.log(response, "QA servicelines success");
        this.servicelines = response.filter((item) => {
          return item.serviceName === "MCTS";
        });
        this.serviceID = this.servicelines[0].serviceID;
        this.getRoles();
      },
      (err) => {
        console.log(err, "QA servicelines error");
        this.alertService.alert(err.errorMessage, "error");
      }
    );
  }

  getRoles() {
    const obj = {
      providerServiceMapID: this.providerServiceMapID,
    };

    this.qualityAuditService.getRoles(obj).subscribe(
      (response) => {
        console.log(response, "QA roles success");
        this.roles = response;
        this.getAgents();
      },
      (err) => {
        console.log(err, "QA roles error");
        this.alertService.alert(err.errorMessage, "error");
      }
    );
  }

  getRoleSpecificAgents(role_name, roles_array) {
    this.resetWorklistData();
    let roleID = undefined;
    for (const role of roles_array) {
      if (role_name.toLowerCase() === role.roleName.toLowerCase()) {
        roleID = role.roleID;
        break;
      }
    }

    if (roleID !== undefined) {
      this.qualityAuditService
        .getRoleSpecificAgents(this.providerServiceMapID, roleID)
        .subscribe(
          (response) => {
            this.agent = undefined;
            this.agentIDs = response;
          },
          (err) => {
            console.log(err, "Error while fetching role specific agent IDs");
          }
        );
    }
  }

  getAgents() {
    this.qualityAuditService.getAllAgents(this.providerServiceMapID).subscribe(
      (response) => {
        console.log(response, "QA AGENTIDs success");
        this.agentIDs = response;
        this.allAgentIDs = response;
        this.getCallTypes();
      },
      (err) => {
        console.log(err.errorMessage, "QA AGENTIDs error");
      }
    );
  }

  getCallTypes() {
    this.qualityAuditService.getCallTypes(this.providerServiceMapID).subscribe(
      (response) => {
        console.log(response, "QA calltypes success");
        this.callTypes = response.filter((item) => {
          return (
            item.callGroupType.toLowerCase() === "Answered".toLowerCase() ||
            item.callGroupType.toLowerCase() === "Not Answered".toLowerCase()
          );
        });

        const obj = { callGroupType: "All", callTypes: [] };
        this.callTypes.push(obj);
      },
      (err) => {
        console.log(err.errorMessage, "QA calltypes error");
      }
    );
  }

  populateCallSubTypes(callGroupType) {
    this.resetWorklistData();
    if (callGroupType.toLowerCase() === "Answered".toLowerCase()) {
      this.callSubTypes = this.callTypes.filter((item) => {
        if (item.callGroupType.toLowerCase() === "Answered".toLowerCase()) {
          return item.callTypes;
        }
      });
    } else if (callGroupType.toLowerCase() === "Not Answered".toLowerCase()) {
      this.callSubTypes = this.callTypes.filter((item) => {
        if (item.callGroupType.toLowerCase() === "Not Answered".toLowerCase()) {
          return item.callTypes;
        }
      });
    } else {
      this.callSubTypes = [];
    }

    if (this.callSubTypes.length > 0) {
      let arr = [];
      for (let i = 0; i < this.callSubTypes.length; i++) {
        arr = this.callSubTypes[i].callTypes;
      }
      this.callsubtype = "";
      this.callSubTypes = arr;
    }
  }

  getFilteredCallList(formval) {
    console.log("formvalues", formval);
    let obj = {
      calledServiceID: this.providerServiceMapID,
      callTypeID: formval.CallSubType,
      filterStartDate: new Date(
        formval.startDate.valueOf() -
          1 * formval.startDate.getTimezoneOffset() * 60 * 1000
      ),
      filterEndDate: new Date(
        formval.endDate.valueOf() -
          1 * formval.endDate.getTimezoneOffset() * 60 * 1000
      ),
      receivedRoleName: formval.Role ? formval.Role : undefined,
      phoneNo: formval.benPhoneNo ? formval.benPhoneNo : undefined,
      agentID: formval.Agent ? formval.Agent : undefined,
      inboundOutbound: formval.InboundOutbound
        ? formval.InboundOutbound
        : undefined,
      is1097: false,
    };

    this.qualityAuditService.getFilteredCallList(obj).subscribe(
      (response) => {
        console.log("TABLE DATA FETCHED", response);
        this.filteredCallList = response;
      },
      (err) => {
        console.log("TABLE DATA FETCHED ERROR", err.status);
        this.alertService.alert(err.status, "error");
        this.filteredCallList = [];
      }
    );
  }

  getFilteredCallList_default() {
    let date = new Date();
    let endDate = new Date();
    endDate.setHours(23, 59, 59, 0);

    date.setDate(date.getDate() - 14);
    let startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    let obj = {
      calledServiceID: this.providerServiceMapID,
      filterStartDate: new Date(
        startDate.valueOf() - 1 * startDate.getTimezoneOffset() * 60 * 1000
      ),
      filterEndDate: new Date(
        endDate.valueOf() - 1 * endDate.getTimezoneOffset() * 60 * 1000
      ),
      is1097: false,
    };

    this.qualityAuditService.getFilteredCallList(obj).subscribe(
      (response) => {
        console.log("TABLE DATA FETCHED first time", response);
        this.filteredCallList = response;
      },
      (err) => {
        console.log("TABLE DATA FETCHED ERROR", err.errorMessage);
        this.alertService.alert(err.errorMessage, "error");
        this.filteredCallList = [];
      }
    );
  }

  reset() {
    this.qaForm.resetForm(); 
    this.agent = undefined;
    this.agentIDs = this.allAgentIDs;
    this.setTodaydate();
    this.currentDateCallRecordingRequest(this.pageNo);
    this.getServicelines();
  }

  invokeCaseSheetDialog(benCallID, beneficiaryData) {
    this.benCallID = benCallID;
    this.qualityAuditService.getCallSummary(benCallID).subscribe(
      (response) => {
        console.log("success in getting call details(casesheet)", response);
        if (response) {
          let obj = {
            response: response,
            benData: beneficiaryData,
          };
          this.resForCaseSheet = response;
          if (obj.response !== undefined && obj.response !== null) {
            console.log("In obj.response", obj.response);

            this.showCaseSheet = true;
          }
        }
      },
      (err) => {
        console.log(
          "error in getting call details(casesheet)",
          err.errorMessage
        );
      }
    );
  }

  getevent(event) {
    if (event !== undefined) {
      this.showCaseSheet = false;
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

@Component({
  selector: "app-case-sheet-summary-dialog",
  templateUrl: "./case-sheet-summary-dialog.html",
  styleUrls: ["./quality-audit.component.css"],
})
export class CaseSheetSummaryDialogComponent implements OnInit {
  motherData = false;
  isPNC = false;
  providerServiceMapID: any;
  benRegID: any;

  beneficiaryDetails: any;
  complaints: any = [];
  age: any;
  benCallID: any;

  @Input("resForCaseSheet") data: any;
  @Output() hideCaseSheet: EventEmitter<any> = new EventEmitter<any>();

  current_date = new Date();
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
  
  constructor(
    private commondata: dataService,
    private httpServiceService: HttpServices,
    private _qualityAuditService: QualityAuditService,
    private location: Location
  ) {}

  getComplaintsHistory(psmID, benRegID, benCallID) {
    this._qualityAuditService
      .getComplaints(psmID, benRegID, benCallID)
      .subscribe(
        (response) => {
          console.log(response, "COMPLAINTS SUCCESS");
          if(response !== undefined && response !== null) {
            this.complaints = response;
          }
        },
        (err) => {
          console.log(err, "COMPLAINTS error");
        }
      );
  }

  getBeneficiaryDetails() {
    if (
      this.data !== undefined &&
      this.data.mctsOutboundCall !== undefined &&
      this.data.mctsOutboundCall.mctsDataReaderDetail !== undefined
    ) {
      // ITS A MOTHER DATA
      this.motherData = true;

      // CHECKING IF A MOTHER RECORD IS 'ANC' OR 'PNC'
      if (this.data.mctsOutboundCallDetail.outboundCallType !== undefined) {
        if (
          this.data.mctsOutboundCallDetail.outboundCallType.startsWith("PNC")
        ) {
          this.isPNC = true;
          // PNC
        }
        if (
          this.data.mctsOutboundCallDetail.outboundCallType.startsWith("ANC")
        ) {
          this.isPNC = false;
          // ANC
        }
      }

      this.beneficiaryDetails = this.data.mctsOutboundCall.mctsDataReaderDetail;
      this.benRegID = this.beneficiaryDetails.BeneficiaryRegID;
      this.benCallID = this.data.mctsOutboundCallDetail.callDetailID;
      this.getComplaintsHistory(
        this.providerServiceMapID,
        this.benRegID,
        this.benCallID
      );

      if (this.beneficiaryDetails.Birth_Date !== undefined) {
        this.age = this.calculateAge(this.beneficiaryDetails.Birth_Date);
      }
    }
    if (
      this.data != undefined &&
      this.data.mctsOutboundCall != undefined &&
      this.data.mctsOutboundCall.childValidDataHandler != undefined
    ) {
      // ITS A CHILD DATA
      this.motherData = false;

      this.beneficiaryDetails =
        this.data.mctsOutboundCall.childValidDataHandler;
      this.benRegID = this.beneficiaryDetails.BeneficiaryRegID;
      this.benCallID = this.data.mctsOutboundCallDetail.callDetailID;
      this.getComplaintsHistory(
        this.providerServiceMapID,
        this.benRegID,
        this.benCallID
      );

      if (this.beneficiaryDetails.DOB != undefined) {
        this.age = this.calculateAge(this.beneficiaryDetails.DOB);
      }
    }
  }

  calculateAge(date) {
    if (date) {
      const newDate = new Date(date);
      const today = new Date();
      let age = today.getFullYear() - newDate.getFullYear();
      const month = today.getMonth() - newDate.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < newDate.getDate())) {
        age--;
      }
      return age;
    } else {
      return undefined;
    }
  }

  ngOnInit() {
    this.fetchLanguageResponse();
    console.log("Input ####", this.data);
    this.providerServiceMapID = this.commondata.currentService.serviceID;
    this.getBeneficiaryDetails();
  }

  hideCaseSheetFunction() {
    this.location.back();
  }

  print() {
    window.print();
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
