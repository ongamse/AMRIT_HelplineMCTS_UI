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
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { dataService } from '../services/dataService/data.service';
import { CallAllocationService } from '../services/supervisorService/call-configuration.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-dial-preference',
  templateUrl: './dial-preference.component.html',
  styleUrls: ['./dial-preference.component.css']
})
export class DialPreferenceComponent implements OnInit {
  dialPreferenceForm: FormGroup;
  currentLanguageSet: any;

  constructor(private formBuilder: FormBuilder, private dataService: dataService,
    private callAllocationService: CallAllocationService, private alertService: ConfirmationDialogsService,
    public httpServices:HttpServices) { }

  providerServiceMapID: any;
  dialPreferences = [
    { dialPreference: 'Auto preview dialing', isDialPreferenceManual: false },
    { dialPreference: 'Manual dialing', isDialPreferenceManual: true }
  ];
  isAutoPreviewDial: Boolean = false;

  ngOnInit() {
    this.assignSelectedLanguage();
    this.providerServiceMapID = { 'providerServiceMapID': this.dataService.currentService.serviceID };
    this.createDialPreferenceForm();
    this.dialPreferences;
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.httpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }

  get dialPreference() {
    return this.dialPreferenceForm.controls['dialPreference'].value;
  }

  get previewWindowTime() {
    return this.dialPreferenceForm.controls['previewWindowTime'].value;
  }

  createDialPreferenceForm() {
    this.dialPreferenceForm = this.formBuilder.group({
      dialPreference: [null, Validators.required],
      previewWindowTime: [null, Validators.required]
    })
  }

  checkDialPreference() {
    this.dialPreferenceForm.patchValue({
      previewWindowTime : 10
    });
    if(this.dialPreference == false) {
      this.isAutoPreviewDial = true;
    }else{
      this.isAutoPreviewDial = false;
    }
  }

  // checkWindowTime(previewWindowTimeValue) {
  //   if(previewWindowTimeValue < 10) {
  //     this.dialPreferenceForm.patchValue({
  //       previewWindowTime : 10
  //     });
  //   }
  // }
  saveDialPreference() {
    let reqObjForDialPreference = {
      "providerServiceMapID": this.providerServiceMapID.providerServiceMapID,
      "isDialPreferenceManual": this.dialPreference,
      "previewWindowTime": this.previewWindowTime
    }
    console.log("reqObjForDialPreference", reqObjForDialPreference);

    this.callAllocationService.saveDialPreference(reqObjForDialPreference).subscribe((response) => {
      console.log("reqObjForDialPreference inside service call", reqObjForDialPreference);
      console.log("Response", response);
      if (response.statusCode == 200) {
        this.alertService.alertConfirm(this.currentLanguageSet.dialPreferenceUpdatedSuccessfully, 'success');
      }
    },
      (error) => {
        console.log(error);
      });
  }
}
