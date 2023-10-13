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
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';

import { InteractionService } from '../../services/interaction-service/interaction.service';
import { QuestionaireService } from '../../services/questionaireService/questionaire-service';
import { dataService } from '../../services/dataService/data.service';
import { ConfirmationDialogsService } from '../../services/dialog/confirmation.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-edit-interaction',
  templateUrl: './edit-interaction.component.html',
  styleUrls: ['./edit-interaction.component.css']
})
export class EditInteractionComponent implements OnInit {
  editInteractionForm: FormGroup;
  variableNamesList = [];
  interactionRowData: any;
  mctsQAMapID: any;
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
  
  constructor(private formBuilder: FormBuilder, @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<EditInteractionComponent>, private interactionService: InteractionService,
    private httpServiceService: HttpServices,
    private questionaireService: QuestionaireService, private dataService: dataService, private alertService: ConfirmationDialogsService
  ) { }

  ngOnInit() {
    this.fetchLanguageResponse();
    this.createEditForm();
    console.log('this.data app-edit-interaction', JSON.stringify(this.data, null, 4));
    this.getVariables();
  }

  getVariables() {
    this.questionaireService.getVariables({
      "providerServiceMapID": this.data.selectedInteraction.providerServiceMapID,
      "fieldFor": (this.data.selectedInteraction.outboundCallType.slice(0, -1) == "ANC") ? "Mother Data" : "Child Data"
    }).subscribe((response) => {
      this.variableNamesList = response.data;
      if (this.variableNamesList.length > 0) {
        this.patchData();
      }
      console.log('this.variableNamesList', this.variableNamesList);

    })
  }

  createEditForm() {
    this.editInteractionForm = this.formBuilder.group({
      interaction: [null, Validators.required],
      variableName: null,
      variableDataType: null
    })
  }

  get interaction() {
    return this.editInteractionForm.controls['interaction'].value;
  }

  get variableName() {
    return this.editInteractionForm.controls['variableName'].value;
  }

  get variableDataType() {
    return this.editInteractionForm.controls['variableDataType'].value;
  }


  patchData() {
    this.interactionRowData = this.data.selectedInteraction;
    let variableNameValue = this.variableNamesList.filter((item) => {
      //console.log('item ', item);
      return item.dbColumnName == (this.interactionRowData.variableName);
    })[0];
    console.log('variableNameValue', this.interactionRowData, variableNameValue);
    let variableName;
    if (variableNameValue != null && variableNameValue != undefined) {
      variableName = variableNameValue.dbColumnName;
    }


    this.editInteractionForm.patchValue({
      interaction: this.interactionRowData.interaction,
      variableName: variableName,
      variableDataType: this.interactionRowData.variableDataType
    })
  }
  updateInteraction() {
    //console.log('this.variableName.excelColumnName', this.variableName, this.variableName.excelColumnName);

    this.mctsQAMapID = this.interactionRowData.mctsQAMapID;
    let temp;
    temp = Object.assign(this.interactionRowData, {
      interaction: (this.interaction !== undefined && this.interaction !== null) ? this.interaction.trim() : null,
      variableName: this.variableName,
      variableDataType: this.variableDataType,
      mctsQAMapID: this.mctsQAMapID
    })
    console.log(JSON.stringify(temp, null, 4), "Obj after edit");
    this.interactionService.editInteraction(temp).subscribe((response) => {
      if (response.statusCode == 200) {
        this.dialogRef.close(response);
        //this.alertService.alertConfirm(response.data.response, 'success');
      }
    });
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
