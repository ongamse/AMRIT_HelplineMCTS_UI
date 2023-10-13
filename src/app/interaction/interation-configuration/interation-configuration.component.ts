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


import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { MdDialog } from '@angular/material';

import { InteractionService } from '../../services/interaction-service/interaction.service';
import { CreateInteractionComponent } from '../create-interaction/create-interaction.component';
import { EditInteractionComponent } from '../edit-interaction/edit-interaction.component';
import { ConfirmationDialogsService } from '../../services/dialog/confirmation.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-interation-configuration',
  templateUrl: './interation-configuration.component.html',
  styleUrls: ['./interation-configuration.component.css']
})
export class InterationConfigurationComponent implements OnInit {
  interactionConfigForm: FormGroup;

  @Input('interactionData')
  interactionData: any;

  @Output() showPrev: EventEmitter<any> = new EventEmitter<any>();
  res: any;
  interactionDataList = [];
  interactionRequestObj: any;
  interactionFlag: Boolean = false;
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
  

  constructor(private formBuilder: FormBuilder, private interactionService: InteractionService,
    private httpServiceService: HttpServices,
    public dialog: MdDialog, private alertService: ConfirmationDialogsService
  ) { }

  ngOnInit() {
    this.fetchLanguageResponse();
    this.createInteractionConfigForm();
    this.patchData();
  }

  ngOnChanges() {
    this.interactionData;
    console.log('this.interactionData in ngOnit()', this.interactionData);
    this.interactionRequestObj = {
      'questionID': this.interactionData.questionID,
      'providerServiceMapID': this.interactionData.providerServiceMapID,
      'outboundCallType': this.interactionData.outboundCallType,
      'displayOBCallType': this.interactionData.displayOBCallType,
      'effectiveFrom': this.interactionData.effectiveFrom
    };
    console.log('interactionRequestObj', this.interactionRequestObj);
    this.searchInteractionData();

  }

  get outboundCallType() {
    return this.interactionConfigForm.controls['outboundCallType'].value;
  }

  get question() {
    return this.interactionConfigForm.controls['question'].value;
  }

  createInteractionConfigForm() {
    this.interactionConfigForm = this.formBuilder.group({
      outboundCallType: new FormControl({ value: null, disabled: true }, Validators.required),
      question: new FormControl({ value: null, disabled: true }, Validators.required)
    })
    console.log('interactionData :', this.interactionData);

  }

  patchData() {
    this.interactionConfigForm.patchValue({
      outboundCallType: this.interactionData.displayOBCallType,
      question: this.interactionData.questionnaireDetail.question
    })
  }


  searchInteractionData() {
    this.interactionService.getInteractionList(this.interactionRequestObj).subscribe((response) => {
      console.log("Interaction Data List: ", response);
      console.log("Json data of response: ", JSON.stringify(response, null, 4));
      if (response.statusCode == 200) {
        this.interactionDataList = response.data;
        console.log('interactionDataList.length', this.interactionDataList.length);
      }
    })
  }

  createInteraction() {

    let createInteractionDialog = this.dialog.open(CreateInteractionComponent, {
      disableClose: true,
      width: 0.8 * window.innerWidth + "px",
      panelClass: 'dialog-width',
      data: {
        //'interactionDataList': this.interactionDataList
        'interactionRequestObj': this.interactionRequestObj
      }
    });
    createInteractionDialog.afterClosed()
      .subscribe((response) => {
        console.log('After closing', response);
        this.interactionDataList = [];
        this.searchInteractionData();
      })
  }

  editInteraction(interactionData, event) {
    event.preventDefault();
    console.log(interactionData);
    let editDialog = this.dialog.open(EditInteractionComponent, {
      disableClose: true,
      width: 0.8 * window.innerWidth + "px",
      panelClass: 'dialog-width',
      // height: "400px",
      // width: '600px',
      data: {
        "selectedInteraction": interactionData
      }
    });
    editDialog.afterClosed()
      .subscribe((response) => {
        console.log(response);
        if (response) {
          this.alertService.alert(response.data.response, 'success');
          //refreshing screen after dialog closes
          this.interactionService.getInteractionList(this.interactionRequestObj)
            .subscribe((response) => {
              // this.listDisplay = true;
              console.log(response.data);
              //this.questionrows = response.data.questions;      
            },
              (error) => {
                console.log(error);
              });
        }
      },
        (error) => {
          console.log(error);
        })
  }

  deleteInteraction(interactionData, event) {
    event.preventDefault();
    console.log('Interaction Data for delete', interactionData);
    this.alertService.confirm('', this.currentLanguageSet.areYouSureYouWantToDelete)
      .subscribe((response) => {
        if (response) {
          this.interactionService.deleteInteraction({
            "mctsQAMapID": interactionData.mctsQAMapID
          }).subscribe((response) => {
            console.log('Response after delete', response);
            if (response) {
              console.log(response);
              this.alertService.alert(response.data.response, 'success');
              //refreshing screen after dialog closes
              this.interactionDataList = [];

              this.interactionService.getInteractionList(this.interactionRequestObj)
                .subscribe((response) => {
                  // this.listDisplay = true;
                  console.log('dfstyfdgsfhugshghjsgdhgshydgchjgdfhgwhg get inteation data list', JSON.stringify(response.data, null, 4));
                  this.interactionDataList = response.data;
                  //this.questionrows = response.data.questions;      
                },
                  (error) => {
                    console.log(error);
                  });
            }
          },
            (error) => {
              console.log(error);
            });
        }
      });
  }
  navigateToPrev() {
    console.log("here");
    this.showPrev.emit(true);
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
