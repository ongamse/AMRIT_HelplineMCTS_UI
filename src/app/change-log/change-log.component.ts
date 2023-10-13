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
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { OCWService } from '../services/mcts-agent/outbond-call-worklist/outbond-call-worklist.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { CallClosureService } from '../services/mcts-agent/call-closure/call-closure.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-change-log',
  templateUrl: './change-log.component.html',
  styleUrls: ['./change-log.component.css']
})
export class ChangeLogComponent implements OnInit {

  changeLog = [];
  requestObj: any;
  currentLanguageSet: any;

  constructor(private formBuilder: FormBuilder, @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<ChangeLogComponent>, private oCWService: OCWService,
    private alertService: ConfirmationDialogsService,
    private callClosureService: CallClosureService,public httpServices:HttpServices) { }

  ngOnInit() {

    console.log('callHistory popup: ', this.data.callHistory);
    this.requestObj = this.data.request_obj;
    this.getCallHistory(this.requestObj);
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
        const getLanguageJson = new SetLanguageComponent(this.httpServices);
        getLanguageJson.setLanguage();
        this.currentLanguageSet = getLanguageJson.currentLanguageObject;
      }
  getCallHistory(obj) {
    this.callClosureService.getChangeLog(obj)
      .subscribe((response) => {
        this.changeLog = response.data;
      },
      (error) => {
        console.log('this.callHistory = response.data: ', error);
      })
  }

}
