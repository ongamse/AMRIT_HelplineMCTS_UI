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
import { Router, ActivatedRoute } from '@angular/router';
import { CzentrixServices } from '../services/czentrixService/czentrix.service';
import { loginService } from '../services/loginService/login.service';
import { SocketService } from '../services/socketService/socket.service';
import { AuthService } from '../services/authentication/auth.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';
declare var jQuery: any;


@Component({
  selector: 'app-innerpage',
  templateUrl: './innerpage.component.html',
  styleUrls: ['./innerpage.component.css']
})
export class InnerpageComponent implements OnInit {
  data: any;
  current_role: any;
  current_service: any;
  id: any;
  languages = [];
  current_roleName = this.getCommonData.currentRole.RoleName;
  currentLanguageSet: any;
  languageArray: any;
  language_file_path: any = "./assets/";
  app_language: any = "English";


  constructor(public getCommonData: dataService, public route: ActivatedRoute, private czentrixService: CzentrixServices, public router: Router,
    private loginService: loginService, private authService: AuthService, private socketService: SocketService,
    public httpServices:HttpServices) {
    this.data = this.getCommonData.Userdata;
    this.current_role = this.getCommonData.currentRole.RoleName;
    this.current_service = this.getCommonData.currentService.serviceName;
    this.id = this.czentrixService.agent_id;
  }


  ngOnInit() {
    this.assignSelectedLanguage();

    this.route.queryParams.subscribe((params) => {
      this.Activity_Number = params['number'];
    });

    this.loginService.getLanguages()
      .subscribe((response) => {
        console.log(response.data);
        this.languages = response.data["m_language"]
      },
      (error) => {
        console.log(error);
      });

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
  Activity_Number: any;

  show(value) {
    this.Activity_Number = value;
  }

  moveToDashboard() {
    this.router.navigate(['/MultiRoleScreenComponent', { outlets: { 'postLogin_router': ['dashboard', { role: "Supervisor" }] } }]);
  }

  logOut() {

    this.ipSuccessLogoutHandler();

  }
  ipSuccessLogoutHandler() {
    sessionStorage.removeItem("setLanguage");
 this.getCommonData.appLanguage="English";
    this.loginService.userLogout().subscribe(response => {
      this.router.navigate(['']);
      this.authService.removeToken();
      // this.socketService.logOut();
    }, (err) => {
      sessionStorage.removeItem("setLanguage");
      this.getCommonData.appLanguage="English";
      this.router.navigate(['']);
      this.authService.removeToken();
      // this.socketService.logOut();
    });
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
