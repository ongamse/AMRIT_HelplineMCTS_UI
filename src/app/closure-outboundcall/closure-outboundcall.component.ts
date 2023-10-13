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


import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MdDialog } from '@angular/material';
import { FormGroup, FormArray, Validators, FormControl, FormBuilder } from '@angular/forms';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { ComplaintDialogComponent } from '../complaint-dialog/complaint-dialog.component';
import { dataService } from '../services/dataService/data.service';
import { CallClosureService } from '../services/mcts-agent/call-closure/call-closure.service';
import { CzentrixServices } from '../services/czentrixService/czentrix.service';
import { QuestionaireService } from '../services/questionaireService/questionaire-service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-closure-outboundcall',
  templateUrl: './closure-outboundcall.component.html',
  styleUrls: ['./closure-outboundcall.component.css']
})

export class InnerClosureOutbondcallComponent implements OnInit {

  // ngModels
  call_answered_check: any;
  self_number_self_check: any;
  phoneNumber_of_whom: any;

  further_call_required = false;
  no_call_required_reason: any;

  call_required: any;
  additional_call_date: any;
  additional_call_time: any;
  // call_completed = false;
  sticky_agent = false;
  remarks: any;

  // flags
  askSelfNumberQuestion: boolean;
  askRelationship: boolean;
  // call_not_required_reason_flag:boolean;
  // call_required_flag:boolean;
  additional_call_is_required: boolean;
  phoneNumber: any;
  call_not_answered: any;
  @Input() benificiaryData: any;
  mctsOutboundCall: any;
  providerServiceMapID: any;
  userID: any;
  createdBy: any;
  postData: any;
  today: any;
  transfer = false;
  transferToANM = false;
  transferTo104 = false;
  transferTo108 = false;
  @Input() transferCallFlag = false;
  @Input() transferCallToANMFlag = false;
  @Input() transferCallTo104Flag = false;
  @Input() transferCallTo108Flag = false;
  @Input() defaultFlag = false;
  @Input() skill: any;
  @Input() wrapup_exceeded: any;
  @Output() moveToWorklist: EventEmitter<any> = new EventEmitter<any>();
  @Output() moveToCallScreen: EventEmitter<any> = new EventEmitter<any>();
  transferableCampaigns: any;
  showCongenitalQuestionaire = false;
  congenitalQuestionaireForm: FormGroup;
  fb: FormBuilder = new FormBuilder();
  questionairePostData: any;
  questionrows = [];
  requiredArr = [];
  motherID: any;
  childID: any;
  caDefectList = [];
  // ctList = [];
  // cnList = [];
  // caList = [];
  caDefectItem: any;
  caRemarks: any;
  otherDefect: any;
  // complaintType: any;
  // complaintNature: any;
  // complaintAgainst: any;
  // ctRemarks: any;
  nextCallDate: any;
  nextCallDatePostData: any;
  showCauseOfDefect = false;
  callTime: any;
  invalidTimeFlag = false;

  //flag added to disable Add complaints button
  enableAddComplaint: Boolean = false;
  //call type list
  callTypes: any;

  //callType when answered or not answered
  callTypeArrayWhenChanged: any;
  maxEndDate : any;
  //check if call is verified or not
  call_verified = 'false';
  maxEndDate2: Date;
  currentLanguageSet: any;

  constructor(private dataService: dataService,public httpServices:HttpServices, private callClosureService: CallClosureService, public dialog: MdDialog, private czentrixService: CzentrixServices, private questionaireService: QuestionaireService, private alertService: ConfirmationDialogsService) {
    this.askSelfNumberQuestion = false;
    this.askRelationship = false;
    // this.call_not_required_reason_flag=false;
    // this.call_required_flag=true;
    this.additional_call_is_required = false;
  }

  ngOnInit() {

    this.transfer = false;
    this.transferToANM = false;
    this.transferTo104 = false;
    this.mctsOutboundCall = this.benificiaryData ? this.benificiaryData : undefined;

    this.motherID = this.benificiaryData ? this.benificiaryData.motherID : undefined;
    this.childID = this.benificiaryData ? this.benificiaryData.childID : undefined;
    this.providerServiceMapID = this.dataService.currentService.serviceID;
    this.userID = this.dataService.uid;
    this.createdBy = this.dataService.uname;
    this.today = new Date();
    this.getTransferableCampaigns();
    this.congenitalQuestionaireForm = this.fb.group({
      'questions': this.fb.array([])
    });
    this.callClosureService.getCongenital()
      .subscribe((response) => {
        console.log("anomalies", response.data);
        this.caDefectList = response.data;
      },
        (err) => {
          console.log(err);
        });

    this.getCallTypes();


    if (this.mctsOutboundCall != undefined && this.mctsOutboundCall.childValidDataHandler != undefined) {
      this.showCongenitalQuestionaire = true;
      this.nextCallDatePostData = {
        "childID": this.mctsOutboundCall.childID,
        "outboundCallType": this.mctsOutboundCall.outboundCallType
      }
      this.getNextANC_PNC(this.nextCallDatePostData);
    }
    else if (this.mctsOutboundCall != undefined && this.mctsOutboundCall.mctsDataReaderDetail != undefined) {
      this.nextCallDatePostData = {
        "motherID": this.mctsOutboundCall.motherID,
        "outboundCallType": this.mctsOutboundCall.outboundCallType
      }

      this.getNextANC_PNC(this.nextCallDatePostData);
    }
    console.log("nextCall date::::on init", this.nextCallDate);

    // this.callClosureService.getFeedbackTypes({
    //   "providerServiceMapID": this.providerServiceMapID
    // }).subscribe((response)=>{
    //   console.log("Feedback Types",response);
    //   this.ctList = response.data;
    // });

    // this.callClosureService.getDesignations({
    //   "providerServiceMapID": this.providerServiceMapID
    // }).subscribe((response)=>{
    //   console.log("Designations",response);
    //   this.caList = response.data;
    // },
    // (err)=>{
    //   console.log(err);
    // });

    this.dataService.call_wrapup.subscribe(() => {
      this.call_not_answered = {
        'callTypeID': this.wrapupID
      }
      this.onSubmit();
    });

  }


  // onFeedbackChange(complaintType){
  //   this.callClosureService.getFeedbackNature({
  //     "providerServiceMapID": this.providerServiceMapID,
  //     "feedbackTypeID": complaintType.feedbackTypeID
  //   }).subscribe((response)=>{
  //     console.log("Feedback Nature",response);
  //     this.cnList = response.data;
  //   },
  //   (error)=>{
  //     console.log(error);
  //   });
  // }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
        const getLanguageJson = new SetLanguageComponent(this.httpServices);
        getLanguageJson.setLanguage();
        this.currentLanguageSet = getLanguageJson.currentLanguageObject;
      }
  openComplaintDialog() {
    let benRegID = undefined;
    if (this.benificiaryData.childValidDataHandler != undefined) {
      benRegID = this.benificiaryData.childValidDataHandler.BeneficiaryRegID
    } else if (this.benificiaryData.mctsDataReaderDetail != undefined) {
      benRegID = this.benificiaryData.mctsDataReaderDetail.BeneficiaryRegID
    }
    let complaintDialog = this.dialog.open(ComplaintDialogComponent, {
      // width: '600px',
      data: {
        "benRegID": benRegID
      }
    });
    complaintDialog.afterClosed()
      .subscribe((response) => {
        console.log(JSON.stringify(response), "postarray");
        if (response) {
          this.callClosureService.createFeedback(response)
            .subscribe((res) => {
              console.log(res);
              if (res.data[0].feedbackID != undefined) {
                this.alertService.alert(this.currentLanguageSet.complaintsSavedSuccessfully, 'success');
              }
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

  ngOnChanges() {
    if (this.benificiaryData != undefined) {
      console.log('benificiaryData', this.benificiaryData, this.dataService.benObj);

      this.mctsOutboundCall = this.benificiaryData ? this.benificiaryData : undefined;
      console.log("mcysOutboundCall", JSON.stringify(this.mctsOutboundCall, null, 4));

      //console.log("this.mctsOutboundCall if benficiarydata is not undefined", JSON.stringify(this.mctsOutboundCall, null, 4));

      this.dataService.dataForMOTransferInClosure = this.benificiaryData;
    }
    if (this.benificiaryData === undefined) {
      this.benificiaryData = this.dataService.dataForMOTransferInClosure;
      this.mctsOutboundCall = this.dataService.dataForMOTransferInClosure;
      //console.log("this.mctsOutboundCall if benficiarydata is undefined", JSON.stringify(this.mctsOutboundCall, null, 4));

    }
    if (this.dataService.benObj == undefined) {
      this.benificiaryData = this.dataService.dataForMOTransferInClosure;
    }
    // console.log(this.mctsOutboundCall,"updTed ben details in closure");
    // if(this.mctsOutboundCall!= undefined && this.mctsOutboundCall.outboundCallType.slice(0,-1)=="PNC"){
    //   this.showCongenitalQuestionaire = true;
    //   this.questionairePostData = Object.assign({},this.benificiaryData);
    //   this.questionairePostData['outboundCallType'] = "CONGENITAL_ANOMALIES";
    //   this.questionaireService.getQuestionaire(this.questionairePostData)
    // 	.subscribe((response)=>{
    // 	console.log(response.data);
    // 	this.questionrows = response.data.questions;
    // 	this.congenitalQuestionaireForm = this.fb.group({
    // 		questions: this.fb.array([])
    // 	});
    // 	for(var i = 0; i< this.questionrows.length;i++){
    // 		(<FormArray>this.congenitalQuestionaireForm.get('questions')).push(this.createItem(this.questionrows[i]));
    // 	}      
    // 	},
    // 	(error)=>{
    // 	console.log(error);
    // 	});
    // }
    if (this.mctsOutboundCall != undefined && this.mctsOutboundCall.childValidDataHandler != undefined) {

      this.nextCallDatePostData = {
        "childID": this.mctsOutboundCall.childID,
        "outboundCallType": this.mctsOutboundCall.outboundCallType
      }
      this.getNextANC_PNC(this.nextCallDatePostData);
    }
    else if (this.mctsOutboundCall != undefined && this.mctsOutboundCall.mctsDataReaderDetail != undefined) {
      this.nextCallDatePostData = {
        "motherID": this.mctsOutboundCall.motherID,
        "outboundCallType": this.mctsOutboundCall.outboundCallType
      }

      this.getNextANC_PNC(this.nextCallDatePostData);
    }

    // THIS IS ADDED TO FIND CONGENITAL ANOMOLIES TO SHOW ON BASIS OF ANC/PNC CALL

    if (this.mctsOutboundCall != undefined && this.mctsOutboundCall.outboundCallType.slice(0, -1) == "PNC") {

      this.showCongenitalQuestionaire = true;
    } else {

      this.showCongenitalQuestionaire = false;
    }

    //console.log("this.transferFlag 104", this.transferCallTo104Flag);
    console.log("this.transferCallToANMFlag", this.transferCallToANMFlag);

    if (this.transferCallFlag) {
      this.transfer = true;
      this.transferToANM = false;
      this.transferTo104 = false;
      this.transferTo108 = false;
    } else if (this.transferCallTo104Flag) {
      this.transferTo104 = true;
      this.transferTo108 = false;
      this.transfer = false;
      this.transferToANM = false;
    } else if (this.transferCallTo108Flag) {
      this.transferTo108 = true;
      this.transferTo104 = false;
      this.transfer = false;
      this.transferToANM = false;
    } else if (this.transferCallToANMFlag) {
      this.transferToANM = true;
      this.transferTo108 = false;
      this.transferTo104 = false;
      this.transfer = false;
    }
    else {
      this.transfer = false;
      this.transferToANM = false;
      this.transferTo104 = false;
      this.transferTo108 = false;
    }

    if (this.defaultFlag || this.transferCallFlag || this.transferCallTo104Flag || this.transferCallTo108Flag) {
      this.call_answered_check = "yes";
      this.changeCallTypeID();
      this.enableAddComplaint = true;
      if (((this.benificiaryData != undefined) && (this.benificiaryData.mctsDataReaderDetail != undefined) && (this.benificiaryData.mctsDataReaderDetail.PhoneNo_Of_Whom != undefined) && (this.benificiaryData.mctsDataReaderDetail.PhoneNo_Of_Whom.toLowerCase() == 'self')) ||
        ((this.benificiaryData != undefined) && (this.benificiaryData.childValidDataHandler != undefined) && (this.benificiaryData.childValidDataHandler.Phone_No_of != undefined) && (this.benificiaryData.childValidDataHandler.Phone_No_of.toLowerCase() == 'self'))) {
        this.self_number_self_check = 'yes';
      }
      this.askSelfNumberQuestion = true;
    }
    else {
      this.call_answered_check = "no";
      this.changeCallTypeID();
      this.enableAddComplaint = false;
      this.askSelfNumberQuestion = false;
    }
  }

  wrapupID: any;
  getCallTypes() {
    let wrapup;
    this.callClosureService.getCallTypes(this.providerServiceMapID).subscribe((response) => {
      this.callTypes = response.data.filter(function (obj) {
        if (obj.callType == 'Wrapup Exceeds') {
          wrapup = obj.callTypeID;
        }
        return obj.callType != 'Wrapup Exceeds'
      })
      console.log("Calltypes", JSON.stringify(this.callTypes, null, 4));
      console.log(this.wrapupID);
      this.wrapupID = wrapup;
    },
      (err) => {
        console.log(err);
      });
  }
  getNextANC_PNC(data: any) {

    this.callClosureService.getNextCall(data)
      .subscribe((response) => {
        console.log(response.data.response, "next call date");
        this.nextCallDate = response.data.response;
      },
        (error) => {
          console.log(error);
        });
    console.log("nextCall date::::", this.nextCallDate);

  }

  blockKey(e: any) {
    if (e.keyCode === 9) {
      return true;
    }
    else {
      return false;
    }
  }

  createItem(obj): FormGroup {
    return this.fb.group({
      questionID: obj.questionnaireDetail.questionID,
      question: { value: obj.questionnaireDetail.question, disabled: true },
      answerType: obj.questionnaireDetail.answerType,
      showTextFor: obj.questionnaireDetail.showTextFor,
      showText: obj.questionnaireDetail.showText,
      answer: '',
      feedback: ''
    })
  }

  is_call_answered(boolean_flag) {
    if (boolean_flag === 'yes') {
      this.changeCallTypeID();

      this.askSelfNumberQuestion = true;
      this.enableAddComplaint = true;
      if (((this.benificiaryData != undefined) && (this.benificiaryData.mctsDataReaderDetail != undefined) && (this.benificiaryData.mctsDataReaderDetail.PhoneNo_Of_Whom != undefined) && (this.benificiaryData.mctsDataReaderDetail.PhoneNo_Of_Whom.toLowerCase() == 'self')) ||
        ((this.benificiaryData != undefined) && (this.benificiaryData.childValidDataHandler != undefined) && (this.benificiaryData.childValidDataHandler.Phone_No_of != undefined) && (this.benificiaryData.childValidDataHandler.Phone_No_of.toLowerCase() == 'self'))) {
        this.self_number_self_check = 'yes';
      }
    }
    else {
      this.changeCallTypeID();
      this.askSelfNumberQuestion = false;
      this.askRelationship = false;
      this.self_number_self_check = null;
      this.enableAddComplaint = false;
    }

  }

  is_number_self(boolean_flag) {
    if (boolean_flag === 'yes') {
      this.askRelationship = false;
    }
    else {
      this.askRelationship = true;
    }
  }

  // is_call_verified(boolean_flag) {
  //   if (boolean_flag === 'yes') {
  //     this.changeCallTypeID();

  //     this.askSelfNumberQuestion = true;
  //     this.enableAddComplaint = true;
  //     if (((this.benificiaryData != undefined) && (this.benificiaryData.mctsDataReaderDetail != undefined) && (this.benificiaryData.mctsDataReaderDetail.PhoneNo_Of_Whom != undefined) && (this.benificiaryData.mctsDataReaderDetail.PhoneNo_Of_Whom.toLowerCase() == 'self')) ||
  //       ((this.benificiaryData != undefined) && (this.benificiaryData.childValidDataHandler != undefined) && (this.benificiaryData.childValidDataHandler.Phone_No_of != undefined) && (this.benificiaryData.childValidDataHandler.Phone_No_of.toLowerCase() == 'self'))) {
  //       this.self_number_self_check = 'yes';
  //     }
  //   }
  //   else {
  //     this.changeCallTypeID();
  //     this.askSelfNumberQuestion = false;
  //     this.askRelationship = false;
  //     this.self_number_self_check = null;
  //     this.enableAddComplaint = false;
  //   }

  // }

  // is_further_call_required(boolean_flag)
  // {
  //   if(boolean_flag==='yes')
  //   {
  //     this.call_not_required_reason_flag=true;
  //     this.call_required_flag=false;
  //   }
  //   else
  //   {
  //     this.call_not_required_reason_flag=false;
  //     this.call_required_flag=true;
  //   }
  // }
  onCallRequiredChange(boolean_flag) {
    if (!(boolean_flag)) {
      this.no_call_required_reason = undefined;
    }
  }

  is_call_required(boolean_flag) {
    if (boolean_flag === 'yes') {
      this.additional_call_is_required = true;      
      this.maxEndDate = new Date(this.nextCallDate);
      this.maxEndDate.setDate(this.maxEndDate.getDate() -1);
    }
    else {
      this.additional_call_is_required = false;
    }
  }

  onAnamolyChange() {
    console.log(this.caDefectItem);
    this.showCauseOfDefect = (this.caDefectItem.indexOf('Other') != -1) ? true : false;
  }

  onSubmit() {
    // if(this.showCongenitalQuestionaire){
    //     this.onSaveCongenitalQA();
    // }
    var tempArr = [];
    if (this.caDefectItem != undefined) {
      for (var i = 0; i < this.caDefectItem.length; i++) {
        var tempObj = {
          "congenitalAnomalies": this.caDefectItem[i],
          "remarks": this.caRemarks
        }
        if (this.showCauseOfDefect) {
          tempObj["causeOfDefect"] = this.otherDefect;
        }
        tempArr.push(tempObj);
      }
    }
    console.log(tempArr);

    //updating ben data if not self no
    if (this.askRelationship != undefined) {
      if (this.benificiaryData.mctsDataReaderDetail != undefined) {
        if (this.phoneNumber_of_whom != undefined) {
          this.benificiaryData.mctsDataReaderDetail['PhoneNo_Of_Whom'] = this.phoneNumber_of_whom;
        }
        if (this.phoneNumber != undefined) {
          this.benificiaryData.mctsDataReaderDetail['Whom_PhoneNo'] = this.phoneNumber;
        }
      }
      if (this.benificiaryData.childValidDataHandler != undefined) {
        if (this.phoneNumber_of_whom != undefined) {
          this.benificiaryData.childValidDataHandler['Phone_No_of'] = this.phoneNumber_of_whom;
        }
        if (this.phoneNumber != undefined) {
          this.benificiaryData.childValidDataHandler['Phone_No'] = this.phoneNumber;
        }
      }
    }

    // if SELF is selected in radio button
    if (this.askRelationship === false && this.self_number_self_check === 'yes') {
      if (this.benificiaryData.mctsDataReaderDetail != undefined) {
        this.benificiaryData.mctsDataReaderDetail['PhoneNo_Of_Whom'] = 'Self';
      }
      if (this.benificiaryData.childValidDataHandler != undefined) {
        this.benificiaryData.childValidDataHandler['Phone_No_of'] = 'Self';
      }
    }

    if (this.callTime) {
      // this.additional_call_date.setHours(this.callTime.split(':')[0]);
      // this.additional_call_date.setMinutes(this.callTime.split(':')[1]);
    } else {
      // this.additional_call_date.setHours(0);
      // this.additional_call_date.setMinutes(0);
    }
    // this.additional_call_date.setSeconds(0);
    // this.additional_call_date.setMilliseconds(0);

    this.postData = {
      "mctsOutboundCall": this.mctsOutboundCall,
      "isAnswered": this.call_answered_check == "yes" ? true : false,
      "isVerified": this.call_verified,
      "noFurtherCallRequired": this.further_call_required,
      "reasonNoFurtherCallRequired":  (this.no_call_required_reason !== undefined && this.no_call_required_reason !== null) ? this.no_call_required_reason.trim() : null,
      "additionalCallRequired": this.call_required == "yes" ? true : false,
      "stickyAgentRequired": this.sticky_agent,
      "isCompleted": this.further_call_required,
      "prefferedCallDate": this.call_required == "yes" ? new Date((this.additional_call_date) - 1 * (this.additional_call_date.getTimezoneOffset() * 60 * 1000)).toJSON() : null,
      "providerServiceMapID": this.providerServiceMapID,
      "userID": this.userID,
      "createdBy": this.createdBy,
      "callDetailID": this.dataService.callDetailID,
      "callTypeID": this.call_not_answered.callTypeID,
      "isTransfered": this.transfer,
      "isTransferedToANM": this.transferToANM,
      "isTransferedTo104": this.transferTo104,
      "remarks": (this.remarks !== undefined && this.remarks !== null) ? this.remarks.trim() : null
    };
    if (tempArr.length > 0) {
      this.postData['childCongenitalAnomaliesDetails'] = tempArr;
    }
    // console.log(this.postData["mctsOutboundCall"].mctsDataReaderDetail['fileManager']);
    if (this.postData["mctsOutboundCall"].childValidDataHandler != undefined) {
      delete this.postData["mctsOutboundCall"].childValidDataHandler['fileManager'];
      delete this.postData["mctsOutboundCall"].childValidDataHandler['beneficiaryDetail'];
    }
    else {
      delete this.postData["mctsOutboundCall"].mctsDataReaderDetail['fileManager'];
      delete this.postData["mctsOutboundCall"].mctsDataReaderDetail['beneficiaryDetail'];
    }
    console.log(JSON.stringify(this.postData, null, 4));
    console.log('motrfr: ', this.transfer, ' 104 trfr: ', this.transferTo104, 'ANM trfr:', this.transferToANM);

    if ((!this.transfer) && (!this.transferTo104) && (!this.transferToANM)) {
      this.callClosureService.putCallClosure(this.postData)
        .subscribe((response) => {
          console.log(response);
          this.dataService.onCall.next({
            "isonCall": false
          });
          localStorage.setItem('onCall', 'false');

          if (response) {
            this.czentrixService.disconnectCall(this.czentrixService.agent_id, this.czentrixService.ip)
              .subscribe((response) => {
                console.log(response.status, " in call disconnection");
              },
                (error) => {
                  console.log(error);
                })
            this.alertService.alert(response.data.response, 'success')
            this.resetScreen();
            this.dataService.benObj = undefined;
            this.dataService.bendata_for_MO = undefined;
            this.moveToWorklist.emit();

          }
        },
          (error) => {
            console.log(error);
          })
    } else {

      console.log("Calling this transfer call");
      if (this.transferTo104) {
        this.transferCallTo104Campaign();
      } 
      else if (this.transferTo108) {
        this.transferCallTo108Campaign();
      } 
      else if (this.transferToANM) {
        this.transferCallToANMCampaign();
      }
      else {
        this.transferCallToCampaign();
      }
    }


  }

  checkTimeValidation(time) {
    console.log('time:', time);
    let currentDateTime = new Date();
    let current_hour = currentDateTime.getHours();
    let current_min = currentDateTime.getMinutes();
    if (this.additional_call_date.getFullYear() === currentDateTime.getFullYear() &&
      this.additional_call_date.getMonth() === currentDateTime.getMonth() &&
      this.additional_call_date.getDate() === currentDateTime.getDate()) {
      if (current_hour > time.split(':')[0] && current_min > time.split(':')[1]) {
        console.log('invalid time');
        this.invalidTimeFlag = true;
      } else {
        console.log('valid time');
        this.invalidTimeFlag = false;
      }
    }

  }

  // onSaveCongenitalQA(){
  //   console.log(this.congenitalQuestionaireForm.value);
  // 	for(var i=0; i< this.congenitalQuestionaireForm.value.questions.length;i++){
  // 		var tempObj = {};
  // 		tempObj['motherID'] = this.motherID;
  // 		if(this.childID!=undefined){
  // 			tempObj['childID'] = this.childID;
  // 		}
  // 		tempObj['questionID'] = this.congenitalQuestionaireForm.value.questions[i].questionID;
  // 		tempObj['answer'] = this.congenitalQuestionaireForm.value.questions[i].answer;
  // 		tempObj['remarks'] = (this.congenitalQuestionaireForm.value.questions[i].triggerFeedback && this.congenitalQuestionaireForm.value.questions[i].triggerFeedbackFor == this.congenitalQuestionaireForm.value.questions[i].answer)?this.congenitalQuestionaireForm.value.questions[i].feedback:'';
  // 		tempObj['createdBy'] = this.createdBy;
  // 		this.requiredArr.push(tempObj);
  // 	}
  // 	console.log(JSON.stringify(this.requiredArr));
  // 	this.callClosureService.putCallResponse(this.requiredArr)
  // 	.subscribe((response)=>{
  // 		console.log(response);
  // 		if(response){
  //       console.log(response.data.response,"Congenital anomalies Q&A");
  // 		}
  // 	},
  // 	(error)=>{
  // 		console.log(error);
  // 	})
  // }

  resetScreen() {
    // ngModels
    // this.call_answered_check = undefined;
    this.invalidTimeFlag = false;
    this.call_not_answered = undefined;
    this.call_verified = 'false';
    this.self_number_self_check = undefined
    // relationship_with_numberholder:any;

    this.further_call_required = false;
    this.no_call_required_reason = undefined;

    this.call_required = undefined;
    this.additional_call_date = undefined;
    this.additional_call_time = undefined;
    // call_completed = false;
    this.sticky_agent = false;
    this.remarks = undefined;

    // this.askSelfNumberQuestion=false;
    this.additional_call_is_required = false;
    this.askRelationship = false;
    this.phoneNumber_of_whom = undefined;
    this.phoneNumber = undefined;
    this.caDefectItem = undefined;
    this.caRemarks = undefined;
    this.otherDefect = undefined;
    // this.complaintType = undefined;
    // this.complaintNature = undefined;
    // this.complaintAgainst = undefined;
    // this.ctRemarks = undefined;
    this.showCauseOfDefect = false;
    this.showCongenitalQuestionaire = false;
    // this.questionaireService.getQuestionaire(this.questionairePostData)
    //   .subscribe((response)=>{
    //   console.log(response.data);
    //   this.questionrows = response.data.questions;
    //   this.congenitalQuestionaireForm = this.fb.group({
    //     questions: this.fb.array([])
    //   });
    //   for(var i = 0; i< this.questionrows.length;i++){
    //     (<FormArray>this.congenitalQuestionaireForm.get('questions')).push(this.createItem(this.questionrows[i]));
    //   }      
    //   },
    //   (error)=>{
    //   console.log(error);
    //   });
  }

  navigateToPrev() {
    this.moveToCallScreen.emit();
    // this.resetScreen();
  }

  getTransferableCampaigns() {
    this.czentrixService.getTransferableCampaigns(this.czentrixService.agent_id, this.czentrixService.ip)
      .subscribe((response) => {
        this.transferableCampaigns = response.data.campaign;
        console.log("transferableCampaigns: " + JSON.stringify(this.transferableCampaigns, null, 4));
      },
        (err) => {
          console.log('Error in getTransferableCampaigns', err);
        });
  }

  transferCallToCampaign() {
    console.log('inside mcts transfer');

    let campaign: any;
    this.transferableCampaigns.forEach((element) => {
      if (element.campaign_name.indexOf("MO") != -1) {
        campaign = element.campaign_name;
      }
    });
    // if (this.transferableCampaigns[0].campaign_name.indexOf("MO") != -1) {
    //   campaign = this.transferableCampaigns[0].campaign_name;
    // } else {
    //   campaign = this.transferableCampaigns[1].campaign_name;
    // }
    let skill_transfer_flag = '0';
    if (this.skill != '' && this.skill != undefined && this.skill != null) {
      // WRITE CODE HERE TO PASS VALUES
      skill_transfer_flag = this.skill ? '1' : '0';

    }
    this.czentrixService.transferToCampaign(this.czentrixService.agent_id, this.czentrixService.ip, campaign, skill_transfer_flag, this.skill)
      .subscribe((response) => {
        console.log("transferToCampaign response: " + JSON.stringify(response));
        if (response.data.status == "SUCCESS") {
          console.log("transfered successfully");
          console.log("closing call after transfer for ANM");
          this.callClosureService.putCallClosure(this.postData)
            .subscribe((res) => {
              console.log(res);
              this.dataService.onCall.next({
                "isonCall": false
              });

              localStorage.setItem('onCall', 'false');

              this.czentrixService.disconnectCall(this.czentrixService.agent_id, this.czentrixService.ip)
                .subscribe((_resp) => {
                  console.log(_resp.status, " in call disconnection");
                },
                  (error) => {
                    console.log(error);
                  });
              this.alertService.alert(this.currentLanguageSet.callTransferredTo +' ' + response.data.transfer_campaign_info, 'success');
              this.resetScreen();
              this.moveToWorklist.emit();
            },
              (error) => {
                console.log(error);
              })
        }
      }, (err) => {
        console.log('Error in transferCall', err);
      });

    // this.transfer = false;
    // this.transferCallFlag = false;
  }

  transferCallToANMCampaign() {
    console.log('inside mcts transfer');

    let campaign: any;
    this.transferableCampaigns.forEach((element) => {
      if (element.campaign_name.indexOf("ANM") != -1) {
        campaign = element.campaign_name;
      }
    });
    // if (this.transferableCampaigns[0].campaign_name.indexOf("ANM") != -1) {
    //   campaign = this.transferableCampaigns[0].campaign_name;
    // } else {
    //   campaign = this.transferableCampaigns[1].campaign_name;
    // }
    let skill_transfer_flag = '0';
    if (this.skill != '' && this.skill != undefined && this.skill != null) {
      // WRITE CODE HERE TO PASS VALUES
      skill_transfer_flag = this.skill ? '1' : '0';

    }
    this.czentrixService.transferToCampaign(this.czentrixService.agent_id, this.czentrixService.ip, campaign, skill_transfer_flag, this.skill)
      .subscribe((response) => {
        console.log("transferToCampaign response: " + JSON.stringify(response));
        if (response.data.status == "SUCCESS") {
          console.log("transfered successfully from anm to anm");
          console.log("closing call after transfer for ANM");
          this.callClosureService.putCallClosure(this.postData)
            .subscribe((res) => {
              console.log(res);
              this.dataService.onCall.next({
                "isonCall": false
              });

              localStorage.setItem('onCall', 'false');

              this.czentrixService.disconnectCall(this.czentrixService.agent_id, this.czentrixService.ip)
                .subscribe((_resp) => {
                  console.log(_resp.status, " in call disconnection");
                },
                  (error) => {
                    console.log(error);
                  });
              this.alertService.alert(this.currentLanguageSet.callTransferredTo +' ' + response.data.transfer_campaign_info, 'success');
              this.resetScreen();
              this.moveToWorklist.emit();
            },
              (error) => {
                console.log(error);
              })
        }
      }, (err) => {
        console.log('Error in transferCall', err);
      });

  }

  transferCallTo104Campaign() {
    console.log('inside 104 transfer');
    let campaign: any;
    this.transferableCampaigns.forEach((element) => {
      if (element.campaign_name.indexOf("104") != -1) {
        campaign = element.campaign_name;
      }
    });
    // if (this.transferableCampaigns[2].campaign_name.indexOf("104") != -1) {
    //   campaign = this.transferableCampaigns[2].campaign_name;
    // }
    // } else {
    //   campaign = this.transferableCampaigns[2].campaign_name;
    // }
    this.czentrixService.transferToCampaign(this.czentrixService.agent_id, this.czentrixService.ip, campaign)
      .subscribe((response) => {
        console.log("transferToCampaign response: " + JSON.stringify(response));
        if (response.data.status == "SUCCESS") {
          console.log("transfered successfully");
          console.log("closing call after transfer for ANM");
          this.callClosureService.putCallClosure(this.postData)
            .subscribe((res) => {
              console.log(res);
              this.dataService.onCall.next({
                "isonCall": false
              });
              localStorage.setItem('onCall', 'false');

              this.czentrixService.disconnectCall(this.czentrixService.agent_id, this.czentrixService.ip)
                .subscribe((_resp) => {
                  console.log(_resp.status, " in call disconnection");
                },
                  (error) => {
                    console.log(error);
                  });
              this.alertService.alert(this.currentLanguageSet.callTransferredTo +' ' + response.data.transfer_campaign_info, 'success')

              this.resetScreen();
              this.moveToWorklist.emit();

            },
              (error) => {
                console.log(error);
              })
        }
      }, (err) => {
        console.log('Error in transferCall', err);
      });

    // this.transferTo104 = false;
    // this.transferCallTo104Flag = false;

  }

  transferCallTo108Campaign() {
    console.log('inside 108 transfer');
    let campaign: any;
    // if (this.transferableCampaigns[0].campaign_name.indexOf("108") != -1) {
    //   campaign = this.transferableCampaigns[0].campaign_name;
    // } else {
    //   campaign = this.transferableCampaigns[1].campaign_name;
    // }
    campaign = 'EMERGENCY_108';
    this.czentrixService.transferToCampaign(this.czentrixService.agent_id, this.czentrixService.ip, campaign)
      .subscribe((response) => {
        console.log("transferToCampaign response: " + JSON.stringify(response));
        if (response.data.status == "SUCCESS") {
          console.log("transfered successfully");
          console.log("closing call after transfer for MO");
          this.callClosureService.putCallClosure(this.postData)
            .subscribe((res) => {
              console.log(res);
              this.dataService.onCall.next({
                "isonCall": false
              });
              localStorage.setItem('onCall', 'false');

              this.czentrixService.disconnectCall(this.czentrixService.agent_id, this.czentrixService.ip)
                .subscribe((_resp) => {
                  console.log(_resp.status, " in call disconnection");
                },
                  (error) => {
                    console.log(error);
                  });
              this.alertService.alert(this.currentLanguageSet.callTransferredTo +' ' + response.data.transfer_campaign_info, 'success')

              this.resetScreen();
              this.moveToWorklist.emit();

            },
              (error) => {
                console.log(error);
              })
        }
      }, (err) => {
        console.log('Error in transferCall', err);
      });
  }

  changeCallTypeID() {
    if (this.call_answered_check == "yes") {
      if (this.callTypes != undefined) {
        this.call_not_answered = this.callTypes.filter((item) => {
          return item.callType == 'Answered';
        })[0];
        console.log("this.call_not_answered", JSON.stringify(this.call_not_answered));
      }
    } else {
      this.call_not_answered = undefined;
      if (this.callTypes != undefined) {
        this.callTypeArrayWhenChanged = this.callTypes.filter((item) => {
          if (item.callType != 'Answered') {
            return item;
          }
        });
      }

    }
  }
}
