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


import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';


//inner-questioner-modal
@Component({
  selector: 'app-inner-questioner-modal',
  templateUrl: './questionaire-modal.component.html',
  styleUrls: ['./questionaire-modal.component.css']
  //providers:[OCWService]
})

export class InnerQuestionerModalComponent implements OnInit {

  @ViewChild('questionaireForm') questionaireForm: NgForm;
  languageComponent: SetLanguageComponent;
  
  currentLanguageSet: any;

  constructor(@Inject(MD_DIALOG_DATA) public data: any,private httpServiceService: HttpServices,public dialogRef: MdDialogRef<InnerQuestionerModalComponent>) { }

  ngOnInit() {
    this.fetchLanguageResponse();
  }

  onSubmit(){
	  console.log(this.questionaireForm.value);
	  this.dialogRef.close(this.questionaireForm.value);
  }
//BU40088124 23/10/2021 Integrating Multilingual Functionality --Start--
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
