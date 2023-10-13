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


import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';

import { InteractionService } from '../../services/interaction-service/interaction.service';
import { dataService } from '../../services/dataService/data.service';
import { QuestionaireService } from '../../services/questionaireService/questionaire-service';
import { ConfirmationDialogsService } from '../../services/dialog/confirmation.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-create-interaction',
  templateUrl: './create-interaction.component.html',
  styleUrls: ['./create-interaction.component.css']
})
export class CreateInteractionComponent implements OnInit {
  createInteractionForm: FormGroup;
  variableNamesList = [];
  newInteractionArray = [];
  postInteractionArray = [];
  interactionReqObj: any;
  createdBy: any;
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
  
  constructor(private formBuilder: FormBuilder, @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<CreateInteractionComponent>, private interactionService: InteractionService,
    private httpServiceService: HttpServices,
    private questionaireService: QuestionaireService, private dataService: dataService, private alertService: ConfirmationDialogsService
  ) { }

  ngOnInit() {
    this.fetchLanguageResponse();
    this.createForm();
    console.log('this.data app-create-interaction', JSON.stringify(this.data, null, 4));
    console.log('this.data app-create-interaction', JSON.stringify(this.data.interactionRequestObj, null, 4));
    this.createdBy = this.dataService.uname;
    //this.interactionReqObj = this.data.interactionReqObj[0];
    this.interactionReqObj = this.data.interactionRequestObj;
    this.questionaireService.getVariables({
      "providerServiceMapID": this.interactionReqObj.providerServiceMapID,
      "fieldFor": (this.interactionReqObj.outboundCallType.slice(0, -1) == "ANC") ? "Mother Data" : "Child Data"
    }).subscribe((response) => {
      this.variableNamesList = response.data;
      console.log('this.variableNamesList', this.variableNamesList);

    })


  }

  createForm() {
    this.createInteractionForm = this.formBuilder.group({
      interaction: [null, Validators.required],
      variableName: null,
      variableDataType: null,
    })
  }

  get interaction() {
    return this.createInteractionForm.controls['interaction'].value;
  }

  get variableName() {
    return this.createInteractionForm.controls['variableName'].value;
  }

  get variableDataType() {
    return this.createInteractionForm.controls['variableDataType'].value;
  }

  addInteraction() {
    console.log('variableName',this.variableName);
    
    let tempObj = {
      "createdBy": this.createdBy,
      "interaction": this.interaction.trim(),
      "variableName": this.variableName,
      "variableDataType": this.variableDataType,
      "questionID": this.interactionReqObj.questionID,
      "providerServiceMapID": this.interactionReqObj.providerServiceMapID,
      "outboundCallType": this.interactionReqObj.outboundCallType,
      "displayOBCallType": this.interactionReqObj.displayOBCallType,
      "effectiveFrom": this.interactionReqObj.effectiveFrom,
      "effectiveUpto": this.interactionReqObj.effectiveUpto
    }
    console.log(tempObj);
    this.newInteractionArray.push(tempObj);
    console.log('this.newInteractionArray', JSON.stringify(this.newInteractionArray, null, 4));
    this.createInteractionForm.reset();
  }

  removeInteraction(index) {
    this.newInteractionArray.splice(index, 1);
  }

  saveInteractions() {
    console.log('New interaction Array: ', JSON.stringify(this.newInteractionArray, null, 4));
    this.interactionService.saveInteractions(this.newInteractionArray).subscribe((response) => {
      if (response.statusCode == 200) {
        console.log('response for save: ', JSON.stringify(response));
        this.alertService.alertConfirm(response.data.response, 'success');
        this.dialogRef.close(response);
      }
    })
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
