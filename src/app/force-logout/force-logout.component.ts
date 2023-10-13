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


import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { ForceLogoutService } from './../services/supervisorService/forceLogoutService.service';
import { NgForm } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';


@Component({
  selector: 'app-force-logout',
  templateUrl: './force-logout.component.html',
  styleUrls: ['./force-logout.component.css']
})
export class ForceLogoutComponent implements OnInit {

  @ViewChild('flform') flform: NgForm;
  currentLanguageSet: any;

  constructor(public alertService: ConfirmationDialogsService,
    public forceLogoutService: ForceLogoutService,
    public commonData: dataService,
    public httpServices:HttpServices) { }

  ngOnInit() {
    this.assignSelectedLanguage();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.httpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }

  kickout(obj) {
    console.log(obj, 'object values');
    obj['providerServiceMapID'] = this.commonData.currentService.providerServiceMapID;
    this.forceLogoutService.forcelogout(obj)
      .subscribe(response => {
        console.log(response, 'success post force logout');
        if (response.response.toLowerCase() === 'success'.toLowerCase()) {
          this.alertService.alert(this.currentLanguageSet.userLoggedOutSuccessfully, 'success');
          this.flform.reset();
        }
      }, err => {
        console.log(err.errorMessage, 'error post force logout');
        this.alertService.alert(this.currentLanguageSet.errorOccurredPleaseTryAgain, 'error');
      })
  }

}
