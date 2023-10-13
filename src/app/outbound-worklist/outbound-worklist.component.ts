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


import { Component, OnInit, Output, EventEmitter, Input, DoCheck } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { OCWService } from '../services/mcts-agent/outbond-call-worklist/outbond-call-worklist.service';
import { dataService } from '../services/dataService/data.service';
import { CzentrixServices } from '../services/czentrixService/czentrix.service';
import { MdDialog } from '@angular/material';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { GenerateBenificiaryIDComponent } from '../generate-benificiary-id/generate-benificiary-id.component';
declare var jQuery: any;
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LoaderService } from './../services/common/loader.service';
import { LoaderState } from './../services/common/loader';
import { MdTabChangeEvent } from '@angular/material';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-outbound-call-worklist',
  templateUrl: './outbound-worklist.component.html',
  styleUrls: ['./outbound-worklist.component.css']
  //providers:[OCWService]
})

export class OutbondCallWorklistComponent implements OnInit, DoCheck {
  p: number = 1;
  q: number = 1;
  @Input() refreshScreen = false;
  @Output() onTableRowSelection: EventEmitter<any> = new EventEmitter<any>();
  @Output() transferScreen: EventEmitter<any> = new EventEmitter<any>();
  @Output() autodial: EventEmitter<any> = new EventEmitter<any>();

  public showCreateFlag = false;
  serviceProviders: string[];
  motherOutboundWorklist: any = [];
  childOutboundWorklist: any = [];
  outboundWorklist: any;
  data: any;
  providerServiceMapID: any;
  createdBy: any;
  historyDetails: any;
  json: any;
  phoneNo: any;
  userID: any;
  res: any;
  // added to get dial preference
  isDialPreferenceManual: boolean;

  phoneNosOfMother: any = [];
  phoneNosOfChild: any = [];

  reqArrayForStartCallPNC: any = [];
  reqArrayForStartCallANC: any = [];

  campaignName: any;
  dialedDumpMother: any = ["*"];
  dialedDumpChild: any = ["#"];
  //added to test
  finalReqANC: any;
  finalReqPNC: any;
  autoMotherCallFlag: boolean = false;
  autoChildCallFlag: boolean = false;

  childStartCall: boolean = false;
  motherStartCall: boolean = false;

  newPreview: Subscription;
  timeRemaining = 5;
  time: any;
  show = false;
  showProgressBar: Boolean = false
  beneficiaryList: any;
  activePage = 1;
  rowsPerPage = 5;
  filterTerm;
  pagedList = [];
  beneficiaryListChild: any;
  currentLanguageSet: any;
  

  constructor(private _OCWService: OCWService,
    private dataService: dataService,
    private czentrixService: CzentrixServices,
    public dialog: MdDialog,
    private httpServiceService: HttpServices,
    private alertService: ConfirmationDialogsService,
    private loaderService: LoaderService) {
    this.motherOutboundWorklist = [];
    this.childOutboundWorklist = [];
  }

  ngOnInit() {
    this.fetchLanguageResponse();
    this.providerServiceMapID = this.dataService.currentService.serviceID;
    this.createdBy = this.dataService.uname;
    this.userID = this.dataService.uid;
    localStorage.removeItem('tabIndex');
    this.getDialPreference(this.providerServiceMapID);
    this.getCampaignNames();
    this.dataService.onCall.subscribe((data) => {
      console.log(data);
      this.updateOnCall(data);

    });
    // this.showProgressBar = false;
  }
  getDialPreference(providerServiceMapID) {
    let reqObjForDialPreference = {
      "providerServiceMapID": this.providerServiceMapID
    }
    this._OCWService.getDialPreference(reqObjForDialPreference).subscribe((response) => {
      console.log('response for auto preview dialing', JSON.stringify(response));
      this.isDialPreferenceManual = response.data.isDialPreferenceManual;
      console.log('this.isDialPreferenceManual', this.isDialPreferenceManual);
      this.getCallWorklist();
      // this.getChildCallRecords();
    },
      (err) => {
        this.alertService.alert(err.errorMessage, 'error');
      })

  }
  tabChanged(tabChangeEvent: MdTabChangeEvent): void {
    console.log('changedtab', tabChangeEvent.index);
    if (tabChangeEvent.index == 0) {
      // this.showProgressBar = false;
      localStorage.setItem("tabIndex", "0");
      this.getCallWorklist();
    }
    else {
      localStorage.setItem("tabIndex", "1");
      this.getChildCallRecords();
    }
  }
  getCallWorklist() {
    this.showProgressBar = true;
    let postData = {
      "providerServiceMapID": this.providerServiceMapID,
      "user": { "userName": this.createdBy },
      "createdBy": this.createdBy,
      "allocatedUserID": this.userID
    }
    this._OCWService.getMotherCallWorklist(postData)
      .subscribe(resProviderData => {
        // this._OCWService.getCallWorklist(postData)
        //   .subscribe(resProviderData => {
        // console.log(resProviderData["_body"]);
        /**
         * commented due to JSON error, not reading from body. Instead changed in service
         */
        // if (resProviderData.json().statusCode == 200) {
        if (resProviderData.statusCode == 200) {
          this.showProgressBar = false;
          this.motherOutboundWorklist = resProviderData.data;
          console.log("mother", this.motherOutboundWorklist );
          this.beneficiaryList = resProviderData.data;
          this.beneficiaryListChild =[];
          this.pageChanged({
            page: this.activePage,
            itemsPerPage: this.rowsPerPage
          });
          this.filterTerm = null;
          if (!this.isDialPreferenceManual) {
            this.filterANCData();
          }
        }
      },
        (err) => {
          this.alertService.alert(err.errorMessage, 'error');
        });
  }
  getChildCallRecords() {
    // this.showProgressBar = true;
    let postData = {
      "providerServiceMapID": this.providerServiceMapID,
      "user": { "userName": this.createdBy },
      "createdBy": this.createdBy,
      "allocatedUserID": this.userID
    }
    this._OCWService.getChildCallWorklist(postData)
      .subscribe(resProviderData => {
        if (resProviderData.statusCode == 200) {
          // this.showProgressBar = false;
          this.childOutboundWorklist = resProviderData.data;
          this.beneficiaryListChild = resProviderData.data;
          this.beneficiaryList = [];
          if (!this.isDialPreferenceManual) {
            this.filterPNCData();
          }
        }
      })
  }
  getCampaignNames() {
    let reqCampaignName = {
      "providerServiceMapID": this.providerServiceMapID,
      "agentID": this.czentrixService.agent_id
    }
    this._OCWService.getCampaignName(reqCampaignName).subscribe((response) => {
      if (response.statusCode == 200) {
        console.log("Campaign response", JSON.stringify(response));

        if (response.data[0] != undefined) {
          this.campaignName = response.data[0].cti_CampaignName;
        }
      }
    })
  }
  updateOnCall(data) {
    if (data.isonCall == false && this.autoMotherCallFlag == true) {
      const timer = Observable.timer(1000, 1000);
      this.newPreview = timer.subscribe(sec => {
        this.time = (this.timeRemaining - sec)
        if (sec == this.timeRemaining) {
          this.onStartCall('mother');
        }
      });
    }
    else if (data.isonCall == false && this.autoChildCallFlag == true) {
      const timer = Observable.timer(1000, 1000);
      this.newPreview = timer.subscribe(sec => {
        this.time = (this.timeRemaining - sec)
        if (sec == this.timeRemaining) {
          this.onStartCall('child');
        }
      });
    }
  }

  filterPNCData() {
    this.reqArrayForStartCallPNC = [];
    this.childOutboundWorklist.forEach(element => {
      if (element.childValidDataHandler != undefined && element.childValidDataHandler.Phone_No != undefined) {
        let reqObjForStartCallChild = {
          "camp_name": this.campaignName,
          "mobile": element.childValidDataHandler.Phone_No,
          "Agent_id": this.czentrixService.agent_id,
          "id": element.childID ? element.childID : element.motherID,
          "obj": element
        }
        this.reqArrayForStartCallPNC.push(reqObjForStartCallChild);
      }
      if (element.mctsDataReaderDetail != undefined && element.mctsDataReaderDetail.Whom_PhoneNo != undefined) {
        let reqObjForStartCallMother = {
          "camp_name": this.campaignName,
          "mobile": element.mctsDataReaderDetail.Whom_PhoneNo,
          "Agent_id": this.czentrixService.agent_id,
          "id": element.childID ? element.childID : element.motherID,
          "obj": element
        }
        this.reqArrayForStartCallPNC.push(reqObjForStartCallMother)
      }
      // this.finalReqANC = {
      //   "xyz" : this.reqArrayForStartCallANC
      // }
      // this.finalReqANC = {"xyz":[ { "camp_name": "MCTS_ANM", "mobile": "8197549008", "Agent_id": "2006" }]};

    });
    console.log('childOutboundWorklist: ' + this.childOutboundWorklist.length);
    console.log('childOutboundWorklist: ' + this.childOutboundWorklist);

    console.log(this.reqArrayForStartCallPNC);
  }

  filterANCData() {
    this.reqArrayForStartCallANC = [];
    this.motherOutboundWorklist.forEach(element => {
      if (element.mctsDataReaderDetail != undefined && element.mctsDataReaderDetail.Whom_PhoneNo != undefined) {
        let reqObjForStartCallMother = {
          "camp_name": this.campaignName,
          "mobile": element.mctsDataReaderDetail.Whom_PhoneNo,
          "Agent_id": this.czentrixService.agent_id,
          "id": element.motherID,
          "obj": element
        }
        this.reqArrayForStartCallANC.push(reqObjForStartCallMother);
      }
      // this.finalReqPNC = {
      //   "xyz" : this.reqArrayForStartCallPNC
      // }
      // this.finalReqPNC = {"xyz":[ { "camp_name": "MCTS_ANM", "mobile": "8197549008", "Agent_id": "2006" }]};
    });
    console.log(this.reqArrayForStartCallANC);
  }

  startMotherCall($event) {
    if ($event.checked == true) {
      this.autoMotherCallFlag = true;
      this.getAgentStatus('mother');
      //   this.onStartCall('mother');
    }
    else if ($event.checked == false) {
      this.autoMotherCallFlag = false;
      this.commonClosing();
    }
    this.filterTerm=null;
  }
  startChildCall($event) {
    if ($event.checked == true) {
      this.autoChildCallFlag = true;
      this.getAgentStatus('child');
      //  this.onStartCall('child');
    }
    else if ($event.checked == false) {
      this.autoChildCallFlag = false;
      this.commonClosing();
    }
    this.filterTerm=null;
  }
  getAgentStatus(value) {
    this.czentrixService.getAgentStatus().subscribe((res) => {
      if (res && res.data.stateObj.stateName) {
        let status;
        status = res.data.stateObj.stateName;
        if (status.toUpperCase() === "FREE" || status.toUpperCase() === "READY") {
          this.onStartCall(value);
        }
        else {
          this.reset();
        }
      }

    }, (err) => {
      console.log("error");
      this.alertService.alert(err.errorMessage);
      this.reset();

    });
  }
  commonClosing() {
    this.dataService.onCall.next({
      "isonCall": false
    });
    localStorage.setItem('onCall', 'false');
    this.time = 0;
    if (this.newPreview)
      this.newPreview.unsubscribe();
  }
  onStartCall(startFor) {
    if (this.newPreview) {
      this.newPreview.unsubscribe();
    }
    if (startFor == 'mother') {
      let newDialArray = [];
      let dialedArray = this.dialedDumpMother.slice();
      this.reqArrayForStartCallANC.map(function (obj) {
        console.log(dialedArray);
        if (!dialedArray.includes(obj.id) && newDialArray.length == 0) {
          console.log(obj);
          newDialArray.push(obj);
        }
      });
      if (newDialArray.length > 0) {
        this.dialedDumpMother.push(newDialArray[0].id);
        this.callBeneficiary(newDialArray);
      }
    }
    else {
      let newDialArray = [];
      let dialedArray = this.dialedDumpChild.slice();
      this.reqArrayForStartCallPNC.map(function (obj) {
        console.log(dialedArray);
        if (!dialedArray.includes(obj.id) && newDialArray.length == 0) {
          newDialArray.push(obj);
          console.log(obj);
        }
      });
      if (newDialArray.length > 0) {
        this.dialedDumpChild.push(newDialArray[0].id);
        this.callBeneficiary(newDialArray);
      }
    }
  }
  callBeneficiary(newDialArray) {
    // delete newDialArray[0].id;
    // this._OCWService.startCallForAutoPreviewDialing(newDialArray[0]).subscribe((response) => {
    //   console.log(response);


    // this.czentrixService.manualDialaNumber(newDialArray[0].Agent_id, newDialArray[0].mobile)
    //   .subscribe((response) => {
    //     this.dataService.onCall.next({
    //       "isonCall": true
    //     });
    //     this.getUpdateObject(newDialArray[0].obj);
    //     localStorage.setItem('onCall', 'true');
    //   },
    //   (err) => {
    //     this.alertService.alert(err.errorMessage, 'error');
    //     this.autoMotherCallFlag = false;
    //     this.autoChildCallFlag = false;
    //     this.motherStartCall = false;
    //     this.childStartCall = false;
    //   })
    this.viewHistory(newDialArray[0].obj);
  }
  onEndCall() {

  }

  ngOnChanges() {
    if (this.refreshScreen) {
      if (this.providerServiceMapID) {
        if (localStorage.getItem("tabIndex") == "1") {
          this.getChildCallRecords();
        } else {
          this.getDialPreference(this.providerServiceMapID);
        }
        // this.getDialPreference(this.providerServiceMapID);
      }
      // this.getCallWorklist(this.postData);


    }
  }

  viewHistory(data: any) {
    if (this.isDialPreferenceManual == false) {
      this.autodial.emit(true);
    }
    else {
      this.autodial.emit(false);
    }
    this.getUpdatedObjectForHistory(data, true);
    // setTimeout(() => {
    //   this.onTableRowSelection.emit(this.dataService.benObj);
    // }, 750);


  }



  tab: number = 1;
  changeService(val) {
    this.tab = val;
    jQuery("#service" + val).parent().find("li").removeClass();
    jQuery("#service" + val).addClass("animation-nav-active");

    jQuery("#service" + val).parent().find('a').removeClass();
    jQuery("#service" + val + " a").addClass("f-c-o");
  }

  transferToCallScreen(data, event) {
    event.stopPropagation();
    if (this.czentrixService.agent_id == undefined) {
      this.alertService.alert(this.currentLanguageSet.agentIdNotAvailableForCzentrixDial, 'error');
    }
    else {
      if (this.czentrixService.ip == undefined) {
        this.czentrixService.getIpAddress(this.czentrixService.agent_id)
          .subscribe((response) => {
            console.log(response);
            this.czentrixService.ip = response.data.agent_ip;
            //dial api after agent_ip fetch
            if (data.childValidDataHandler != undefined) {
              this.phoneNo = data.childValidDataHandler.Phone_No;
            }
            else {
              this.phoneNo = data.mctsDataReaderDetail.Whom_PhoneNo;
            }
            this.czentrixService.manualDialaNumber(this.czentrixService.agent_id, this.phoneNo)
              .subscribe((response) => {
                console.log(response);
                this.dataService.onCall.next({
                  "isonCall": true
                });
                localStorage.setItem('onCall', 'true');

                // this.alertService.alert(response.data.status, 'success');
                if (response.data.status == "SUCCESS") {
                  console.log("Data passed for update", data);

                  this.getUpdateObject(data, false);
                  // this.dataService.benObj = data;
                  // this.transferScreen.emit(data);
                }
              },
                (error) => {
                  console.log(error);
                  this.alertService.alert(error.errorMessage, 'error');
                });
          },
            (error) => {
              console.log(error);
            });
      } else {
        this.getUpdateObject(data, false);
      }

    }
    //   this.transferScreen.emit(data);
  }

  getUpdateObject(oldObj, value) {
    this._OCWService.getUpdatedObject(oldObj).subscribe((response) => {
      console.log('Response from update object', response);

      // if (response.json().statusCode == 200) {
      if (response.statusCode == 200) {
        // console.log('getUpdateObject response body: ', (response['_body']));
        // response = (response['_body']).replace(/(\d+)([\[:.])?(\d+)([,\}\]])/g, "\"$1$2$3\"$4");
        // response = JSON.parse(response);
        this.dataService.benObj = response.data;
        console.log('this.dataService.benObj in update Object', this.dataService.benObj);
        if (this.dataService.benObj.childValidDataHandler != undefined) {
          this.phoneNo = this.dataService.benObj.childValidDataHandler.Phone_No;
        }
        else {
          this.phoneNo = this.dataService.benObj.mctsDataReaderDetail.Whom_PhoneNo;
        }
        this.czentrixService.manualDialaNumber(this.czentrixService.agent_id, this.phoneNo)
          .subscribe((response) => {
            console.log(response);
            this.dataService.onCall.next({
              "isonCall": true
            });
            localStorage.setItem('onCall', 'true');

            // this.alertService.alert(response.data.status, 'success');
            if (response.data.status == "SUCCESS") {
              console.log("Data passed for update", JSON.stringify(this.dataService.benObj, null, 4));

              // this.getUpdateObject(data, false);
              //this.dataService.benObj = data;
              // this.transferScreen.emit(data);
            }
          },
            (error) => {
              console.log(error);
              this.alertService.alert(error.errorMessage, 'error');
            });
        if (value == true) {
          this.onTableRowSelection.emit(response.data);

        }
      }
      // }else{
      //   this.dataService.benObj = oldObj;
      // }

    },
      (err) => {
        this.alertService.alert(err.errorMessage, 'error');
        this.reset();
        this.autodial.emit(false);

      });
  }

  getUpdatedObjectForHistory(oldObj, value) {
    this._OCWService.getUpdatedObject(oldObj).subscribe((response) => {
      console.log(response);

      // if (response.json().statusCode == 200) {
      if (response.statusCode == 200) {
        // console.log('getUpdateObject response body: ', (response['_body']));
        // response = (response['_body']).replace(/(\d+)([\[:.])?(\d+)([,\}\]])/g, "\"$1$2$3\"$4");
        // response = JSON.parse(response);
        this.dataService.benObj = response.data;
        if (value == true) {
          this.onTableRowSelection.emit(response.data);

        }
      }
      // }else{
      //   this.dataService.benObj = oldObj;
      // }

    },
      (err) => {
        this.alertService.alert(err.errorMessage, 'error');
        this.reset();
        this.autodial.emit(false);

      });

  }
  reset() {
    this.autoMotherCallFlag = false;
    this.autoChildCallFlag = false;
    this.motherStartCall = false;
    this.childStartCall = false;
  }
  ngOnDestroy() {
    if (this.newPreview)
      this.newPreview.unsubscribe();
  }
  filterMotherList(searchTerm: string) {
    if (!searchTerm){
      this.motherOutboundWorklist = this.beneficiaryList;
      this.childOutboundWorklist = this.beneficiaryListChild;
    }      
    else if(this.beneficiaryList.length > 0){
      this.motherOutboundWorklist = [];
      this.beneficiaryList.forEach((item) => {
        console.log('item', JSON.stringify(item, null, 4))
        for (let key in item.mctsDataReaderDetail) {
          if (key == 'MCTSID_no' || key == 'Name' || key == 'PhoneNo_Of_Whom' || key == 'Whom_PhoneNo') {
            let value: string = '' + item.mctsDataReaderDetail[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.motherOutboundWorklist.push(item); break;
            }
           
          }
        }
      });
    }
    else if(this.beneficiaryListChild.length > 0){
      this.childOutboundWorklist = [];
      this.beneficiaryListChild.forEach((item) => {
        console.log('item', JSON.stringify(item, null, 4))

        
          for (let key in item.mctsDataReaderDetail) {
            if (key == 'Name' || key == 'PhoneNo_Of_Whom' || key == 'Whom_PhoneNo') {
              let value: string = '' + item.mctsDataReaderDetail[key];
              if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                this.childOutboundWorklist.push(item); break;
              }
             
            }
          }
        
          for (let key in item.childValidDataHandler) {
            if (key == 'MCTSID_no_Child_ID' || key == "Child_Name" || key == "Mother_Name" || key == 'Phone_No' || key == 'Phone_No_of') {
              let value: string = '' + item.childValidDataHandler[key];
              if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                this.childOutboundWorklist.push(item); break;
              }
             
            }
          }
                
      });
    }
    // this.activePage = 1;
    // this.pageChanged({
    //   page: 1,
    //   itemsPerPage: this.rowsPerPage
    // });
 }
 pageChanged(event): void {
  const startItem = (event.page - 1) * event.itemsPerPage;
  const endItem = event.page * event.itemsPerPage;
  this.pagedList = this.motherOutboundWorklist.slice(startItem, endItem);
}


 //BU40088124 23/10/2021 Integrating Multilingual Functionality --Start--
 ngDoCheck(){
  this.fetchLanguageResponse();
}

fetchLanguageResponse() {
 const getLnaguageJson = new SetLanguageComponent(this.httpServiceService);
 getLnaguageJson.setLanguage();
  this.currentLanguageSet = getLnaguageJson.currentLanguageObject; 
}
//--End--
}
