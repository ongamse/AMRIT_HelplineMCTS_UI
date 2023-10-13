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


import { Component, OnInit, OnChanges, OnDestroy } from "@angular/core";
import { dataService } from "../services/dataService/data.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { InnerQuestionerModalComponent } from "../questionaire-modal/questionaire-modal.component";
import { OCWService } from "../services/mcts-agent/outbond-call-worklist/outbond-call-worklist.service";
import { MdDialog } from "@angular/material";
import { ConfirmationDialogsService } from "../services/dialog/confirmation.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { CzentrixServices } from "../services/czentrixService/czentrix.service";
import { ConfigService } from "../services/config/config.service";
import { CallClosureService } from "../services/mcts-agent/call-closure/call-closure.service";
import { QuestionaireService } from "../services/questionaireService/questionaire-service";
import { loginService } from "../services/loginService/login.service";
import { SocketService } from "../services/socketService/socket.service";
import { AuthService } from "../services/authentication/auth.service";
declare var jQuery: any;
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";

@Component({
  selector: "app-mcts-agent-outbondcall",
  templateUrl: "./innerpage-agent.component.html",
  styleUrls: ["./innerpage-agent.component.css"],
})
export class MctsAgentOutbondcallComponent implements OnInit {
  // callDuration:number=0;
  barMinimized = true;
  refreshWorklist = false;
  id: any;
  completed_calls: any;
  total_call_duration = "00:00:00";
  eventSpiltData: any;
  refreshQuestionaire = false;
  transferCallFlag = false;
  transferCallToANMFlag = false;
  transferCallTo104Flag = false;
  transferCallTo108Flag = false;
  callAnsweredFlag = false;
  skill: any;
  selfNoFlag = false;
  blockWorklist = false;
  current_role: any;
  current_service: any;
  call_started = false;
  timer1Subscription: Subscription;
  timer2Subscription: Subscription;
  updateCallResponse = false;
  languages = [];
  app_language = "English";
  ctiHandlerURL: any;
  phoneNo: any;
  callerID: any;
  providerServiceMapID: any;
  userID: any;
  createdBy: any;
  callTypes: any;
  isOnCall: boolean = false;
  current_roleName = this.getCommonData.currentRole.RoleName;
  callDuration: string = "";
  seconds: number = 0;
  minutes: number = 0;
  counter: number = 0;
  res: any;
  isTransfered: Boolean = false;
  count: any = 0;
  language_file_path: any = "./assets/";
  /* For Call Wrapup, Diamond Khanna,9 May,2018 */
  ticks = 0;
  timeRemaining: any;
  wrapupTimerSubscription: Subscription;
  wrapup_exceeded: boolean = false;

  presentCallID: any;
  callStatus: any;
  //get mother and child phone number
  sendPhoneNo: any;
  benRegID: any;
  autodialFlag: boolean = false;
  /* For Call Wrapup */

  //added to check if mother
  isMother: Boolean = false;
  current_roleID: any;
  custdisconnectCallID: any;
  currentLanguageSet: any;
  languageArray: any;

  constructor(
    public getCommonData: dataService,
    public router: Router,
    public route: ActivatedRoute,
    private questionaireService: QuestionaireService,
    public dialog: MdDialog,
    private czentrixService: CzentrixServices,
    private configService: ConfigService,
    public sanitizer: DomSanitizer,
    private callClosureService: CallClosureService,
    private httpServiceService: HttpServices,
    private _OCWService: OCWService,
    private alertService: ConfirmationDialogsService,
    private loginService: loginService,
    private authService: AuthService,
    private socketService: SocketService
  ) {
    this.id = this.czentrixService.agent_id;
    this.current_role = this.getCommonData.currentRole.RoleName;
    this.current_roleID = this.getCommonData.currentRole.RoleID;
    this.current_service = this.getCommonData.currentService.serviceName;
    // this.providerServiceMapID = this.getCommonData.currentService.serviceID;
    // this.userID = this.getCommonData.uid;
    // this.createdBy = this.getCommonData.uname;

    this.getCommonData.onCall.subscribe((data) => {
      console.log(data);
      this.updateOnCall(data);
    });
    // get ip if its undefined
    if (this.czentrixService.ip == undefined) {
      this.czentrixService
        .getIpAddress(this.czentrixService.agent_id)
        .subscribe(
          (response) => {
            console.log(response);
            this.czentrixService.ip = response.agent_ip;
          },
          (error) => {
            console.log(error);
          }
        );
    }
    // this.loginService.getLanguages()
    // 	.subscribe((response) => {
    // 		console.log(response.data);
    // 		this.languages = response.data["m_language"]
    // 	},
    // 		(error) => {
    // 			console.log(error);
    // 		});

    //route params Subscription
    this.route.params.subscribe((params: Params) => {
      console.log("Params:", params);
      if (params["phoneNo"] != undefined) {
        this.phoneNo = parseInt(params["phoneNo"]);
        console.log("phoneNo:" + this.phoneNo);
      }
      if (params["callerID"] != undefined) {
        this.callerID = params["callerID"];
        console.log("callerID:" + this.callerID);
      }

      if (Object.keys(params).length > 0 && this.callerID != undefined) {
        //get mother data obj api
        this.callClosureService
          .getBenificiaryDetails({
            callId: this.callerID,
          })
          .subscribe(
            (response) => {
              if (response.json().statusCode == 200) {
                console.log("response body: ", response["_body"]);
                this.res = response["_body"].replace(
                  /(\d+)([\[:.])?(\d+)([,\}\]])/g,
                  '"$1$2$3"$4'
                );
              }
              this.res = JSON.parse(this.res);
              console.log("data response: ", this.res);
              console.log("data above: ", this.res.data);
              if (this.res.data.response != undefined) {
                this.alertService.alert(this.res.data.response, "success");
              } else {
                let mctsdata = this.res.data;
                //this.isTransfered = true;
                //this.callAnsweredFlag = true;
                //console.log('response after trfr: ', response);
                //let mctsdata = (response['_body']).replace(/(\d+)([\[:.])?(\d+)([,\}\]])/g, "\"$1$2$3\"$4");
                if (mctsdata.mctsDataReaderDetail) {
                  this.sendPhoneNo = mctsdata.mctsDataReaderDetail.Whom_PhoneNo;
                  this.benRegID =
                    mctsdata.mctsDataReaderDetail.BeneficiaryRegID;
                  this.isMother = true;
                }
                if (mctsdata.childValidDataHandler) {
                  this.sendPhoneNo = mctsdata.childValidDataHandler.Phone_No;
                  this.benRegID =
                    mctsdata.childValidDataHandler.BeneficiaryRegID;
                  this.isMother = false;
                }
                let postData = {
                  obCallID: mctsdata.obCallID,
                  allocatedUserID: this.getCommonData.uid,
                  beneficiaryRegID: this.benRegID,
                  providerServiceMapID:
                    this.getCommonData.currentService.serviceID,
                  outboundCallType: mctsdata.outboundCallType,
                  callId: this.callerID,
                  createdBy: this.getCommonData.uname,
                  agentID: this.czentrixService.agent_id,
                  receivedRoleName: this.getCommonData.Role_Name,
                  phoneNo: this.sendPhoneNo,
                  isMother: this.isMother,
                };

                this._OCWService.putCallerID(postData).subscribe(
                  (response) => {
                    console.log(
                      "response on tranfer calldetails: ",
                      response.data
                    );
                    this.getCommonData;
                    this.getCommonData.callDetailID =
                      response.data["callDetailID"];
                    console.log(
                      "saving caller ID successfull on call transfer to MO",
                      this.getCommonData.callDetailID
                    );
                    /* commented as obj got undefined in call screen; Diamond,26 april */
                  },
                  (error) => {
                    console.log(error);
                  }
                );

                this.questionaireService
                  .getCallTypes({
                    providerServiceMapID:
                      this.getCommonData.currentService.serviceID,
                  })
                  .subscribe(
                    (response) => {
                      this.callTypes = response.data;
                      this.getCommonData.call_recieved_by_mo = true;
                      if (
                        (mctsdata != undefined &&
                          mctsdata.mctsDataReaderDetail != undefined &&
                          mctsdata.mctsDataReaderDetail.PhoneNo_Of_Whom !=
                            undefined &&
                          mctsdata.mctsDataReaderDetail.PhoneNo_Of_Whom.toLowerCase() ==
                            "self") ||
                        (mctsdata != undefined &&
                          mctsdata.childValidDataHandler != undefined &&
                          mctsdata.childValidDataHandler.Phone_No_of !=
                            undefined &&
                          mctsdata.childValidDataHandler.Phone_No_of.toLowerCase() ==
                            "self")
                      ) {
                        this.getCommonData.selfNoOnTransfer = true;
                      }
                      this.transferToCallScreen(mctsdata);
                    },
                    (error) => {
                      console.log(error);
                    }
                  );
              }
            },
            (err) => {
              console.log(err);
            }
          );
      }
    });
  }
  ngOnInit() {
    this.fetchLanguageResponse();
    this.route.params.subscribe((params: Params) => {
      if (params["callerID"] != undefined) {
        this.presentCallID = params["callerID"];
      }
    });

    this.timeRemaining = this.configService.getWrapUpTime();
    let url =
      this.configService.getTelephonyServerURL() +
      "bar/cti_handler.php?e=" +
      this.czentrixService.agent_id;
    this.ctiHandlerURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.getCallStats();
    this.callDuration = this.minutes + "m " + this.seconds + "sec ";

    this.addListener();

    //hardcoded agent_id and ip address is set after that...agent_id will later be coming from login response
    // this.czentrixService.agent_id = 2001;
    // this.czentrixService.getIpAddress(this.czentrixService.agent_id)
    // .subscribe((response)=>{
    // 	console.log(response);
    // 	this.czentrixService.ip = response.agent_ip;
    // },
    // (error)=>{
    // 	console.log(error);
    // });

    var idx = jQuery(".carousel-inner div.active").index();
    console.log("index", idx);

    jQuery("#closureLink").on("click", function () {
      jQuery("#myCarousel").carousel(idx + 3);
      jQuery("#four").parent().find("a").removeClass("active-tab");
      jQuery("#four").find("a").addClass("active-tab");
    });
    jQuery("#cancelLink").on("click", function () {
      jQuery("#myCarousel").carousel(idx);
      jQuery("#one").parent().find("a").removeClass("active-tab");
      jQuery("#one").find("a").addClass("active-tab");
    });

    jQuery("#one").on("click", function () {
      jQuery("#viewHistoryCarousel").carousel(idx);

      jQuery(this).parent().find("a").removeClass("active-tab");
      jQuery(this).find("a").addClass("active-tab");
    });
    jQuery("#two").on("click", function () {
      jQuery("#myCarousel").carousel(idx + 1);

      jQuery(this).parent().find("a").removeClass("active-tab");
      jQuery(this).find("a").addClass("active-tab");
    });

    jQuery("#three").on("click", function () {
      jQuery("#myCarousel").carousel(idx + 2);
      jQuery(this).parent().find("a").removeClass("active-tab");
      jQuery(this).find("a").addClass("active-tab");
    });

    jQuery("#four").on("click", function () {
      jQuery("#myCarousel").carousel(idx + 3);
      jQuery(this).parent().find("a").removeClass("active-tab");
      jQuery(this).find("a").addClass("active-tab");
    });

    jQuery("#previous").on("click", function () {
      var idx = jQuery(".carousel-inner div.active").index();
      console.log("chala with", idx);
      if (idx === 0) {
        console.log("chala");
        jQuery("#one").parent().find("a").removeClass("active-tab");
        jQuery("#one").find("a").addClass("active-tab");
      }
      if (idx === 1) {
        jQuery("#two").parent().find("a").removeClass("active-tab");
        jQuery("#two").find("a").addClass("active-tab");
      }
      if (idx === 2) {
        jQuery("#three").parent().find("a").removeClass("active-tab");
        jQuery("#three").find("a").addClass("active-tab");
      }
      if (idx === 3) {
        jQuery("#four").parent().find("a").removeClass("active-tab");
        jQuery("#four").find("a").addClass("active-tab");
      }
    });

    jQuery("#next").on("click", function () {
      var idx = jQuery(".carousel-inner div.active").index();
      console.log("chala with", idx);
      if (idx === 0) {
        jQuery("#one").parent().find("a").removeClass("active-tab");
        jQuery("#one").find("a").addClass("active-tab");
      }
      if (idx === 1) {
        jQuery("#two").parent().find("a").removeClass("active-tab");
        jQuery("#two").find("a").addClass("active-tab");
      }
      if (idx === 2) {
        jQuery("#three").parent().find("a").removeClass("active-tab");
        jQuery("#three").find("a").addClass("active-tab");
      }
      if (idx === 3) {
        jQuery("#four").parent().find("a").removeClass("active-tab");
        jQuery("#four").find("a").addClass("active-tab");
      }
    });
    this.getAgentStatus();
    this.fetchLanguageSet();
  }
  getAgentStatus() {
    this.czentrixService.getAgentStatus().subscribe(
      (res) => {
        console.log("res", res);
        if (res && res.data.stateObj.stateName) {
          this.callStatus = res.data.stateObj.stateName;
        }
      },
      (err) => {
        console.log("error in getting agent status, getAgentStatus API FAILED");
      }
    );
  }
  fetchLanguageSet() {
    this.httpServiceService.fetchLanguageSet().subscribe((languageRes) => {
      this.languageArray = languageRes;
      this.getLanguage();
    });
  }
  getLanguage() {
    if (sessionStorage.getItem("setLanguage") != null) {
      this.changeLanguage(sessionStorage.getItem("setLanguage"));
    } else {
      this.changeLanguage(this.app_language);
    }
  }

  changeLanguage(language) {
    this.httpServiceService
      .getLanguage(this.language_file_path + language + ".json")
      .subscribe(
        (response) => {
          if (response) {
            this.languageSuccessHandler(response, language);
          } else {
            alert(this.currentLanguageSet.langNotDefinesd);
          }
        },
        (error) => {
          alert(this.currentLanguageSet.comingUpWithThisLang + " " + language);
        }
      );
  }

  languageSuccessHandler(response, language) {
    console.log("language is ", response);
    if (response == undefined) {
      alert(this.currentLanguageSet.langNotDefinesd);
    }

    if (response[language] != undefined) {
      this.currentLanguageSet = response[language];
      sessionStorage.setItem("setLanguage", language);
      if (this.currentLanguageSet) {
        this.languageArray.forEach((item) => {
          if (item.languageName == language) {
            this.app_language = language;
            this.getCommonData.appLanguage = language;
          }
        });
      } else {
        this.app_language = language;
        this.getCommonData.appLanguage = language;
      }

      this.httpServiceService.getCurrentLanguage(response[language]);
    } else {
      alert(this.currentLanguageSet.comingUpWithThisLang + " " + language);
    }
  }
  data: any = this.getCommonData.Userdata;

  selectedBenData: any = {
    id: "",
    fname: "",
    lname: "",
    mob: "",
  };
  toggleBar() {
    if (this.barMinimized) this.barMinimized = false;
    else this.barMinimized = true;
  }

  testEvent() {
    // let event = new CustomEvent("message", {
    // 	detail: {
    // 		data: 'Accept|12345|14892042908.5180000100|INBOUND',
    // 		time: new Date(),
    // 	},
    // 	bubbles: true,
    // 	cancelable: true
    // });

    // document.dispatchEvent(event);

    let event = new CustomEvent("message", {
      detail: {
        data: "CustDisconnect|1505969514.3802000000",
        time: new Date(),
      },
      bubbles: true,
      cancelable: true,
    });

    document.dispatchEvent(event);
  }

  listener(event) {
    console.log("listener invoked: ");
    console.log("event received" + JSON.stringify(event));

    if (event.data) {
      this.eventSpiltData = event.data.split("|");
      // alert(event.data);
    } else {
      this.eventSpiltData = event.detail.data.split("|");
    }
    this.handleEvent(this.eventSpiltData);
  }
  unsubscribeWrapupTime() {
    if (this.wrapupTimerSubscription) {
      this.wrapupTimerSubscription.unsubscribe();
    }
  }

  wrapup_count = 0;

  handleEvent(eventData) {
    var idx = jQuery(".carousel-inner div.active").index();

    if (
      eventData[0] == "CustDisconnect" &&
      idx != 0 &&
      eventData[1] === this.presentCallID
    ) {
      this.custdisconnectCallID = eventData[1];
      if (this.ticks == 0) {
        let obj = {
          transferCallFlag: false,
          transferCallToANMFlag: false,
          transferCallTo104Flag: false,
          transferCallTo108Flag: false,
          callAnsweredFlag: false,
        };
        this.wrapup_count = this.wrapup_count + 1;
        console.log("wrapup count:", this.wrapup_count);
        this.viewClosure(obj);
        this.startCallWraupup();
      } else {
        console.log("CallWraupup is not started, ticks:" + this.ticks);
      }
    } else if (
      eventData[0] == "Accept" &&
      eventData[2] != undefined &&
      eventData[4] != undefined &&
      eventData[4] == "0"
    ) {
      console.log(
        "saving callerID",
        JSON.stringify(this.getCommonData.benObj, null, 4)
      );
      this.presentCallID = eventData[2];
      this.ticks = 0;
      this.unsubscribeWrapupTime();
      if (
        this.getCommonData.benObj != undefined &&
        this.getCommonData.benObj.mctsDataReaderDetail != undefined
      ) {
        this.sendPhoneNo =
          this.getCommonData.benObj.mctsDataReaderDetail.Whom_PhoneNo;
        this.benRegID =
          this.getCommonData.benObj.mctsDataReaderDetail.BeneficiaryRegID;
        this.isMother = true;
      }
      if (
        this.getCommonData.benObj != undefined &&
        this.getCommonData.benObj.childValidDataHandler != undefined
      ) {
        this.sendPhoneNo =
          this.getCommonData.benObj.childValidDataHandler.Phone_No;
        this.benRegID =
          this.getCommonData.benObj.childValidDataHandler.BeneficiaryRegID;
        this.isMother = false;
      }

      if (this.getCommonData && this.getCommonData.benObj) {
        let postData = {
          obCallID: this.getCommonData.benObj.obCallID,
          allocatedUserID: this.getCommonData.uid,
          beneficiaryRegID: this.benRegID,
          providerServiceMapID: this.getCommonData.currentService.serviceID,
          outboundCallType: this.getCommonData.benObj.outboundCallType,
          callId: eventData[2],
          createdBy: this.getCommonData.uname,
          agentID: this.czentrixService.agent_id,
          receivedRoleName: this.getCommonData.Role_Name,
          phoneNo: this.sendPhoneNo,
          isMother: this.isMother,
        };
        console.log(JSON.stringify(postData));
        this._OCWService.putCallerID(postData).subscribe(
          (response) => {
            console.log(response.data);
            this.getCommonData.callDetailID = response.data["callDetailID"];
            console.log(
              "saving caller ID successfull and now move to call screen by fetching benObj from dataService"
            );
            /* commented as obj got undefined in call screen; Diamond,26 april */
            this.historyObj = this.getCommonData.benObj;
            //this.callDuration = 0 + 'm ' + 0 + 'sec ';

            this.viewCallScreen();
          },
          (error) => {
            console.log(error);
          }
        );
      }
    } else if (
      this.eventSpiltData[0] == "Accept" &&
      this.eventSpiltData[2] != undefined &&
      this.eventSpiltData[4] != undefined &&
      this.eventSpiltData[4] == "1"
    ) {
      console.log(
        "transfer event received, routing to inner page agent and then from their route to call screen"
      );
      this.getCommonData.onCall.next({
        isonCall: true,
      });
      this.presentCallID = eventData[2];
      this.router.navigate([
        "/outboundCallWorklist",
        this.eventSpiltData[1],
        this.eventSpiltData[2],
      ]);
    }
    this.getAgentStatus();
  }

  startCallWraupup() {
    this.callClosureService
      .getRoleBasedWrapuptime(this.current_roleID)
      .subscribe(
        (roleWrapupTime) => {
          if (
            roleWrapupTime.data != undefined &&
            roleWrapupTime.data.isWrapUpTime != undefined &&
            roleWrapupTime.data.WrapUpTime != undefined &&
            roleWrapupTime.data.isWrapUpTime
          ) {
            this.roleBasedCallWrapupTime(roleWrapupTime.data.WrapUpTime);
          } else {
            const time = this.timeRemaining;
            this.roleBasedCallWrapupTime(time);
            console.log("Need to configure wrap up time");
          }
        },
        (err) => {
          const time = this.timeRemaining;
          this.roleBasedCallWrapupTime(time);
          console.log("Need to configure wrap up time", err.errorMessage);
        }
      );

    // const timer = Observable.timer(2000, 1000);
    // this.wrapupTimerSubscription = timer.subscribe(t => {
    // 	this.ticks = (this.timeRemaining - t);
    // 	console.log('t==' + t);
    // 	console.log('ticks==' + this.ticks);
    // 	if (t == this.timeRemaining && this.wrapup_count == 1) {
    // 		this.wrapupTimerSubscription.unsubscribe();
    // 		this.closeCall(true);
    // 		//  this.router.navigate(['/MultiRoleScreenComponent/dashboard']);
    // 	}
    // });
  }
  roleBasedCallWrapupTime(timeRemaining) {
    console.log("roleBasedCallWrapupTime", timeRemaining);
    const timer = Observable.timer(2000, 1000);
    this.wrapupTimerSubscription = timer.subscribe((t) => {
      this.ticks = timeRemaining - t;
      console.log("timer t", t);
      console.log("ticks", this.ticks);
      if (t === timeRemaining) {
        this.wrapupTimerSubscription.unsubscribe();
        t = 0;
        this.ticks = 0;
        console.log("after re initialize the timer", t);
        if (this.presentCallID === this.custdisconnectCallID) {
          this.closeCall(true);
        } else {
          console.log(
            "previous custdisconnect call ID not verified with current call ID",
            this.custdisconnectCallID
          );
        }
      }
    });
  }
  closeCall(flag) {
    if (flag) {
      this.getCommonData.call_wrapup.next();
    }
  }
  toRemove: any;
  addListener() {
    if (window.parent.parent.addEventListener) {
      console.log("adding message listener");
      this.toRemove = this.listener.bind(this);
      addEventListener("message", this.toRemove, false);
    } else {
      console.log("adding onmessage listener");
      //document.attachEvent("onmessage", this.listener)
    }
  }

  getCallStats() {
    //get call stats like completed_calls && total_call_duration
    this.czentrixService
      .getTodayCallReports(this.czentrixService.agent_id)
      .subscribe(
        (response) => {
          console.log(
            "getTodayCallReports response: " + JSON.stringify(response)
          );
          this.completed_calls = response.data.total_calls;
          this.total_call_duration = response.data.total_call_duration;
        },
        (err) => {
          console.log("Error in Total Call Report", err);
        }
      );
  }

  updateOnCall(data) {
    this.isOnCall = data.isonCall;
  }
  addActiveClass(val: any) {
    jQuery("#" + val)
      .parent()
      .find("a")
      .removeClass("active-tab");
    jQuery("#" + val)
      .find("a")
      .addClass("active-tab");
  }

  getSelectedBenDetails(data: any) {
    console.log("data recieved", data, data.beneficiaryRegID);
    this.selectedBenData.id = "BEN" + data.beneficiaryRegID;
    this.selectedBenData.fname = data.firstName;
    this.selectedBenData.lname = data.lastName;
    this.selectedBenData.mob = data.phoneNo;
  }

  historyObj: any;
  fetchModalData(modaldata: any) {
    this.historyObj = modaldata;
    this.historyObj["autodial"] = true; //adding so that on every onchange auto dial should not happen i.e in outbound history component 		gursmran 12/6/18
    console.log(
      JSON.stringify(modaldata),
      "**## DATA SELECTED and sent to all the components ##**"
    );
    // var idx = jQuery('.carousel-inner div.active').index();
    // console.log("index", idx);
    jQuery("#myCarousel").carousel(1);
    jQuery(this).parent().find("a").removeClass("active-tab");
    jQuery(this).find("a").addClass("active-tab");
  }

  viewHistoryScreen(event) {
    this.historyObj = event;
    jQuery("#myCarousel").carousel(1);
    jQuery(this).parent().find("a").removeClass("active-tab");
    jQuery(this).find("a").addClass("active-tab");
  }

  viewCallScreen() {
    var idx = jQuery(".carousel-inner div.active").index();
    console.log("index", idx);
    this.count = this.count + 1;
    if (idx == 3 || idx == 1) {
      this.updateCallResponse = true;
    } else {
      this.updateCallResponse = false;
    }
    this.historyObj = this.getCommonData.benObj;
    if (this.call_started === false) {
      this.call_started = true;
      const timer1 = Observable.interval(1000);
      this.timer1Subscription = timer1.subscribe(() => {
        if (this.seconds === this.counter + 60) {
          this.minutes = this.minutes + 1;
          this.seconds = 0;
        }
        this.seconds = this.seconds + 1;
        this.callDuration = this.minutes + "m " + this.seconds + "sec ";
      });
    }

    this.refreshWorklist = false;
    this.refreshQuestionaire = false;
    this.blockWorklist = true;

    jQuery("#myCarousel").carousel(2);
    jQuery(this).parent().find("a").removeClass("active-tab");
    jQuery(this).find("a").addClass("active-tab");
  }

  moveToDashboard() {
    this.router.navigate([
      "/MultiRoleScreenComponent",
      { outlets: { postLogin_router: ["dashboard", { role: "AGENT" }] } },
    ]);
  }

  viewOutboundWorkLIst() {
    var idx = jQuery(".carousel-inner div.active").index();
    console.log("index", idx);
    jQuery("#myCarousel").carousel(idx - 1);
    jQuery(this).parent().find("a").removeClass("active-tab");
    jQuery(this).find("a").addClass("active-tab");
  }

  transferToCallScreen(data) {
    this.historyObj = data;
    console.log("History obj==", JSON.stringify(this.historyObj, null, 4));
    if (this.call_started === false) {
      this.call_started = true;
      const timer2 = Observable.interval(1000);
      this.timer2Subscription = timer2.subscribe(() => {
        if (this.seconds === this.counter + 60) {
          this.minutes = this.minutes + 1;
          this.seconds = 0;
        }
        this.seconds = this.seconds + 1;
        this.callDuration = this.minutes + "m " + this.seconds + "sec ";
      });
    }
    this.refreshWorklist = false;
    this.refreshQuestionaire = false;
    this.blockWorklist = true;
    localStorage.setItem("onCall", "true");
    // if (this.callDuration == null) {

    // }
    // if (this.callDuration == 0) {
    // 	const timer2 = Observable.interval(1000);
    // 	this.timer2Subscription = timer2.subscribe((number) => {
    // 		this.callDuration = number;
    // 	});
    // }
    jQuery("#myCarousel").carousel(2);
    jQuery(this).parent().find("a").removeClass("active-tab");
    jQuery(this).find("a").addClass("active-tab");
  }

  viewWorklistScreen() {
    if (this.wrapupTimerSubscription) {
      this.wrapupTimerSubscription.unsubscribe();
      this.ticks = 0;
      this.timeRemaining = this.configService.getWrapUpTime();
    }
    this.wrapup_count = 0;
    this.presentCallID = undefined;
    this.getCommonData.call_recieved_by_mo = false;
    this.getCommonData.selfNoOnTransfer = false;
    this.refreshWorklist = true;
    this.getCallStats();
    this.call_started = false;
    jQuery("#myCarousel").carousel(0);
    jQuery(this).parent().find("a").removeClass("active-tab");
    jQuery(this).find("a").addClass("active-tab");
    this.refreshQuestionaire = true;
    this.blockWorklist = false;
    this.minutes = 0;
    this.seconds = 0;
    this.callDuration = this.callDuration =
      this.minutes + "m " + this.seconds + "sec ";
    if (this.timer1Subscription != undefined) {
      this.timer1Subscription.unsubscribe();
    }
    if (this.timer2Subscription != undefined) {
      this.timer2Subscription.unsubscribe();
    }
    this.autodialFlag = false;
  }
  minimizeBar() {
    this.barMinimized = true;
  }

  viewClosure(obj) {
    console.log("historyObj", this.historyObj, this.getCommonData.benObj);
    this.historyObj = this.getCommonData.benObj;
    console.log("Object for transfer", JSON.stringify(obj, null, 4));

    console.log("transfer flag", obj.transferCallFlag);
    console.log("transfer flag to anm", obj.transferCallToANMFlag);
    console.log("Transfer flag to 104", obj.transferCallTo104Flag);

    console.log("call answered flag", obj.callAnsweredFlag);
    console.log("selfNoFlag", obj.selfNoFlag);

    var idx = jQuery(".carousel-inner div.active").index();
    console.log("index", idx);
    jQuery("#myCarousel").carousel(idx + 1);
    jQuery(this).parent().find("a").removeClass("active-tab");
    jQuery(this).find("a").addClass("active-tab");
    if (obj != undefined) {
      this.transferCallFlag = obj.transferCallFlag;
      this.transferCallToANMFlag = obj.transferCallToANMFlag;
      this.transferCallTo104Flag = obj.transferCallTo104Flag;
      this.transferCallTo108Flag = obj.transferCallTo108Flag;
      this.callAnsweredFlag = this.getCommonData.call_recieved_by_mo
        ? this.getCommonData.call_recieved_by_mo
        : obj.callAnsweredFlag;
      // this.callAnsweredFlag = false;
      this.selfNoFlag = this.getCommonData.selfNoOnTransfer
        ? this.getCommonData.selfNoOnTransfer
        : obj.selfNoFlag;
      this.skill = obj.skill;
    }

    if (this.isTransfered) {
      this.callAnsweredFlag = true;
      //this.isTransfered = false;
    }
  }

  logOut() {
    if (this.isOnCall) {
      this.alertService.alert(
        this.currentLanguageSet.youAreNotAllowedToLogOutCloseTheCall
      );
    } else {
      this.ipSuccessLogoutHandler();
    }
  }
  ipSuccessLogoutHandler() {
    this.czentrixService
      .agentLogout(this.czentrixService.agent_id, this.czentrixService.ip)
      .subscribe(
        (res) => {
          this.loginService
            .userLogout()
            .subscribe((response) => this.handleSuccess(response));
          this.router.navigate([""]);
          this.authService.removeToken();
          // this.socketService.logOut();
        },
        (err) => {
          this.loginService
            .userLogout()
            .subscribe((response) => this.handleSuccess(response));
          this.router.navigate([""]);
          this.authService.removeToken();
          // this.socketService.logOut();
        }
      );
  }
  handleSuccess(res) {
    console.log("redis token removed");
  }

  ngOnDestroy() {
    if (this.wrapupTimerSubscription) this.wrapupTimerSubscription.unsubscribe;

    if (window.parent.parent.removeEventListener) {
      console.log("removing message listener");
      removeEventListener("message", this.toRemove, false);
    } else {
      console.log("removing onmessage listener");
      //document.attachEvent("onmessage", this.listener)
    }
    if (this.timer1Subscription != undefined) {
      this.timer1Subscription.unsubscribe();
    }
  }

  updateBenData_inHistoryScreen(updated_bendata) {
    this.historyObj = updated_bendata;
  }
  autodial(value) {
    this.autodialFlag = value;
  }

  //AN40085822 23/10/2021 Integrating Multilingual Functionality --Start--
  ngDoCheck() {
    this.fetchLanguageResponse();
  }

  fetchLanguageResponse() {
     const languageComponent = new SetLanguageComponent(this.httpServiceService);
    languageComponent.setLanguage();
    this.currentLanguageSet = languageComponent.currentLanguageObject;
  }
  //--End--
}
