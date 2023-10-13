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
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { OCWService } from '../services/mcts-agent/outbond-call-worklist/outbond-call-worklist.service';
import { CallClosureService } from '../services/mcts-agent/call-closure/call-closure.service';
import { CzentrixServices } from '../services/czentrixService/czentrix.service';
import { CallQComponent } from '../call-q/call-q.component';
import { CongenitalHistoryComponent } from '../congenital-history/congenital-history.component';
import { MdDialog } from '@angular/material';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { ViewComplaintsComponent } from '../view-complaints/view-complaints.component';
import { MedicalHistoryDialogComponent } from '../medical-history-dialog/medical-history-dialog.component';
import { MmuHistoryComponent } from '../mmu-history/mmu-history.component';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-outbound-call-history',
  templateUrl: './outbound-call-history.component.html',
  styleUrls: ['./outbound-call-history.component.css']
  //providers:[OCWService]
})

export class OutbondCallHistoryComponent implements OnInit {

  @Output() showNext: EventEmitter<any> = new EventEmitter<any>();
  @Output() showPrev: EventEmitter<any> = new EventEmitter<any>();
  @Input() historyDetails: any;
  @Input() blockBack = false;
  callHistory = [];
  disableBack = false;
  postData: any;
  nextCallDatePostData: any;
  nextCallDate: any;
  pncFlag: boolean;
  phoneNo: any;
  userID: any;
  providerServiceMapID: any;
  createdBy: any;
  isDialPreferenceManual: boolean;
  newCall: Subscription;
  timeRemaining: any;
  sec: any;
  previewWindowTime: any;
  beneficiaryRegID: any;
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
  

  constructor(private _OCWService: OCWService,private httpServiceService: HttpServices, private callClosureService: CallClosureService, public dialog: MdDialog, private commonData: dataService, private czentrixService: CzentrixServices, private alertService: ConfirmationDialogsService) {
  }



  ngOnInit() {
    console.log('in Outbound Call History, beneficiary details on init', this.historyDetails);
    if (this.historyDetails != undefined && this.historyDetails.childValidDataHandler != undefined) {
      this.beneficiaryRegID = this.historyDetails.childValidDataHandler.BeneficiaryRegID;
      this.fetchLanguageResponse();
    } else if (this.historyDetails != undefined && this.historyDetails.mctsDataReaderDetail != undefined) {
      this.beneficiaryRegID = this.historyDetails.mctsDataReaderDetail.BeneficiaryRegID;
    }
    this.providerServiceMapID = this.commonData.currentService.serviceID;
    this.createdBy = this.commonData.uname;
    this.userID = this.commonData.uid;

    let reqObjForDialPreference = {
      "providerServiceMapID": this.providerServiceMapID
    }
    this.getDialPreference(reqObjForDialPreference);
  }
  getDialPreference(reqObjForDialPreference) {
    this._OCWService.getDialPreference(reqObjForDialPreference).subscribe((response) => {
      this.isDialPreferenceManual = response.data.isDialPreferenceManual;
      if (response.data.isDialPreferenceManual == false) {
        this.previewWindowTime = response.data.previewWindowTime
      }
    },
      (err) => {
        this.alertService.alert(err.errorMessage, 'error');
      });

  }
  count = 0;
  ngOnChanges() {
    this.count = this.count + 1;
    console.log('in Outbound Call History, beneficiary details on change', this.count, this.historyDetails);
    console.log('this.commonData.benObj: ', this.count, this.commonData.benObj);
    if (this.historyDetails != undefined) {
      this.beneficiaryRegID = this.historyDetails.beneficiaryRegID;
      this.timeRemaining = this.previewWindowTime;
      if (this.isDialPreferenceManual == false && this.historyDetails.autodial == true) {
        const timer = Observable.timer(1000, 1000);
        this.newCall = timer.subscribe(sec => {
          this.sec = (this.timeRemaining - sec)
          if (sec == this.timeRemaining) {
            this.navigateToNext(this.historyDetails);
          }
        });
      }
      if (this.historyDetails.childID == undefined && this.historyDetails.outboundCallType != undefined && this.historyDetails.outboundCallType.indexOf("ANC") === 0) {
        this.postData = {
          "motherID": this.historyDetails.motherID
        }
        this.nextCallDatePostData = {
          "motherID": this.historyDetails.motherID,
          "outboundCallType": this.historyDetails.outboundCallType
        }
        this.pncFlag = false;
      }
      else {
        console.log("this.historyDetails.outboundCallType", this.historyDetails.outboundCallType.indexOf("PNC") === 0);

        if (this.historyDetails != undefined && this.historyDetails.outboundCallType != undefined && this.historyDetails.outboundCallType.indexOf("PNC") === 0 && this.historyDetails.childID) {
          this.postData = {
            "childID": this.historyDetails.childID
          }
          this.nextCallDatePostData = {
            "childID": this.historyDetails.childID,
            "outboundCallType": this.historyDetails.outboundCallType
          }
          this.pncFlag = true;
        } else {
          console.log("this.historyDetails.outboundCallType", this.historyDetails.outboundCallType.indexOf("PNC") === 0);
          this.postData = {
            "motherID": this.historyDetails.motherID
          }
          this.nextCallDatePostData = {
            "motherID": this.historyDetails.motherID,
            "outboundCallType": this.historyDetails.outboundCallType
          }
          this.pncFlag = true;
        }

      }
      console.log(JSON.stringify(this.postData));
      this.callClosureService.getNextCall(this.nextCallDatePostData)
        .subscribe((response) => {
          console.log(response.data.response, "next call date");
          this.nextCallDate = response.data.response;
        },
          (error) => {
            console.log(error);
          });
      this.callClosureService.getCallHistory(this.postData)
        .subscribe((response) => {
          console.log(response, 'CALL HISTORY FETCHED ON CHANGE');
          this.callHistory = response.data;
          console.log("this.callHistory", this.callHistory);

        },
          (error) => {
            console.log(error);
          })
    }
    if (this.blockBack) {
      this.disableBack = true;
    }
    else {
      this.disableBack = false;
    }
  }

  openDialog(callDetailID) {
    console.log(callDetailID, "get call Response");
    this.callClosureService.getCallResponse({
      "callDetailID": callDetailID
    })
      .subscribe((response) => {
        console.log(response);
        if (response) {
          let callQADialog = this.dialog.open(CallQComponent, {
            width: 0.8 * window.innerWidth + "px",
            panelClass: 'dialog-width',
            // height:"500px",
            data: {
              "qarows": response.data
            }
          })
        }
      },
        (error) => {
          console.log(error);
        })
  }

  viewCongenitalHistory() {
    console.log(this.historyDetails.childID);
    if (this.historyDetails.childID != undefined) {
      this.callClosureService.getCongenitalHistory({
        "childID": this.historyDetails.childID
      })
        .subscribe((response) => {
          console.log(response);
          if (response) {
            let congenitalDialog = this.dialog.open(CongenitalHistoryComponent, {
              width: 0.8 * window.innerWidth + "px",
              panelClass: 'dialog-width',
              disableClose: true,
              // height:"500px",
              data: {
                "carows": response.data
              }
            })
          }
        },
          (error) => {
            console.log(error);
          })
    } else {
      this.callClosureService.getCongenitalHistory({
        "motherID": this.historyDetails.motherID
      })
        .subscribe((response) => {
          console.log(response);
          if (response) {
            let congenitalDialog = this.dialog.open(CongenitalHistoryComponent, {
              width: 0.8 * window.innerWidth + "px",
              panelClass: 'dialog-width',
              disableClose: true,
              // height:"500px",
              data: {
                "carows": response.data
              }
            })
          }
        },
          (error) => {
            console.log(error);
          })
    }

  }

  viewComplaintsHistory() {
    if (this.historyDetails.childValidDataHandler != undefined) {
      let benRegID = this.historyDetails.childValidDataHandler.BeneficiaryRegID;
      if (benRegID == null || benRegID == undefined) {
        this.alertService.alert(this.currentLanguageSet.beneficiaryIdDoesNotExistKindlyRegisterAndTryAgainLater);
      }
      else {
        this.callClosureService.getComplaints({
          "serviceID": this.providerServiceMapID,
          "beneficiaryRegID": benRegID
        }).subscribe((response) => {
          console.log(response);
          if (response) {
            let complaintsDialog = this.dialog.open(ViewComplaintsComponent, {
              width: 0.8 * window.innerWidth + "px",
              panelClass: 'dialog-width',
              disableClose: true,
              // height:"500px",
              data: {
                "complaintRows": response.data
              }
            })
          }
        },
          (error) => {
            console.log(error);
          });
      }
    } else if (this.historyDetails.mctsDataReaderDetail != undefined) {
      let benRegID = this.historyDetails.mctsDataReaderDetail.BeneficiaryRegID;
      if (benRegID == null || benRegID == undefined) {
        this.alertService.alert(this.currentLanguageSet.beneficiaryIdDoesNotExistKindlyRegisterAndTryAgainLater);
      }
      else {
        this.callClosureService.getComplaints({
          "serviceID": this.providerServiceMapID,
          "beneficiaryRegID": benRegID
        }).subscribe((response) => {
          console.log(response);
          if (response) {
            let complaintsDialog = this.dialog.open(ViewComplaintsComponent, {
              width: 0.8 * window.innerWidth + "px",
              panelClass: 'dialog-width',
              disableClose: true,
              // height:"500px",
              data: {
                "complaintRows": response.data
              }
            })
          }
        },
          (error) => {
            console.log(error);
          });
      }
    }
    else {
      this.alertService.alert(this.currentLanguageSet.beneficiaryIdDoesNotExistKindlyRegisterAndTryAgainLater)
    }


  }

  // viewMMUMedicalHistory() {
  //   if (this.historyDetails.mctsDataReaderDetail != undefined) {
  //     let benRegID = this.historyDetails.mctsDataReaderDetail.BeneficiaryRegID

  //     if (benRegID == null || benRegID == undefined) {
  //       this.alertService.alert("Beneficiary ID does not exist. Kindly register and try again later");
  //     }
  //     else {
  //       this.callClosureService.getMMUMedicalHistory(
  //         { 'beneficiaryRegID': benRegID })
  //         .subscribe(response => {
  //           console.log(response.data, 'ben med history success');
  //           let medical_history_dialog_ref = this.dialog.open(MmuHistoryComponent,
  //             {
  //               width: 0.8 * window.innerWidth + "px",
  //               panelClass: 'dialog-width',
  //               disableClose: true,
  //               // height:"500px",
  //               data: response.data
  //             })
  //         }, err => {
  //           console.log(err, 'ben med history error');
  //         });
  //     }
  //   } else if (this.historyDetails.childValidDataHandler != undefined) {
  //     let benRegID = this.historyDetails.childValidDataHandler.BeneficiaryRegID;

  //     if (benRegID == null || benRegID == undefined) {
  //       this.alertService.alert("Beneficiary ID does not exist. Kindly register and try again later");
  //     }
  //     else {
  //       this.callClosureService.getMMUMedicalHistory(
  //         { 'beneficiaryRegID': benRegID })
  //         .subscribe(response => {
  //           console.log(response.data, 'ben med history success');
  //           let medical_history_dialog_ref = this.dialog.open(MmuHistoryComponent,
  //             {
  //               width: 0.8 * window.innerWidth + "px",
  //               panelClass: 'dialog-width',
  //               disableClose: true,
  //               // height:"500px",
  //               data: response.data
  //             })
  //         }, err => {
  //           console.log(err, 'ben med history error');
  //         });
  //     }
  //   } else {
  //     this.alertService.alert('Beneficiary ID does not exist. Kindly register and try again later')
  //   }
  // }
  
  // just takes to next page
  navigateNext() {
    console.log("navigateNext: ");
    this.showNext.emit();
  }

  // makes a call
  navigateToNext(Beneficiary_data) {
    if (Beneficiary_data != undefined) {
      this.getUpdateObject(Beneficiary_data);
      //    this.commonData.benObj = Beneficiary_data;
    }
    if (this.newCall) {
      this.newCall.unsubscribe();
    }
    if (Beneficiary_data.autodial) {
      delete Beneficiary_data.autodial; //deleting since purpose is fullfiled that was added for autodial (key was added in innerpage)              gursimran 12/6/18
    }
    console.log("navigateToNext: ");
    console.log("Beneficiary_data: ", JSON.stringify(Beneficiary_data, null, 4));
    if (this.czentrixService.agent_id == undefined) {
      this.alertService.alert(this.currentLanguageSet.agentIdNotAvailableForCzentrixDial, 'error')
    }
    else {
      if (this.czentrixService.ip == undefined) {
        this.czentrixService.getIpAddress(this.czentrixService.agent_id)
          .subscribe((response) => {
            console.log(response);
            this.czentrixService.ip = response.data.agent_ip;
            //dial api after agent_ip fetch
            /*
            "IF CONDITION CHANGED on 26April,2018 ; Diamond"
            !this.pncFlag ----changed to-----> Beneficiary_data.mctsDataReaderDetail!=undefined 
            */
            if (Beneficiary_data.childValidDataHandler != undefined) {
              this.phoneNo = Beneficiary_data.childValidDataHandler.Phone_No;
             
            }
            else {
              this.phoneNo = Beneficiary_data.mctsDataReaderDetail.Whom_PhoneNo;
            }
            this.czentrixService.manualDialaNumber(this.czentrixService.agent_id, this.phoneNo)
              .subscribe((response) => {
                console.log(response);
                localStorage.setItem('onCall', 'true');
                this.commonData.onCall.next({
                  "isonCall": true
                });
                // this.alertService.alert(response.data.status, 'success')
                console.log("Beneficiary_data: ", JSON.stringify(Beneficiary_data, null, 4));

                //   if (Beneficiary_data != undefined) {
                //     this.getUpdateObject(Beneficiary_data);
                // //    this.commonData.benObj = Beneficiary_data;
                //   }
                // this.showNext.emit();

              },
                (error) => {
                  console.log(error);
                  this.alertService.alert(error.errorMessage, 'error');
                });
          },
            (error) => {
              console.log(error);
            });
      }
      /*
      "IF CONDITION CHANGED on 26April,2018 ; Diamond"
      !this.pncFlag ----changed to-----> Beneficiary_data.mctsDataReaderDetail!=undefined 
      */
      if (Beneficiary_data.childValidDataHandler != undefined) {
        this.phoneNo = Beneficiary_data.childValidDataHandler.Phone_No;
       
      }
      else {
        this.phoneNo = Beneficiary_data.mctsDataReaderDetail.Whom_PhoneNo;
      }
      this.czentrixService.manualDialaNumber(this.czentrixService.agent_id, this.phoneNo)
        .subscribe((response) => {
          console.log(response);
          localStorage.setItem('onCall', 'true');
          this.commonData.onCall.next({
            "isonCall": true
          });
          // this.alertService.alert(response.data.status,'success');
          if (response.data.status == "SUCCESS") {
            console.log("Beneficiary_data: ", JSON.stringify(Beneficiary_data, null, 4));

            //   if (Beneficiary_data != undefined) {
            //     this.getUpdateObject(Beneficiary_data);
            // //    this.commonData.benObj = Beneficiary_data;
            //   }
            // this.showNext.emit();
          }
        },
          (error) => {
            console.log(error);
            this.alertService.alert(error.errorMessage, 'error');
          });
    }
    // this.showNext.emit();
  }
  navigateToPrev() {
    this.showPrev.emit();
  }

  getUpdateObject(oldObj) {
    this._OCWService.getUpdatedObject(oldObj).subscribe((response) => {
      console.log(response);

      // if (response.json().statusCode == 200) {
      if (response.statusCode == 200) {
        // console.log('getUpdateObject response body: ', (response['_body']));
        // response = (response['_body']).replace(/(\d+)([\[:.])?(\d+)([,\}\]])/g, "\"$1$2$3\"$4");
        // response = JSON.parse(response);
        this.commonData.benObj = response.data;
      } else {

        this.commonData.benObj = oldObj;
      }

    },
      (err) => {
        this.alertService.alert(err.errorMessage, 'error');
      })
  }
  ngOnDestroy() {
    if (this.newCall)
      this.newCall.unsubscribe();
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
