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
import { Router } from '@angular/router';
import { CzentrixServices } from '../services/czentrixService/czentrix.service';
import { loginService } from '../services/loginService/login.service';
import { SocketService } from '../services/socketService/socket.service';
import { AuthService } from '../services/authentication/auth.service';
import { PlatformLocation } from '@angular/common';
import { EmergencyContactsViewModalComponent } from '../emergency-contacts-view-modal/emergency-contacts-view-modal.component';
import { MdDialog } from '@angular/material';
import { AgentForceLogoutComponent } from '../agent-force-logout/agent-force-logout.component';
import { ConfigService } from '../services/config/config.service';
import { ViewVersionDetailsComponent } from '../view-version-details/view-version-details.component';
import { HttpServices } from '../services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-multi-role-screen',
  templateUrl: './multi-role-screen.component.html',
  styleUrls: ['./multi-role-screen.component.css']
})
export class MultiRoleScreenComponent implements OnInit {

  current_role: any;
  current_service: any;
  id: any;
  license: any;
  commitDetails: any;
  languages = [];
  label = "Role Selection";
  showContacts: boolean;
  commitDetailsPath: any = "assets/git-version.json";
  uiVersionDetails: any;
  languageArray: any;
  language_file_path: any = "./assets/";
  app_language: any = "English";
  currentLanguageSet: any;
  languageComponent: SetLanguageComponent;
  

  constructor(public config: ConfigService,private httpServiceService: HttpServices, public getCommonData: dataService, public router: Router, private czentrixService: CzentrixServices,
    private loginService: loginService, private socketService: SocketService, private authService: AuthService,
    private location: PlatformLocation, private dialog: MdDialog,
    public httpServices:HttpServices) {
    location.onPopState((e: any) => {
      console.log(e);
      window.history.forward();

    })
  }

  data: any;
  ngOnInit() {
    
    this.assignSelectedLanguage();
    this.data = this.getCommonData.Userdata;
    this.current_role = (this.getCommonData.currentRole) ? this.getCommonData.currentRole.RoleName : "";
    this.current_service = (this.getCommonData.currentService) ? this.getCommonData.currentService.serviceName : "";
    this.id = this.czentrixService.agent_id;
    this.getCommonData.roleSelected.subscribe((obj) => {
      console.log("Object in role selection", JSON.stringify(obj));

      this.id = obj['id'];
      this.current_role = obj['role'];
      this.current_service = obj['service'];
    })
    this.loginService.getLanguages()
      .subscribe((response) => {
        console.log(response.data);
        this.languages = response.data["m_language"]
      },
      (error) => {
        console.log(error);
      })

    this.getCommonData.sendHeaderStatus.subscribe((data) => { setTimeout(() => { this.setHeaderName(data) }) });
    this.getLicense();
    this.getCommitDetails();
    this.fetchLanguageSet();

  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.httpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    this.app_language=this.getCommonData.appLanguage;
	  }

  setHeaderName(data) {
    this.label = data;
    if (this.label.includes('Dashboard')) {
      this.showContacts = true;
    }
    else {
      this.showContacts = false;
    }
  }

  logOut() {

    this.ipSuccessLogoutHandler();

  }
  ipSuccessLogoutHandler() {
   
    this.czentrixService.agentLogout(this.czentrixService.agent_id, this.czentrixService.ip).subscribe((res) => {
      sessionStorage.removeItem("setLanguage");
      this.getCommonData.appLanguage="English";
      this.loginService.userLogout().subscribe(response => this.handleSuccess(response));
      this.router.navigate(['']);
      this.authService.removeToken();
      // this.socketService.logOut();
    }, (err) => {
      sessionStorage.removeItem("setLanguage");
      this.getCommonData.appLanguage="English";
      this.loginService.userLogout().subscribe(response => this.handleSuccess(response));
      this.router.navigate(['']);
      this.authService.removeToken();
      // this.socketService.logOut();
    });
  }
  handleSuccess(res) {
    console.log("redis token removed")
  }
  showEmergencyContacts() {
    this.dialog.open(EmergencyContactsViewModalComponent, {
      width: '700px',
      //height: '550px'
      disableClose: true
    });
  }

  agentForceLogout() {
    this.dialog.open(AgentForceLogoutComponent, {
      width: '500px',
      disableClose: true
    });
  }
  getLicense() {
    let getPath = this.config.getCommonBaseURL();
    this.license = getPath + "license.html";
  }
  getCommitDetails() {
    this.httpServices.getCommitDetails(this.commitDetailsPath).subscribe((res) => this.successhandeler(res), err => this.successhandeler(err));
  }
  successhandeler(response) {
    this.commitDetails = response;
    this.uiVersionDetails = {
      'Version': this.commitDetails['version'],
      'Commit': this.commitDetails['commit']
    }
  }

  viewVersionDetails() {
    this.loginService.getApiVersionDetails().subscribe((apiResponse) => {
      console.log("apiResponse", apiResponse);
      if (apiResponse.statusCode == 200) {
        let api_versionDetails = {
          'Version': apiResponse.data['git.build.version'],
          'Commit': apiResponse.data['git.commit.id']
        }
        if (api_versionDetails) {
          this.openVersionDialogComponent(api_versionDetails);
        }
      }
    }), (err) => {
      console.log(err, "error");
    }
  }
  openVersionDialogComponent(api_versionDetails) {
    this.dialog.open(ViewVersionDetailsComponent, {
      width: "80%",
      data: {
        uiversionDetails: this.uiVersionDetails,
        api_versionDetails: api_versionDetails
      }
    })
  }
/*Methods for multilingual implementation SH20094090*/
  fetchLanguageSet() {
    this.httpServices.fetchLanguageSet().subscribe((languageRes) => {
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
    
    this.httpServices.getLanguage(this.language_file_path+language+".json").subscribe(response => {
      if(response){
        this.languageSuccessHandler(response,language)
      }else{
        alert(this.currentLanguageSet.langNotDefinesd)
      }      
    },error => {
      alert(this.currentLanguageSet.comingUpWithThisLang + " " + language);
      
    }
    );
  }

  languageSuccessHandler(response, language) {
    console.log("language is ", response);
    if (response == undefined) {
      alert(this.currentLanguageSet.langNotDefinesd)
    }

    if (response[language] != undefined) {
      this.currentLanguageSet = response[language];
      sessionStorage.setItem('setLanguage', language);
      if (this.currentLanguageSet) {
        this.languageArray.forEach(item => {
          if (item.languageName == language) {
            this.app_language = language;
            this.getCommonData.appLanguage=language;
          
          }

        });
      } else {
        this.app_language = language;
        this.getCommonData.appLanguage=language;
      }
     
      this.httpServices.getCurrentLanguage(response[language]);
    } else {
      alert(this.currentLanguageSet.comingUpWithThisLang + " " + language);
    }
  }
  checkForNull(languageResponse) {
    return languageResponse !== undefined && languageResponse !== null;
  }
  /*END - Methods for multilingual implementation*/

  
}
