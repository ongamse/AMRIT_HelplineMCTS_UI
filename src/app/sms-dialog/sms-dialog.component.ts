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


import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-sms-dialog',
  templateUrl: './sms-dialog.component.html',
  styleUrls: ['./sms-dialog.component.css']
})
export class SmsDialogComponent implements OnInit {

  altNoCheck: boolean = false;
  alternateNumber: any;
  smsText: any = '';
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
  

  constructor(private httpServiceService: HttpServices,
    @Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<SmsDialogComponent>) { }

  ngOnInit() {
    this.fetchLanguageResponse();
  }

  sendSms(){
    console.log(this.smsText,this.altNoCheck,this.alternateNumber);
    var obj = {};
    obj["smsText"] = (this.smsText !== undefined && this.smsText !== null) ? this.smsText.trim() : null;
    obj["altNoCheck"] = this.altNoCheck;
    obj["alternateNumber"] = (this.alternateNumber !== undefined && this.alternateNumber !== null) ? this.alternateNumber.trim() : null;
    this.dialogRef.close(obj);
  }

  //AN40085822 23/10/2021 Integrating Multilingual Functionality --Start--
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
