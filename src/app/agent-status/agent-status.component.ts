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
import { dataService } from '../services/dataService/data.service';
import { ConfigService } from "../services/config/config.service";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-agent-status',
  templateUrl: './agent-status.component.html',
  styleUrls: ['./agent-status.component.css']
})
export class AgentStatusComponent implements OnInit {

  agentStausScreenURL: any;
  currentLanguageSet: any;

  constructor(private saved_data: dataService,
  private _config: ConfigService,
  public sanitizer: DomSanitizer,public httpServices:HttpServices) { }

  selection: any = "";
  onlineAgents: any;
  logoutRes: any;

  ngOnInit() {
   // this.getOnlineAgents();
  this.agentStausScreenURL = this._config.getTelephonyServerURL()+'remote_login.php?username='+this.saved_data.Userdata.userName+"&key="+this.saved_data.loginKey;
  this.agentStausScreenURL = this.sanitizer.bypassSecurityTrustResourceUrl( this.agentStausScreenURL );
  console.log("agentStausScreenURL: "+this.agentStausScreenURL);
  }
  ngDoCheck() {
		this.assignSelectedLanguage();
	  }
	
	  assignSelectedLanguage() {
			const getLanguageJson = new SetLanguageComponent(this.httpServices);
			getLanguageJson.setLanguage();
			this.currentLanguageSet = getLanguageJson.currentLanguageObject;
		  }
/*
  getOnlineAgents() {
    this.czentrixServices.getOnlineAgents("4002", "10.208.93.249").subscribe(response => this.onlineAgents = this.successhandler(response));
  }

  agentLogout() {
    this.czentrixServices.agentLogout("4004", "10.208.93.249").subscribe(response => this.logoutRes = this.successhandler(response));
  }

  successhandler(response) {
    return response.response;
  } */

}
