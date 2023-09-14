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
import { ActivatedRoute } from '@angular/router';
import { dataService } from '../services/dataService/data.service';
import { ConfigService } from '../services/config/config.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { SocketService } from '../services/socketService/socket.service';
import { CzentrixServices } from '../services/czentrixService/czentrix.service';
import { Subscription } from "rxjs/Subscription";
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'dashboard-component',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.component.css']
})

export class dashboardContentClass implements OnInit {
  data: any;
  eventSpiltData;
  widget: any = '0';
  ctiHandlerURL: any;
  barMinimized: boolean = true;
  currentRole: any;
    alertRefresh: number = 1;
    notificationSubscription : Subscription;

  public config: ToasterConfig =
  new ToasterConfig({
    timeout: 15000
  });
  currentLanguageSet: any;

  constructor(private czentrixService: CzentrixServices, public dataSettingService: dataService, public router: Router, private configService: ConfigService,
    public sanitizer: DomSanitizer, private _route: ActivatedRoute, private socketService: SocketService, private toasterService: ToasterService,
    public httpServices:HttpServices) {
  //     this.notificationSubscription = this.socketService.getMessages().subscribe((data) => {
  //  //   this.dataSettingService.uid = undefined;
  //     console.log(data);
  //      this.alertRefresh++;
  //     if (data.type == 'Alert') {
  //       this.toasterService.popAsync('error', data.type, data.subject + ": " + data.message).subscribe((res) => {
  //         console.log(res);
  //       });
  //     }

  //     if (data.type == 'Notification') {
  //       this.toasterService.popAsync('success', data.type, data.subject + ": " + data.message).subscribe((res) => {
  //         console.log(res);
  //       });
  //     }

  //     if (data.type == 'Emergency_Contact') {
  //       this.toasterService.popAsync('warning', data.type, data.subject + " " + data.message).subscribe((res) => {
  //         console.log(res);
  //       });
  //     }

  //     if (data.type == 'Training_Resource') {
  //       this.toasterService.popAsync('wait', data.type, data.subject + ": " + data.message).subscribe((res) => {
  //         console.log(res);
  //       });
  //     }

  //     if (data.type == 'Location_Message') {
  //       this.toasterService.popAsync('info', data.type, data.subject + ": " + data.message).subscribe((res) => {
  //         console.log(res);
  //       });
  //     }
  //   })
  };

  ngOnInit() {
    this.assignSelectedLanguage();
    let current_role=this.dataSettingService.Role_Name;
    this.currentRole = this.dataSettingService.Role_Name;
    this.currentRole = this.currentRole.trim().toUpperCase();
    

    this.data = this.dataSettingService.Userdata;
    this.addListener();
    // this.currentRole = this.dataSettingService.currentRole.RoleName;

    let url = this.configService.getTelephonyServerURL() + "bar/cti_handler.php";
    console.log("url = " + url);
    this.ctiHandlerURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    this.dataSettingService.sendHeaderStatus.next(current_role + ' Dashboard');
    if(this.currentRole!='SUPERVISOR') {
      this.getAgentStatus();
      }
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.httpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }

    
  getAgentStatus() {
    this.czentrixService.getAgentStatus().subscribe((res) => {
        console.log("res", res);
        if (res && res.data.stateObj.stateName) {
          let status;
            status = res.data.stateObj.stateName;
            
            if (status.toUpperCase() === "INCALL" || status.toUpperCase() === "CLOSURE") {
                let CLI = res.data.cust_ph_no;
                let session_id = res.data.session_id;
                if (session_id !== undefined && session_id !== null && session_id !== "undefined" &&
                  session_id !== ""
                ) {
                  this.dataSettingService.onCall.next({
                    "isonCall": true
                  });
                this.router.navigate(['/outboundCallWorklist', CLI, session_id]);
                }
                
            } 
        }

    }, (err) => {
       console.log("error");
    });
}
  routeToRoleSelection() {
    // this.socketService.logOut();
    this.router.navigate(['/MultiRoleScreenComponent']);
    // this.socketService.reInstantiate();
  }


  // testing event
  testEvent() {
    //var event = new Event('message');   

    let event = new CustomEvent("message", {
      detail: {
        data: 'CampaignXfer|1234|MO',
        //data: 'Accept|456789|1289742008.5180000000|INBOUND',
        time: new Date(),
      },
      bubbles: true,
      cancelable: true
    });

    document.dispatchEvent(event);


  }

  listener(event) {
    console.log("listener invoked: " + event);
    if (event.data) {
      this.eventSpiltData = event.data.split('|');
      // alert(event.data);
    } else {
      this.eventSpiltData = event.detail.data.split('|');
    }
    // spliting test event 
    // this.eventSpiltData = event.detail.data.split('|'); 
    // spliting czntrix event
    //this.eventSpiltData = event.data.split('|'); 

    this.handleEvent();
  }

  toggleBar() {
    if (this.barMinimized)
      this.barMinimized = false;
    else
      this.barMinimized = true;
  }

  minimizeBar() {
    this.barMinimized = true;
    // this.testEvent();
  }

  handleEvent() {
    const sanitizedEventSpiltData = String(this.eventSpiltData);
    console.log(sanitizedEventSpiltData, "in dashboard");
    if (this.eventSpiltData[0] == "Accept" && this.eventSpiltData[2] != undefined && this.eventSpiltData[4] != undefined && this.eventSpiltData[4] == '1') {
      console.log("transfer event received, routing to inner page agent and then from their route to call screen");
      this.dataSettingService.onCall.next({
        "isonCall": true
      });
      this.router.navigate(['/outboundCallWorklist', this.eventSpiltData[1], this.eventSpiltData[2]]);
    }
  }

  addListener() {
    if (window.parent.parent.addEventListener) {
      console.log("adding message listener");
      addEventListener("message", this.listener.bind(this), false);
    }
    else {
      console.log("adding onmessage listener");
      //document.attachEvent("onmessage", this.listener) 
    }
  }


  activity_component: boolean = true;
  ratings_component: boolean = true;
  alerts_component: boolean = true;
  daily_tasks_component: boolean = false;
  news_component: boolean = true;
  weather_warning_component: boolean = false;
  training_resources: boolean = true;
  call_statistics: boolean = true;

  hideComponentHandeler(event) {
    console.log('event is', event);
    if (event === "1") {
      this.activity_component = false;
    }
    if (event === "2") {
      this.ratings_component = false;
    }
    if (event === "3") {
      this.alerts_component = false;
    }
    if (event === "4") {
      this.daily_tasks_component = false;
    }
    if (event === "5") {
      this.news_component = false;
    }
    if (event === "6") {
      this.weather_warning_component = false;
    }
    if (event === "7") {
      this.training_resources = false;
    }
  }

  addWidget(widget_name) {
    if (widget_name === "1") {
      this.activity_component = true;
    }
    if (widget_name === "2") {
      this.ratings_component = true;
    }
    if (widget_name === "3") {
      this.alerts_component = true;
    }
    if (widget_name === "4") {
      this.daily_tasks_component = true;
    }
    if (widget_name === "5") {
      this.news_component = true;
    }
    if (widget_name === "6") {
      this.training_resources = true;
    }
  }

  // CODE FOR SIDE NAV
  clicked: boolean = false;
  hamburgerHoverOut() {
    console.log(this.clicked);
    if (this.clicked === true) {
      const element = document.querySelector('.leftMenu');
      element.classList.toggle('openMenu');

      // const hamburger = document.querySelector('.hamburger');
      // hamburger.classList.toggle('open');

      const closeAccordion = document.getElementsByClassName('dropdown');
      let i = 0;
      for (i = 0; i < closeAccordion.length; i++) {
        closeAccordion[i].classList.remove('active');
      }

    }
    this.clicked = false;
  }

  hamburgerClick() {
    if (this.clicked === false) {
      this.clicked = true;
      const element = document.querySelector('.leftMenu');
      element.classList.toggle('openMenu');

      // const hamburger = document.querySelector('.hamburger');
      // hamburger.classList.toggle('open');

      const closeAccordion = document.getElementsByClassName('dropdown');
      let i = 0;
      for (i = 0; i < closeAccordion.length; i++) {
        closeAccordion[i].classList.remove('active');
      }
    }

  }

  ngOnDestroy() {
    if (window.parent.parent.removeEventListener) {
      console.log("removing message listener");
      removeEventListener("message", this.listener.bind(this), false);
    }
    else {
      console.log("removing onmessage listener");
      //document.attachEvent("onmessage", this.listener) 
    }

    // this.notificationSubscription.unsubscribe();
   

  }

}
