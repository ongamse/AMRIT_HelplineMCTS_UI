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
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";
import { enableProdMode } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { FormGroup, FormControl, FormBuilder, FormArray } from "@angular/forms";
import { OCWService } from "../services/mcts-agent/outbond-call-worklist/outbond-call-worklist.service";
import { dataService } from "../services/dataService/data.service";
import { QuestionaireService } from "../services/questionaireService/questionaire-service";
import { CallClosureService } from "../services/mcts-agent/call-closure/call-closure.service";
import { CzentrixServices } from "../services/czentrixService/czentrix.service";
import { MdDialog } from "@angular/material";
import { SmsDialogComponent } from "../sms-dialog/sms-dialog.component";
import { EditBeneficiaryComponent } from "../edit-beneficiary/edit-beneficiary.component";
import { ConfirmationDialogsService } from "../services/dialog/confirmation.service";
import { ChangeLogComponent } from "../change-log/change-log.component";

import { GenerateBenificiaryIDComponent } from "../generate-benificiary-id/generate-benificiary-id.component";

import { CommonSmsDialogComponent } from "../common-sms-dialog/common-sms-dialog.component";
import { SmsTemplateService } from "./../services/supervisorService/sms-template-service.service";
import { DatePipe } from "@angular/common";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";
declare var jQuery: any;

@Component({
  selector: "app-outbound-call-screen",
  templateUrl: "./outbound-call-screen.component.html",
  styleUrls: ["./outbound-call-screen.component.css"]
  //providers:[OCWService]
})
export class OutbondCallDocSelfNoComponent implements OnInit {
  @Output() viewClosureWindow: EventEmitter<any> = new EventEmitter<any>();
  @Output() showHistory: EventEmitter<any> = new EventEmitter<any>();
  @Output() updated_ben_data: EventEmitter<any> = new EventEmitter<any>();
  @Input() benificiaryData: any;
  @Input() refreshScreen = false;
  @Input() updateFlag = false;
  @Input() callTypesPreLoad: any;
  @Input() onChangeCalled: any;
  transferCallFlag = false;
  transferCallToANMFlag = false;
  transferCallTo104Flag = false;
  transferCallTo108Flag = false;
  callAnsweredFlag = false;
  formBuilder: FormBuilder = new FormBuilder();
  questionaireForm: FormGroup = new FormGroup({
    questions: new FormArray([])
  });
  listDisplay: boolean = true;
  providerServiceMapID: any;
  questionrows = [];
  answers = [];
  selectedCallType: any;
  postData: any;
  callTypes = [];
  pncCallTypes = [];
  obCallID: any;
  motherID: any;
  childID: any;
  requiredArr = [];
  postArr = [];
  createdBy: any;
  high_risk: boolean;
  reason_for_high_risk: any;
  @ViewChild("callTypeForm") callTypeForm: NgForm;
  role: any;
  interaction: any;
  pncFlag: boolean = false;
  pncCallType: string = "";
  getCallResponsePostData: any;
  count = 0;
  closureObj: any;
  isOnCall: boolean = false;
  displayCallType: any;
  transferableCampaigns: any;
  transferSkills: any = [];
  transferSkill: any;
  responsedummy: any;
  childQuestionRows = [];
  parentQuestionID: any;
  parentAnswer: any;
  ChangedDate: string;
  changedTime: string;
  dateTime: any;
  selectedDate: Date;
  splitAnswer: any;
  updateBtnFlag: boolean = false;
  mandatoryArray: any[];
  mandatoryQuesValue: any = 0;
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
  

  constructor(
    private _OCWService: OCWService,
    private dataService: dataService,
    private questionaireService: QuestionaireService,
    private callClosureService: CallClosureService,
    public dialog: MdDialog,
    private httpServiceService: HttpServices,
    private czentrixService: CzentrixServices,
    private alertService: ConfirmationDialogsService,
    private cdr: ChangeDetectorRef,
    private sms_service: SmsTemplateService,
    private datepipe: DatePipe
  ) {
    this.questionaireForm = this.formBuilder.group({
      questions: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.fetchLanguageResponse();
    console.log(
      "in Outbound Call screen, beneficiary details on init",
      this.benificiaryData
    );
    this.dataService.onCall.subscribe(data => {
      console.log(data);
      this.updateOnCall(data);
    });
    this.providerServiceMapID = this.dataService.currentService.serviceID;
    this.createdBy = this.dataService.uname;
    // this.role = this.dataService.currentRole.RoleName;
    this.role = this.dataService.Role_Name;
    this.displayCallType = this.benificiaryData
      ? this.benificiaryData.displayOBCallType
        ? this.benificiaryData.displayOBCallType
        : ""
      : "";
    this.selectedCallType = this.benificiaryData
      ? this.benificiaryData.outboundCallType
      : "";
    this.obCallID = this.benificiaryData
      ? this.benificiaryData.obCallID
      : undefined;
    this.motherID = this.benificiaryData
      ? this.benificiaryData.motherID
      : undefined;
    this.childID = this.benificiaryData
      ? this.benificiaryData.childID
      : undefined;
    this.high_risk =
      this.benificiaryData && this.benificiaryData.mctsDataReaderDetail
        ? this.benificiaryData.mctsDataReaderDetail.High_Risk
        : undefined;
    this.reason_for_high_risk =
      this.benificiaryData && this.benificiaryData.mctsDataReaderDetail
        ? this.benificiaryData.mctsDataReaderDetail.High_Risk_Reason
        : undefined;
    this.questionaireService
      .getCallTypes({
        providerServiceMapID: this.providerServiceMapID
      })
      .subscribe(
        response => {
          this.callTypes = response.data;
          this.pncCallTypes = this.callTypes.filter(obj => {
            return obj.outboundCallType.slice(0, -1) == "PNC";
          });
          console.log("call Types", this.callTypes);
        },
        error => {
          console.log(error);
        }
      );
    // this.getTransferableCampaigns();
    console.log("Beneficiary Data", this.benificiaryData);
    this.getTransferableCampaigns();
  }

  updateOnCall(data) {
    this.isOnCall = data.isonCall;
  }

  ngOnChanges() {
    this.mandatoryQuesValue = 0;
    console.log("ON Change called", this.onChangeCalled);
    if (this.benificiaryData != undefined) {
      this.dataService.bendata_for_MO = this.benificiaryData;
    }
    console.log("on changes called");
    this.count = this.count + 1;
    console.log(
      "in Outbound Call screen, beneficiary details on change",
      this.count,
      this.benificiaryData
    );
    //console.log("this.dataService.benObj: ", JSON.stringify(this.dataService.benObj, null, 4));

    /*new content added to get content from data service (this is for special case
       where ben details arent fetched in 3rd screen if call is being made for
        subsequent times from 2nd screen) */
    if (this.benificiaryData === undefined) {
      this.benificiaryData = this.dataService.benObj;
    }
    if (this.dataService.benObj == undefined) {
      this.benificiaryData = this.dataService.bendata_for_MO;
    }

    this.callTypes = this.callTypesPreLoad
      ? this.callTypesPreLoad
      : this.callTypes;
    this.pncCallTypes = this.callTypesPreLoad
      ? this.callTypesPreLoad.filter(obj => {
          return obj.outboundCallType.slice(0, -1) == "PNC";
        })
      : this.pncCallTypes;

    // here, we are trying to populate the checkbox and its reason in case of mother record
    if (this.benificiaryData != undefined) {
      if (this.benificiaryData.mctsDataReaderDetail != undefined) {
        this.high_risk = this.benificiaryData.mctsDataReaderDetail.High_Risk;
        this.reason_for_high_risk = this.benificiaryData.mctsDataReaderDetail.High_Risk_Reason;
      }
    }

    this.displayCallType = this.benificiaryData
      ? this.benificiaryData.displayOBCallType
        ? this.benificiaryData.displayOBCallType
        : ""
      : "";
    this.selectedCallType = this.benificiaryData
      ? this.benificiaryData.outboundCallType
      : "";
    this.obCallID = this.benificiaryData
      ? this.benificiaryData.obCallID
      : undefined;
    this.motherID = this.benificiaryData
      ? this.benificiaryData.motherID
      : undefined;
    this.childID = this.benificiaryData
      ? this.benificiaryData.childID
      : undefined;
    if (
      this.selectedCallType != "" &&
      this.selectedCallType.slice(0, -1) == "PNC" &&
      this.callTypes != undefined &&
      this.callTypes.length != 0
    ) {
      this.pncFlag = true;
      this.pncCallType = this.selectedCallType;
      console.log(
        "this.selectedCallType ===",
        this.selectedCallType,
        this.pncCallType != this.selectedCallType
      );

      // if (this.pncCallType != this.selectedCallType) {
      this.postData = {
        mctsQAMappingDetail: {
          providerServiceMapID: this.providerServiceMapID,
          outboundCallType: this.selectedCallType,
          effectiveFrom: this.callTypes[0].effectiveFrom
        },
        mctsOutboundCall: this.benificiaryData,
        callDetailID: this.dataService.callDetailID
      };
      console.log(JSON.stringify(this.postData));
      this.getQuestionList(this.postData);
      // }
    }
    if (
      this.selectedCallType != "" &&
      this.selectedCallType.slice(0, -1) == "ANC" &&
      this.callTypes != undefined &&
      this.callTypes.length != 0
    ) {
      this.pncFlag = false;
      if (this.callTypeForm) {
        this.callTypeForm.form.patchValue({
          callType: this.selectedCallType
        });
      }
      this.postData = {
        mctsQAMappingDetail: {
          providerServiceMapID: this.providerServiceMapID,
          outboundCallType: this.selectedCallType,
          effectiveFrom: this.callTypes[0].effectiveFrom
        },
        mctsOutboundCall: this.benificiaryData,
        callDetailID: this.dataService.callDetailID
      };
      // console.log(JSON.stringify(this.postData));
      this.getQuestionList(this.postData);
    }
    if (this.refreshScreen) {
      this.refreshscreen();
      this.benificiaryData = undefined;
      // added to reset the closure page during next call.
      this.transferCallFlag = false;
      this.transferCallToANMFlag = false;
      this.transferCallTo104Flag = false;
      this.transferCallTo108Flag = false;
      this.callAnsweredFlag = false;
      this.requiredArr = [];
      this.skillVisible = false;
      this.TransferSkill = undefined;
      this.questionaireForm.reset();
    }


    if (this.benificiaryData != undefined && this.isOnCall) {
      if (this.benificiaryData.childValidDataHandler != undefined) {
        console.log("CHILD DATA");
        if (
          this.benificiaryData.childValidDataHandler.BeneficiaryRegID ==
          undefined
        ) {
          this.generateBenID(this.benificiaryData);
        }
      } else if (this.benificiaryData.mctsDataReaderDetail != undefined) {
        console.log("MOTHER DATA");
        if (
          this.benificiaryData.mctsDataReaderDetail.BeneficiaryRegID ==
          undefined
        ) {
          this.generateBenID(this.benificiaryData);
        }
      } 
    }

  

    this.cdr.detectChanges();
  }

  get answerOptions(): FormArray {
    return this.questionaireForm.get("questions") as FormArray;
  }

  addChild(index, answer, questionID) {
    console.log("index", index);
    console.log("anwsers", answer);
    console.log("question", questionID);

    this.parentQuestionID = questionID;
    this.parentAnswer = answer;

    //removing the child questions
    for (let j = index + 1; j < this.questionrows.length; j++) {
      var deleteIndex = index + 1;
      if (this.questionrows[deleteIndex].questionnaireDetail.isChild) {
        this.answerOptions.removeAt(deleteIndex);
        this.questionrows.splice(deleteIndex, 1);
        j--;
      }
      if (deleteIndex < this.questionrows.length) {
        if (!this.questionrows[deleteIndex].questionnaireDetail.isChild) {
          break;
        }
      }
    }

    // inserting Child
    for (let i = 0; i < this.childQuestionRows.length; i++) {
      if (
        this.childQuestionRows[i].questionnaireDetail.parentQuestionID ==
          questionID &&
        this.childQuestionRows[i].questionnaireDetail.parentAnswer == answer
      ) {
        var childQuestionID = this.childQuestionRows[i].questionnaireDetail
          .questionID;

        var answerObjArray = this.answers.filter(obj => {
          return obj.questionID == this.childQuestionRows[i].questionID;
        });
        if (answerObjArray.length > 0) {
          if (answerObjArray[0].questionnaireDetail.answerType === "Multiple") {
            if (answerObjArray[0].answer.includes("||")) {
              answerObjArray[0].answer = answerObjArray[0].answer.split("||");
              console.log("splitarray", answerObjArray[0].answer);
            } else {
              var singleArray = [];
              singleArray.push(answerObjArray[0].answer);
              answerObjArray[0].answer = singleArray;
            }
          }
          // Wed Oct 07 2020 16:29:00 GMT+0530
          if (answerObjArray[0].questionnaireDetail.answerType === "Time") {
            answerObjArray[0].answer =
              "Wed Oct 07 2020 " + answerObjArray[0].answer + " GMT+0530";
          }
        }

        //inserting child question
        this.answerOptions.insert(
          index + 1,
          this.createItem(this.childQuestionRows[i], answerObjArray)
        );
        this.questionrows.splice(index + 1, 0, this.childQuestionRows[i]);
      }
    }

    console.log("formArray", this.answerOptions.value);
    console.log("questionArray", this.questionrows);
  }
  addChildQuestions() {
    for (let i = 0; i < this.questionrows.length; i++) {
      var availableInAns = false;
      var parentAns = "";
      for (let j = 0; j < this.answers.length; j++) {
        if (
          this.questionrows[i].questionnaireDetail.questionID ==
          this.answers[j].questionnaireDetail.questionID
        ) {
          parentAns = this.answers[j].answer;
          availableInAns = true;
          break;
        }
      }

      if (availableInAns) {
        for (let k = 0; k < this.childQuestionRows.length; k++) {
          if (
            this.questionrows[i].questionnaireDetail.questionID ==
              this.childQuestionRows[k].questionnaireDetail.parentQuestionID &&
            parentAns ==
              this.childQuestionRows[k].questionnaireDetail.parentAnswer
          ) {
            this.questionrows.splice(i + 1, 0, this.childQuestionRows[k]);
            break;
          }
        }
      }
    }
    console.log("after", this.questionrows);
  }
  createChildItem(obj, answerObjArray): FormGroup {
    return this.formBuilder.group({
      mctsQuestionValues:
        obj.questionnaireDetail.mctsQuestionValues.length == 0
          ? null
          : obj.questionnaireDetail.mctsQuestionValues.length
    });
  }

  sendSms() {
    let smsDialog = this.dialog.open(SmsDialogComponent, {
      width: "500px"
    });
    smsDialog.afterClosed().subscribe(response => {
      if (response != undefined) {
        console.log(response);
        this.callClosureService
          .putSms({
            callDetailID: this.dataService.callDetailID,
            smsAdvice: response.smsText,
            smsPh: response.altNoCheck
              ? response.alternateNumber
              : this.pncFlag
              ? this.benificiaryData.childValidDataHandler.Phone_No
              : this.benificiaryData.mctsDataReaderDetail.Whom_PhoneNo
          })
          .subscribe(
            res => {
              console.log(res);

              let sms_template_id = "";
              let smsTypeID = "";
              // below line has hardcoded content in else section; needs to be removed
              let currentServiceID = this.dataService.current_serviceID;

              this.sms_service.getSMStypes(currentServiceID).subscribe(
                responsee => {
                  if (responsee != undefined) {
                    if (responsee.length > 0) {
                      for (let i = 0; i < responsee.length; i++) {
                        if (
                          responsee[i].smsType.toLowerCase() ===
                          "MCTS-MO Advice SMS".toLowerCase()
                        ) {
                          smsTypeID = responsee[i].smsTypeID;
                          break;
                        }
                      }
                    }
                  }

                  if (smsTypeID != "") {
                    this.sms_service
                      .getSMStemplates(
                        this.dataService.currentService.serviceID,
                        smsTypeID
                      )
                      .subscribe(
                        resp => {
                          if (resp != undefined) {
                            if (resp.length > 0) {
                              for (let j = 0; j < resp.length; j++) {
                                if (resp[j].deleted === false) {
                                  sms_template_id = resp[j].smsTemplateID;
                                  break;
                                }
                              }
                            }

                            if (smsTypeID != "") {
                              let reqObj = {
                                alternateNo: response.altNoCheck
                                  ? response.alternateNumber
                                  : this.pncFlag
                                  ? this.benificiaryData.childValidDataHandler
                                      .Phone_No
                                  : this.benificiaryData.mctsDataReaderDetail
                                      .Whom_PhoneNo,
                                beneficiaryRegID: this.pncFlag
                                  ? this.benificiaryData.childValidDataHandler
                                      .BeneficiaryRegID
                                  : this.benificiaryData.mctsDataReaderDetail
                                      .BeneficiaryRegID,
                                createdBy: this.dataService.uname,
                                is1097: false,
                                providerServiceMapID: this.dataService
                                  .currentService.serviceID,
                                smsTemplateID: sms_template_id,
                                smsTemplateTypeID: smsTypeID,
                                moAdvice: response.smsText
                              };

                              let arr = [];
                              arr.push(reqObj);

                              this.sms_service.sendSMS(arr).subscribe(
                                ressponse => {
                                  console.log(ressponse, "SMS Sent");
                                  alert(this.currentLanguageSet.smsSent);
                                },
                                err => {
                                  console.log(err, "SMS not sent Error");
                                  alert(this.currentLanguageSet.smsNotSent);
                                }
                              );
                            }
                          }
                        },
                        err => {
                          console.log(err, "Error in fetching sms templates");
                        }
                      );
                  }
                },
                err => {
                  console.log(err, "error while fetching sms types");
                }
              );

              // ========commented on 11 oct, new sms code added above============================= //

              // let reqArray = [
              //   {
              //     'alternateNo': response.altNoCheck ? response.alternateNumber : ((this.pncFlag) ? this.benificiaryData.childValidDataHandler.Phone_No : this.benificiaryData.mctsDataReaderDetail.Whom_PhoneNo),
              //     'createdBy': this.dataService.uname,
              //     'is1097': false,
              //     'providerServiceMapID': this.dataService.currentService.serviceID,
              //     'moAdvice': response.smsText,
              //     '':,
              //     '':
              //   }
              // ];

              // this.sms_service.sendSMS(reqArray).subscribe(success => {
              //   this.alertService.alert(res.data.response, 'success');
              // }, err => {
              //   this.alertService.alert('SMS sending failed', 'error');
              // });
            },
            err => {
              console.log(err);
            }
          );
      }
    });
  }

  blockKey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }

  onCallTypeChange() {
    //pushing into array if questions are answered.
    this.postArr = [];
    console.log(this.questionaireForm.value);
    for (var i = 0; i < this.questionaireForm.value.questions.length; i++) {
      var tempObj = {};
      if (this.motherID != undefined) {
        tempObj["motherID"] = this.motherID;
      }
      if (this.childID != undefined) {
        tempObj["childID"] = this.childID;
      }
      tempObj["questionID"] = this.questionaireForm.value.questions[
        i
      ].questionID;
      if (this.questionaireForm.value.questions[i].answerType === "Multiple") {
        console.log(this.questionaireForm.value.questions[i].answer);
        var answer = "";
        if (this.questionaireForm.value.questions[i].answer != null) {
          for (
            let j = 0;
            j < this.questionaireForm.value.questions[i].answer.length;
            j++
          ) {
            if (j > 0) {
              answer += "||";
            }
            answer += this.questionaireForm.value.questions[i].answer[j];
          }
          tempObj["answer"] = answer;
        } else {
          tempObj["answer"] = "";
        }
      } else if (
        this.questionaireForm.value.questions[i].answerType === "Date"
      ) {
        if (this.questionaireForm.value.questions[i].answer !== "") {
          tempObj["answer"] = this.datepipe.transform(
            this.questionaireForm.value.questions[i].answer,
            "yyyy-MM-dd"
          );
        } else {
          tempObj["answer"] = "";
        }
      } else if (
        this.questionaireForm.value.questions[i].answerType === "Time"
      ) {
        if (this.questionaireForm.value.questions[i].answer !== "") {
          tempObj["answer"] = this.datepipe.transform(
            this.questionaireForm.value.questions[i].answer,
            "HH:mm:ss"
          );
        } else {
          tempObj["answer"] = "";
        }
      } else if (
        this.questionaireForm.value.questions[i].answerType === "Date & Time"
      ) {
        if (this.questionaireForm.value.questions[i].answer !== "") {
          tempObj["answer"] = this.datepipe.transform(
            this.questionaireForm.value.questions[i].answer,
            "yyyy-MM-dd HH:mm:ss"
          );
        } else {
          tempObj["answer"] = "";
        }
      } else {
        tempObj["answer"] = this.questionaireForm.value.questions[i].answer;
      }
      if (this.questionaireForm.value.questions[i].answer != "" && (this.questionaireForm.value.questions[i].answerType == "Yes/No"
      || this.questionaireForm.value.questions[i].answerType == "DropDown")) {
        tempObj["remarks"] =
          this.questionaireForm.value.questions[i].showText &&
          this.questionaireForm.value.questions[i].showTextFor.toLowerCase() ===
            this.questionaireForm.value.questions[i].answer.toLowerCase()
            ? this.questionaireForm.value.questions[i].feedback
            : "";
      } else {
        tempObj["remarks"] = "";
      }
      tempObj["createdBy"] = this.createdBy;
      tempObj["callDetailID"] = this.dataService.callDetailID;
      tempObj["outboundCallType"] = this.questionaireForm.value.questions[
        i
      ].outboundCallType;

      if (tempObj["answer"] != "") {
        this.postArr.push(tempObj);
      }
    }

    //saving that array
    if (this.postArr.length != 0) {
      console.log(this.postArr);
      this.callClosureService.putCallResponse(this.postArr).subscribe(
        response => {
          console.log(response);
          if (response) {
            console.log(response.data.response);
            console.log("saved on call type change");
            //getting questions and answers from the selected call type
            console.log(this.callTypeForm.value);
            this.questionaireForm.reset();
            // if (this.pncFlag) {
            //   this.selectedCallType = this.pncCallType;
            // }
            // else {
            //   this.selectedCallType = this.callTypeForm.value.callType;
            // }

            this.postData = {
              mctsQAMappingDetail: {
                providerServiceMapID: this.providerServiceMapID,
                outboundCallType: this.callTypeForm.value.callType,
                effectiveFrom: this.callTypes[0].effectiveFrom
              },
              mctsOutboundCall: this.benificiaryData,
              callDetailID: this.dataService.callDetailID
            };
            this.getQuestionList(this.postData);
          }
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.questionaireForm.reset();
      //getting questions and answers from the selected call type
      console.log(this.callTypeForm.value);
      if (this.pncFlag) {
        /*Below lne code is commented so as to not change the current call type,
         but only the quentionair is fetched; Diamond Khanna,27Apr,2018*/
        // this.selectedCallType = this.pncCallType;
        /*calling function to get questions */
      } else {
        /*Below lne code is commented so as to not change the current call type,
         but only the quentionair is fetched; Diamond Khanna,27Apr,2018*/
        // this.selectedCallType = this.callTypeForm.value.callType;
        /*calling function to get questions */
      }
      this.postData = {
        mctsQAMappingDetail: {
          providerServiceMapID: this.providerServiceMapID,
          outboundCallType: this.callTypeForm.value.callType,
          effectiveFrom: this.callTypes[0].effectiveFrom
        },
        mctsOutboundCall: this.benificiaryData,
        callDetailID: this.dataService.callDetailID
      };
      this.getQuestionList(this.postData);
    }
  }

  //get the questions and answers for the callType
  getQuestionList(postData) {
    this.questionaireService.getAgentQuestionaire(postData).subscribe(
      response => {
        console.log(response.data);
        // this.questionrows = this.dummyresponse.data.questions;
        this.questionrows = response.data.parentQuestions;
        this.childQuestionRows = response.data.childQuestions;
        console.log(
          "questionrows getQuestionaire putCallResponse2",
          JSON.stringify(this.questionrows, null, 4)
        );

        this.interaction = response.data.interactions;
        this.answers = response.data.answers;
        this.questionaireForm = this.formBuilder.group({
          questions: this.formBuilder.array([])
        });

        // add the child questions which has answer in answer array
        if (this.answers.length > 0) {
          this.addChildQuestions();
        }

        for (var i = 0; i < this.questionrows.length; i++) {
          var answerObjArray = this.answers.filter(obj => {
            return obj.questionID == this.questionrows[i].questionID;
          });
          if (answerObjArray.length > 0) {
            if (
              answerObjArray[0].questionnaireDetail.answerType === "Multiple"
            ) {
              if (answerObjArray[0].answer.includes("||")) {
                answerObjArray[0].answer = answerObjArray[0].answer.split("||");
                console.log("splitarray", answerObjArray[0].answer);
              } else {
                var singleArray = [];
                singleArray.push(answerObjArray[0].answer);
                answerObjArray[0].answer = singleArray;
              }
            }
            // Wed Oct 07 2020 16:29:00 GMT+0530
            if (answerObjArray[0].questionnaireDetail.answerType === "Time") {
              answerObjArray[0].answer =
                "Wed Oct 07 2020 " + answerObjArray[0].answer + " GMT+0530";
            }
          }
          // if(answerObjArray.length > 0){
          //   if(answerObjArray[0].answer.includes("||") ){
          //     this.splitAnswer = answerObjArray[0].answer.split("||")
          //     answerObjArray[0].answer = this.splitAnswer.slice()
          //     console.log("splitarray",answerObjArray[0].answer);

          //   }
          //   // Wed Oct 07 2020 16:29:00 GMT+0530
          //   if(answerObjArray[0].questionnaireDetail.answerType === "Time"){
          //     answerObjArray[0].answer = "Wed Oct 07 2020 "+answerObjArray[0].answer+" GMT+0530"
          //   }

          // }
          console.log(answerObjArray, "answerObjArray");
          (<FormArray>this.questionaireForm.get("questions")).push(
            this.createItem(this.questionrows[i], answerObjArray)
          );
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  createItem(obj, answerObjArray): FormGroup {
    let answerObj;
    if (answerObjArray.length === 0) {
      if (obj.questionnaireDetail.answerType === "Multiple") {
        answerObj = [[]];
      } else {
        answerObj = "";
      }
    } else {
      if (obj.questionnaireDetail.answerType === "Multiple") {
        answerObj = [answerObjArray[0].answer];
      } else {
        answerObj = answerObjArray[0].answer;
      }
    }

    console.log("ansMult", answerObj);

    return this.formBuilder.group({
      questionID: obj.questionnaireDetail.questionID,
      question: obj.questionnaireDetail.question,
      answerType: obj.questionnaireDetail.answerType,
      showTextFor: obj.questionnaireDetail.showTextFor,
      showText: obj.questionnaireDetail.showText,
      answer: answerObj,
      // answerObjArray.length == 0
      //   ? ""
      //   : obj.questionnaireDetail.answerType === "Multiple"
      //   ? [answerObjArray[0].answer]
      //   : answerObjArray[0].answer,
      feedback: answerObjArray.length == 0 ? "" : answerObjArray[0].remarks,
      variableName: obj.variableName,
      variableDataType: obj.variableDataType,
      isMandatory: obj.questionnaireDetail.isMandatory,
      outboundCallType: obj.outboundCallType,
      mctsQuestionValues:
        obj.questionnaireDetail.mctsQuestionValues.length == 0
          ? null
          : obj.questionnaireDetail.mctsQuestionValues.length
    });
  }
  viewClosure() {
    var obj = {
      transferCallFlag: this.transferCallFlag,
      transferCallToANMFlag: this.transferCallToANMFlag,
      transferCallTo104Flag: this.transferCallTo104Flag,
      transferCallTo108Flag: this.transferCallTo108Flag,
      callAnsweredFlag: this.callAnsweredFlag,
      skill: this.TransferSkill
    };
    console.log("Object in view Closure", JSON.stringify(obj, null, 4));

    this.viewClosureWindow.emit(obj);
  }

  onSave() {
    console.log("Before save this.transferCallFlag", this.transferCallFlag);
    console.log(
      "Before save this.transferCallTo104Flag",
      this.transferCallTo104Flag
    );
    this.transferCallFlag = false;
    this.transferCallToANMFlag = false;
    this.transferCallTo104Flag = false;
    this.transferCallTo108Flag = false;
    console.log("After save this.transferCallFlag", this.transferCallFlag);
    console.log(
      "After save this.transferCallTo104Flag",
      this.transferCallTo104Flag
    );
    this.onSubmit();
  }
  onSubmit() {
    // this.transferCallFlag = false;

    //updating beneficiary high risk properties
    if (this.benificiaryData.mctsDataReaderDetail != undefined) {
      this.benificiaryData.mctsDataReaderDetail["High_Risk"] = this.high_risk;
      // this.benificiaryData.mctsDataReaderDetail["High_Risk_Reason"] = (this
      //   .high_risk !== undefined && this
      //   .high_risk !== null)
      //   ? this.reason_for_high_risk.trim()
      //   : undefined;
      this.benificiaryData.mctsDataReaderDetail["High_Risk_Reason"] = (this
        .high_risk !== undefined && this
        .high_risk !== null && this.reason_for_high_risk !== undefined && this.reason_for_high_risk !== null)
        ? this.reason_for_high_risk.trim()
        : undefined;
    }

    this.mandatoryArray = [];
    this.requiredArr = [];
    this.mandatoryQuesValue = 0;
    console.log("this.questionaireForm.value", this.questionaireForm.value);
    for (var i = 0; i < this.questionaireForm.value.questions.length; i++) {
      var tempObj = {};
      if (this.motherID != undefined) {
        tempObj["motherID"] = this.motherID;
      }
      if (this.childID != undefined) {
        tempObj["childID"] = this.childID;
      }
      tempObj["questionID"] = this.questionaireForm.value.questions[
        i
      ].questionID;
      if (this.questionaireForm.value.questions[i].answerType == "Multiple") {
        console.log(this.questionaireForm.value.questions[i].answer);

        var answer = "";
        if (this.questionaireForm.value.questions[i].answer != null) {
          for (
            let j = 0;
            j < this.questionaireForm.value.questions[i].answer.length;
            j++
          ) {
            if (j > 0) {
              answer += "||";
            }
            answer += this.questionaireForm.value.questions[i].answer[j];
          }
          tempObj["answer"] = answer;
        } else {
          tempObj["answer"] = "";
        }
      } else if (
        this.questionaireForm.value.questions[i].answerType === "Date"
      ) {
        if (this.questionaireForm.value.questions[i].answer !== "") {
          tempObj["answer"] = this.datepipe.transform(
            this.questionaireForm.value.questions[i].answer,
            "yyyy-MM-dd"
          );
        } else {
          tempObj["answer"] = "";
        }
      } else if (
        this.questionaireForm.value.questions[i].answerType === "Time"
      ) {
        if (this.questionaireForm.value.questions[i].answer !== "") {
          tempObj["answer"] = this.datepipe.transform(
            this.questionaireForm.value.questions[i].answer,
            "HH:mm:ss"
          );
        } else {
          tempObj["answer"] = "";
        }
      } else if (
        this.questionaireForm.value.questions[i].answerType === "Date & Time"
      ) {
        if (this.questionaireForm.value.questions[i].answer !== "") {
          tempObj["answer"] = this.datepipe.transform(
            this.questionaireForm.value.questions[i].answer,
            "yyyy-MM-dd HH:mm:ss"
          );
        } else {
          tempObj["answer"] = "";
        }
      } else {
        tempObj["answer"] = this.questionaireForm.value.questions[i].answer;
      }

      if (this.questionaireForm.value.questions[i].answer != "" && (this.questionaireForm.value.questions[i].answerType == "Yes/No"
      || this.questionaireForm.value.questions[i].answerType == "DropDown")) {
        tempObj["remarks"] =
          this.questionaireForm.value.questions[i].showText &&
          this.questionaireForm.value.questions[i].showTextFor.toLowerCase() ===
            this.questionaireForm.value.questions[i].answer.toLowerCase()
            ? this.questionaireForm.value.questions[i].feedback
            : "";
      } else {
        tempObj["remarks"] = "";
      }

      tempObj["createdBy"] = this.createdBy;
      tempObj["callDetailID"] = this.dataService.callDetailID;
      tempObj["outboundCallType"] = this.questionaireForm.value.questions[
        i
      ].outboundCallType;
      // upadting beneficiary data based on Q&A
      if (
        this.questionaireForm.value.questions[i].variableName != "" &&
        tempObj["remarks"] != "" &&
        this.questionaireForm.value.questions[i].answerType != "Text"
      ) {
        if (this.benificiaryData.mctsDataReaderDetail != undefined) {
          this.benificiaryData.mctsDataReaderDetail[
            this.questionaireForm.value.questions[i].variableName
          ] = tempObj["remarks"];
          // tempObj['remarks'] = '';
        }
        if (this.benificiaryData.childValidDataHandler != undefined) {
          this.benificiaryData.childValidDataHandler[
            this.questionaireForm.value.questions[i].variableName
          ] = tempObj["remarks"];
          // tempObj['remarks'] = '';
        }
      }
      if (this.questionaireForm.value.questions[i].isMandatory === true) {
        if (tempObj["answer"] != "") {
          this.mandatoryArray.push(tempObj);
        }
        this.mandatoryQuesValue += 1;
      }
      if (tempObj["answer"] != "") {
        this.requiredArr.push(tempObj);
      }
    }
    console.log("manArray", this.mandatoryArray.length);
    console.log("mandValue", this.mandatoryQuesValue);
    console.log(JSON.stringify(this.requiredArr));
    if (this.requiredArr.length > 0) {
      this.callAnsweredFlag = true;
    } else {
      this.callAnsweredFlag = false;
    }

    if (this.transferCallFlag === true) {
      this.callAnsweredFlag = true;
    }
    if (this.transferCallToANMFlag === true) {
      this.callAnsweredFlag = true;
    }
    if (this.transferCallTo104Flag === true) {
      this.callAnsweredFlag = true;
    }
    if (this.transferCallTo108Flag === true) {
      this.callAnsweredFlag = true;
    }

    if (this.requiredArr.length > 0) {
      if (this.mandatoryArray.length == this.mandatoryQuesValue) {
        this.callClosureService.putCallResponse(this.requiredArr).subscribe(
          response => {
            console.log(response);
            if (response) {
              this.questionaireForm.reset();
              this.alertService
                .alertConfirm(response.data.response, "success")
                .subscribe(() => {
                  this.viewClosure();
                  // this.refreshscreen();
                });
            }
          },
          error => {
            console.log(error);
          }
        );
      } else {
        this.mandatoryQuesValue = 0;
        this.alertService.alertConfirm(
          this.currentLanguageSet.pleaseFillAllTheMandatoryQuestions,
          "error"
        );
      }
    } else if (this.questionaireForm.value.questions.length == 0) {
      this.alertService.alertConfirm(
        this.currentLanguageSet.noQuestionsAvailableToSave,
        "error"
      );
    } else {
      this.alertService.alertConfirm(this.currentLanguageSet.noAnswersSelectedToSave, "error");
    }
  }

  //only to call when we transfer the call because while transfer the call we will not check the mandatory questions.
  onSubmitTransfer() {
    // this.transferCallFlag = false;

    //updating beneficiary high risk properties
    if (this.benificiaryData.mctsDataReaderDetail != undefined) {
      this.benificiaryData.mctsDataReaderDetail["High_Risk"] = this.high_risk;
      // this.benificiaryData.mctsDataReaderDetail["High_Risk_Reason"] = (this
      //   .high_risk !== undefined && this
      //   .high_risk !== null)
      //   ? this.reason_for_high_risk.trim()
      //   : undefined;
      this.benificiaryData.mctsDataReaderDetail["High_Risk_Reason"] = (this
        .high_risk !== undefined && this
        .high_risk !== null && this.reason_for_high_risk !== undefined && this.reason_for_high_risk !== null)
        ? this.reason_for_high_risk.trim()
        : undefined;
    }

    this.mandatoryArray = [];
    this.requiredArr = [];
    console.log("this.questionaireForm.value", this.questionaireForm.value);
    for (var i = 0; i < this.questionaireForm.value.questions.length; i++) {
      var tempObj = {};
      if (this.motherID != undefined) {
        tempObj["motherID"] = this.motherID;
      }
      if (this.childID != undefined) {
        tempObj["childID"] = this.childID;
      }
      tempObj["questionID"] = this.questionaireForm.value.questions[
        i
      ].questionID;
      if (this.questionaireForm.value.questions[i].answerType == "Multiple") {
        console.log(this.questionaireForm.value.questions[i].answer);

        var answer = "";
        if (this.questionaireForm.value.questions[i].answer != null) {
          for (
            let j = 0;
            j < this.questionaireForm.value.questions[i].answer.length;
            j++
          ) {
            if (j > 0) {
              answer += "||";
            }
            answer += this.questionaireForm.value.questions[i].answer[j];
          }
          tempObj["answer"] = answer;
        } else {
          tempObj["answer"] = "";
        }
      } else if (
        this.questionaireForm.value.questions[i].answerType === "Date"
      ) {
        if (this.questionaireForm.value.questions[i].answer !== "") {
          tempObj["answer"] = this.datepipe.transform(
            this.questionaireForm.value.questions[i].answer,
            "yyyy-MM-dd"
          );
        } else {
          tempObj["answer"] = "";
        }
      } else if (
        this.questionaireForm.value.questions[i].answerType === "Time"
      ) {
        if (this.questionaireForm.value.questions[i].answer !== "") {
          tempObj["answer"] = this.datepipe.transform(
            this.questionaireForm.value.questions[i].answer,
            "HH:mm:ss"
          );
        } else {
          tempObj["answer"] = "";
        }
      } else if (
        this.questionaireForm.value.questions[i].answerType === "Date & Time"
      ) {
        if (this.questionaireForm.value.questions[i].answer !== "") {
          tempObj["answer"] = this.datepipe.transform(
            this.questionaireForm.value.questions[i].answer,
            "yyyy-MM-dd HH:mm:ss"
          );
        } else {
          tempObj["answer"] = "";
        }
      } else {
        tempObj["answer"] = this.questionaireForm.value.questions[i].answer;
      }

      if (this.questionaireForm.value.questions[i].answer != "" && (this.questionaireForm.value.questions[i].answerType == "Yes/No"
      || this.questionaireForm.value.questions[i].answerType == "DropDown")) {
        tempObj["remarks"] =
          this.questionaireForm.value.questions[i].showText &&
          this.questionaireForm.value.questions[i].showTextFor.toLowerCase() ===
            this.questionaireForm.value.questions[i].answer.toLowerCase()
            ? this.questionaireForm.value.questions[i].feedback
            : "";
      } else {
        tempObj["remarks"] = "";
      }

      tempObj["createdBy"] = this.createdBy;
      tempObj["callDetailID"] = this.dataService.callDetailID;
      tempObj["outboundCallType"] = this.questionaireForm.value.questions[
        i
      ].outboundCallType;
      // upadting beneficiary data based on Q&A
      if (
        this.questionaireForm.value.questions[i].variableName != "" &&
        tempObj["remarks"] != "" &&
        this.questionaireForm.value.questions[i].answerType != "Text"
      ) {
        if (this.benificiaryData.mctsDataReaderDetail != undefined) {
          this.benificiaryData.mctsDataReaderDetail[
            this.questionaireForm.value.questions[i].variableName
          ] = tempObj["remarks"];
          // tempObj['remarks'] = '';
        }
        if (this.benificiaryData.childValidDataHandler != undefined) {
          this.benificiaryData.childValidDataHandler[
            this.questionaireForm.value.questions[i].variableName
          ] = tempObj["remarks"];
          // tempObj['remarks'] = '';
        }
      }
      // if (this.questionaireForm.value.questions[i].isMandatory === true) {
      //   if (tempObj["answer"] != "" ) {
      //     this.mandatoryArray.push(tempObj);
      //   }
      // }
      if (tempObj["answer"] != "") {
        this.requiredArr.push(tempObj);
      }
    }

    console.log(JSON.stringify(this.requiredArr));
    if (this.requiredArr.length > 0) {
      this.callAnsweredFlag = true;
    } else {
      this.callAnsweredFlag = false;
    }

    if (this.transferCallFlag === true) {
      this.callAnsweredFlag = true;
    }
    if (this.transferCallToANMFlag === true) {
      this.callAnsweredFlag = true;
    }
    if (this.transferCallTo104Flag === true) {
      this.callAnsweredFlag = true;
    }
    if (this.transferCallTo108Flag === true) {
      this.callAnsweredFlag = true;
    }

    if (this.requiredArr.length > 0) {
      this.callClosureService.putCallResponse(this.requiredArr).subscribe(
        response => {
          console.log(response);
          if (response) {
            this.questionaireForm.reset();
            this.alertService
              .alertConfirm(response.data.response, "success")
              .subscribe(() => {
                this.viewClosure();
                // this.refreshscreen();
              });
          }
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.viewClosure();
    }
  }

  campaign_id: any;
  campaignName: any;
  TransferSkill: any;
  selectedRole: any;
  skillVisible: Boolean = false;
  transferCall() {
    this.TransferSkill = null;
    this.transferableCampaigns.forEach(element => {
      if (element.campaign_id == this.campaign_id) {
        this.campaignName = element.campaign_name;
      }
    });

    console.log("transfer call start", this.campaign_id);
    this.campaignName.toLowerCase().indexOf("anm") != -1
      ? (this.transferCallToANMFlag = true)
      : (this.transferCallToANMFlag = false);
    this.campaignName.toLowerCase().indexOf("mo") != -1
      ? (this.transferCallFlag = true)
      : (this.transferCallFlag = false);
    this.campaignName.toLowerCase().indexOf("ro") != -1
      ? (this.transferCallTo104Flag = true)
      : (this.transferCallTo104Flag = false);
    // this.transferCallFlag = true;
    // this.transferCallTo104Flag = false;
    this.transferCallTo108Flag = false;
    // this.transferCallToANMFlag = false;

    // this.transferCallToCampaign();
    console.log("Role", this.role);
    this.selectedRole = this.campaignName.substring(5);
    if (this.selectedRole == this.role) {
      this.skillVisible = true;
      this.getTransferSkills(this.campaignName);
    } else {
      this.skillVisible = false;
      this.onSubmitTransfer();
    }
  }

  // transferCallToANM() {
  //   console.log("transfer call start");
  //   this.transferCallToANMFlag = true;
  //   this.transferCallFlag = false;
  //   this.transferCallTo104Flag = false;
  //   this.transferCallTo108Flag = false;
  //   this.onSubmit();
  // }

  // transferCallTo104() {
  //   console.log("transfer call start");
  //   this.transferCallTo104Flag = true;
  //   this.transferCallTo108Flag = false;
  //   this.transferCallFlag = false;
  //   this.transferCallToANMFlag = false;
  //   this.onSubmit();
  //   // this.transferCallToCampaign();
  // }

  transferCallTo108() {
    console.log("transfer call start");
    this.transferCallTo108Flag = true;
    this.transferCallTo104Flag = false;
    this.transferCallFlag = false;
    this.transferCallToANMFlag = false;
    this.onSubmit();
    // this.transferCallToCampaign();
  }

  conferenceCallWithANM() {
    console.log("conference call started with ANM....");
    this.addANMInConference();
  }

  conferenceCallWithASHA() {
    console.log("conference call start with ASHA....");
    this.addAshaInConference();
  }
  navigateToPrev() {
    this.showHistory.emit(this.benificiaryData);
  }

  openEditBenDialog() {
    this.benificiaryData.callDetailID = this.dataService.callDetailID;
    let editBenDialog = this.dialog.open(EditBeneficiaryComponent, {
      disableClose: true,
      width: 0.8 * window.innerWidth + "px",
      panelClass: "dialog-width",
      data: {
        benObj: this.benificiaryData
      }
    });
    editBenDialog.afterClosed().subscribe(response => {
      console.log("After closing", response);
      // refreshing the 4 agent innerpage components with updated ben obj atfter edit. (26 Apr,2018, Diamond Khanna)
      if (response.motherID != undefined || response.childID != undefined) {
        this.updateBeneficiaryData_inOutboundCallHistory(response);
      }
    });
  }

  refreshscreen() {
    // refreshing the check box and its answer field
    this.high_risk = undefined;
    this.reason_for_high_risk = "";
    // ^author:diamond,27apr,2018
    this.questionaireForm = this.formBuilder.group({
      questions: this.formBuilder.array([])
    });

    this.benificiaryData = undefined;
    this.dataService.bendata_for_MO = undefined;
    this.dataService.benObj = undefined;
    this.campaign_id = null;
    // this.questionaireService.getQuestionaire(this.postData)
    //   .subscribe((response) => {
    //     console.log(response.data);
    //     this.questionrows = response.data.questions;
    //     console.log("questionrows getQuestionaire", JSON.stringify(this.questionrows, null, 4));
    //     this.answers = response.data.answers;

    //     for (var i = 0; i < this.questionrows.length; i++) {
    //       var answerObjArray = this.answers.filter((obj) => {
    //         return obj.questionID == this.questionrows[i].questionID;
    //       });
    //       (<FormArray>this.questionaireForm.get('questions')).push(this.createItem(this.questionrows[i], answerObjArray));
    //     }
    //   },
    //   (error) => {
    //     console.log(error);
    //   });

    this.pncFlag = false;
  }

  addANMInConference() {
    if (this.benificiaryData.mctsDataReaderDetail.ANM_Ph != undefined) {
      this.czentrixService
        .addtoConferenceCall(
          this.czentrixService.agent_id,
          this.czentrixService.ip,
          this.benificiaryData.mctsDataReaderDetail.ANM_Ph
        )
        .subscribe(
          response => {
            console.log(
              "add to conference response: " + JSON.stringify(response)
            );
          },
          err => {
            console.log("Error in add to conference", err);
          }
        );
    } else {
      this.alertService.alert(this.currentLanguageSet.anmPhoneNumbernotAvailable, "info");
    }
  }

  addAshaInConference() {
    if (this.benificiaryData.mctsDataReaderDetail.ASHA_Ph != undefined) {
      this.czentrixService
        .addtoConferenceCall(
          this.czentrixService.agent_id,
          this.czentrixService.ip,
          this.benificiaryData.mctsDataReaderDetail.ASHA_Ph
        )
        .subscribe(
          response => {
            console.log(
              "add to conference response: " + JSON.stringify(response)
            );
          },
          err => {
            console.log("Error in add to conference", err);
          }
        );
    } else {
      this.alertService.alert(this.currentLanguageSet.ashaPhoneNumberNotAvailable, "info");
    }
  }

  generateBenID(benData) {
    let generateID = this.dialog.open(GenerateBenificiaryIDComponent, {
      disableClose: true,
      width: 0.8 * window.innerWidth + "px",
      panelClass: "dialog-width",
      data: {
        benObj: benData
      }
    });

    generateID.afterClosed().subscribe(response => {
      console.log(response);
      if (response.status.toLowerCase() === "success".toLowerCase()) {
        if (response.data.childValidDataHandler != undefined) {
          // this.alertService.alert('Beneficiary registered successfully. Registration ID is ' + response.data.childValidDataHandler.beneficiaryID, 'success');
          let dialogReff = this.dialog.open(CommonSmsDialogComponent, {
            disableClose: true,
            width: "420px",
            data: {
              statement: this.currentLanguageSet.beneficiaryRegisteredWithId,
              generatedID: response.data.childValidDataHandler.beneficiaryID
            }
          });

          dialogReff.afterClosed().subscribe(result => {
            let mobile_number;
            mobile_number = result;

            if (
              mobile_number != "close" &&
              (mobile_number === undefined || mobile_number === "")
            ) {
              // mobile no is undefined
              console.log("Registered number will be used"); // Registered number will be used
              // ** code to send SMS **
              this.send_sms(
                response.data.childValidDataHandler.BeneficiaryRegID
              );
            } else if (
              mobile_number != "close" &&
              mobile_number != undefined &&
              mobile_number != ""
            ) {
              // ** code to send SMS **
              this.send_sms(
                response.data.childValidDataHandler.BeneficiaryRegID,
                mobile_number
              );
            }
          });
        }
        else if (response.data.mctsDataReaderDetail != undefined) {
          // this.alertService.alert('Beneficiary registered successfully. Registration ID is ' + response.data.mctsDataReaderDetail.beneficiaryID, 'success');
          let dialogReff = this.dialog.open(CommonSmsDialogComponent, {
            disableClose: true,
            width: "420px",
            data: {
              statement: this.currentLanguageSet.beneficiaryRegisteredWithId,
              generatedID: response.data.mctsDataReaderDetail.beneficiaryID
            }
          });

          dialogReff.afterClosed().subscribe(result => {
            let mobile_number;
            mobile_number = result;

            if (
              mobile_number != "close" &&
              (mobile_number === undefined || mobile_number === "")
            ) {
              // mobile no is undefined
              console.log("Registered number will be used"); // Registered number will be used
              // ** code to send SMS **
              this.send_sms(
                response.data.mctsDataReaderDetail.BeneficiaryRegID
              );
            } else if (
              mobile_number != "close" &&
              mobile_number != undefined &&
              mobile_number != ""
            ) {
              // ** code to send SMS **
              this.send_sms(
                response.data.mctsDataReaderDetail.BeneficiaryRegID,
                mobile_number
              );
            }
          });
        }
        /*
             update the object of beneficiary after successful creation of BEN-ID in
             modal(this prevents invocation of dialog again on ngOnChange trigger as
             now the object will have benID)
          */
        console.log("BEFORE*******", this.benificiaryData);
        this.benificiaryData = response.data;

        console.log("AFTER*******", this.benificiaryData);
        this.dataService.benObj = this.benificiaryData;
      } else if (response.status.toLowerCase() === "closure".toLowerCase()) {
        this.moveToClosurePage();
      }
    });

    // to detect changes after lifecycle hooks; after view load
    this.cdr.detectChanges();
  }

  moveToClosurePage() {
    console.log(
      "this.benificiaryData",
      this.benificiaryData,
      this.dataService.benObj
    );

    this.dataService.benObj = this.benificiaryData;
    var obj = {
      transferCallFlag: false,
      transferCallToANMFlag: false,
      transferCallTo104Flag: false,
      transferCallTo108Flag: false,
      callAnsweredFlag: false
    };
    // added to reset the closure page during next call.
    if (
      this.requiredArr.length > 0 ||
      this.transferCallFlag === true ||
      this.transferCallTo104Flag === true ||
      this.transferCallToANMFlag === true
    ) {
      obj["transferCallFlag"] = this.transferCallFlag;
      obj["transferCallToANMFlag"] = this.transferCallToANMFlag;
      obj["transferCallTo104Flag"] = this.transferCallTo104Flag;
      obj["transferCallTo108Flag"] = this.transferCallTo108Flag;
      obj["callAnsweredFlag"] = true;
    }

    this.viewClosureWindow.emit(obj);
  }

  updateBeneficiaryData_inOutboundCallHistory(bendata) {
    this.updated_ben_data.emit(bendata);
  }

  viewChangeLogDeatils() {
    let obj = {};
    if (this.benificiaryData != undefined) {
      if (this.benificiaryData.childValidDataHandler != undefined) {
        obj["childID"] = this.benificiaryData.childID;
      } else if (this.benificiaryData.mctsDataReaderDetail != undefined) {
        obj["motherID"] = this.benificiaryData.motherID;
      }
    }
    let changeLogDialog = this.dialog.open(ChangeLogComponent, {
      width: 0.8 * window.innerWidth + "px",
      panelClass: "dialog-width",
      disableClose: true,
      // height:"500px",
      data: {
        request_obj: obj
      }
    });
  }

  send_sms(generated_ben_id, alternate_Phone_No?) {
    let sms_template_id = "";
    let smsTypeID = "";
    // below line has hardcoded content in else section; needs to be removed
    let currentServiceID = this.dataService.current_serviceID;

    this.sms_service.getSMStypes(currentServiceID).subscribe(
      response => {
        if (response != undefined) {
          if (response.length > 0) {
            for (let i = 0; i < response.length; i++) {
              if (
                response[i].smsType.toLowerCase() ===
                "Registration SMS".toLowerCase()
              ) {
                smsTypeID = response[i].smsTypeID;
                break;
              }
            }
          }
        }

        if (smsTypeID != "") {
          this.sms_service
            .getSMStemplates(
              this.dataService.currentService.serviceID,
              smsTypeID
            )
            .subscribe(
              res => {
                if (res != undefined) {
                  if (res.length > 0) {
                    for (let j = 0; j < res.length; j++) {
                      if (res[j].deleted === false) {
                        sms_template_id = res[j].smsTemplateID;
                        break;
                      }
                    }
                  }

                  if (smsTypeID != "") {
                    let reqObj = {
                      alternateNo: alternate_Phone_No,
                      beneficiaryRegID: generated_ben_id,
                      createdBy: this.dataService.uname,
                      is1097: false,
                      providerServiceMapID: this.dataService.currentService
                        .serviceID,
                      smsTemplateID: sms_template_id,
                      smsTemplateTypeID: smsTypeID
                    };

                    let arr = [];
                    arr.push(reqObj);

                    this.sms_service.sendSMS(arr).subscribe(
                      ressponse => {
                        console.log(ressponse, "SMS Sent");
                        alert(this.currentLanguageSet.smsSent);
                      },
                      err => {
                        console.log(err, "SMS not sent Error");
                        alert(this.currentLanguageSet.smsNotSent);
                      }
                    );
                  }
                }
              },
              err => {
                console.log(err, "Error in fetching sms templates");
              }
            );
        }
      },
      err => {
        console.log(err, "error while fetching sms types");
      }
    );
  }
  getTransferableCampaigns() {
    this.czentrixService
      .getTransferableCampaigns(
        this.czentrixService.agent_id,
        this.czentrixService.ip
      )
      .subscribe(
        response => {
          this.transferableCampaigns = response.data.campaign;
          console.log(
            "transferableCampaigns: " +
              JSON.stringify(this.transferableCampaigns, null, 4)
          );
        },
        err => {
          console.log("Error in getTransferableCampaigns", err);
        }
      );
  }

  getTransferSkills(campaignName) {
    this.czentrixService.getCampaignSkills(campaignName).subscribe(
      response => {
        if (response != undefined) {
          this.transferSkills = [];
          this.transferSkill = "";
          this.transferSkills = response.data.response.skills;
          console.log("Transfer skills:", this.transferSkills);
        }
      },
      err => {
        console.log("error", err.errorMessage);
        // this.message.alert(err.errorMessage, 'error');
        this.transferSkills = [];
      }
    );
  }
  CheckFormat(dateFormat) {
    // this.ChangedDate = this.datepipe.transform(dateFormat, 'yyyy-MM-dd')
    console.log(dateFormat);
    this.selectedDate = new Date();
    console.log(this.selectedDate);
  }

  dateTimePatch(dateTimeFormat) {
    this.selectedDate = new Date(dateTimeFormat);
    this.dateTime = this.datepipe.transform(
      this.selectedDate,
      "yyyy-MM-dd HH:mm:ss"
    );
    console.log(dateTimeFormat);
    console.log(this.selectedDate);
  }

  updateValue = 0;
  changeUpdateBtnFlag(data) {
    console.log("update", data);

    if (data != "" || data.length > 0) {
      this.updateValue++;
    } else {
      if (this.updateValue > 0) {
        this.updateValue--;
      }
    }
    console.log("updatevalue", this.updateValue);
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
