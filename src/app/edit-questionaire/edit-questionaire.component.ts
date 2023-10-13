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
import { NgForm, Validators, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { QuestionaireService } from '../services/questionaireService/questionaire-service';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { ConfirmationDialogsService } from 'app/services/dialog/confirmation.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-edit-questionaire',
  templateUrl: './edit-questionaire.component.html',
  styleUrls: ['./edit-questionaire.component.css']
})
export class EditQuestionaireComponent implements OnInit {
  selectedQuestion: any;
  providerServiceMapID: any;
  showText: any;
  showTextFor: any;
  // triggerfeedback: any;
   interaction: any;
  variablename: string = '';
  variableDataType: string = '';
  variableNames = [];
  showTextFlag = false;
  showTriggerFeedbackFlag = false;
  questionRank: any;
  mandatory: any;
  dropDownOption: any;
  optionArray : any;
  dropDownOpt: any;
  questionOptionList: any[];
count:any;
show: boolean;
  optCount: number=0;
  opt: number=1;
  currentLanguageSet: any;
  constructor(@Inject(MD_DIALOG_DATA) public data: any, private alertService: ConfirmationDialogsService,public dialogRef: MdDialogRef<EditQuestionaireComponent>, private questionaireService: QuestionaireService, private dataservice: dataService, private formBuilder: FormBuilder,
  public httpServices:HttpServices) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.count=0;
    this.editQuestionsForm = this.formBuilder.group({
      newOpt: this.formBuilder.array([])
    })
    // if(this.selectedQuestion.questionnaireDetail!=undefined && this.selectedQuestion.questionnaireDetail.interaction!=undefined)
    // this.interaction=this.selectedQuestion.questionnaireDetail.interaction;
    console.log("edit data:",this.data);
    this.providerServiceMapID = this.dataservice.currentService.serviceID;
    this.selectedQuestion = this.data.selectedQuestion;
    console.log("update this data", JSON.stringify(this.selectedQuestion, null, 4));
    this.optionArray = this.selectedQuestion.questionnaireDetail.mctsQuestionValues;
    console.log("optionarray",this.optionArray);
   // console.log("!st ",this.selectedQuestion.questionnaireDetail.mctsQuestionValues[0].dropDownOptions);
    //console.log("2nd ",this.selectedQuestion.questionnaireDetail.mctsQuestionValues[1].dropDownOptions);
    this.questionaireService.getVariables({
      "providerServiceMapID": this.providerServiceMapID,
      "fieldFor": (this.selectedQuestion.outboundCallType.slice(0, -1) == "ANC") ? "Mother Data" : "Child Data"
    }).subscribe((response) => {
      this.variableNames = response.data;
      console.log('this.variableNames', this.variableNames);
    //this.newOptions.push({dropDownOption: null});
    })
    // this.Interaction = this.selectedQuestion.questionnaireDetail.interaction? this.selectedQuestion.questionnaireDetail.interaction: '';
    console.log(this.selectedQuestion.variableName);
    this.variablename = this.selectedQuestion.variableName;
    this.variableDataType = this.selectedQuestion.variableDataType;
    // console.log(this.variablename);
    this.checkShowTextValue();
    this.checkTriggerFeedbackValue();
    for (let i = 0; i < this.optionArray.length; i++) {

      this.questionOptionList = [];console.log("Ind",i);
let questionList = <FormArray>this.editQuestionsForm.controls['newOpt'];
questionList.push(this.createQuestionsOptions());
this.newOpt = questionList;
console.log("FormValues",this.editQuestionsForm.value)
      } 
   for (let i = 0; i < this.optionArray.length; i++) {

           this.newOpt.at(i).patchValue({
             "questionValuesID":this.optionArray[i].questionValuesID,
            "questionID":this.optionArray[i].questionID,
            "dropDownOptions":this.optionArray[i].dropDownOptions,
            "providerServiceMapID":this.optionArray[i].providerServiceMapID,
            "deleted":this.optionArray[i].deleted,
            "processed":this.optionArray[i].processed,
            "createdBy":this.optionArray[i].createdBy,
            "createdDate":this.optionArray[i].createdDate });
      console.log("value",this.optionArray[i].dropDownOptions);   
 }
      console.log("finalarray: ",this.newOpt);
    // }

    console.log("Answer type: ",this.selectedQuestion.questionnaireDetail.answerType);
    //this.opt=this.selectedQuestion.questionnaireDetail.mctsQuestionValues.length;
    this.opt=0;
    let arr=this.selectedQuestion.questionnaireDetail.mctsQuestionValues;
    for(var x=0;x<arr.length; x++){
      if(arr[x].deleted===false){
        this.opt++;
      }
    }
    if(this.selectedQuestion.questionnaireDetail.answerType=="DropDown")
    {
      this.optCount=50;
    }
    else if(this.selectedQuestion.questionnaireDetail.answerType=="Multiple")
    {
      this.optCount=5;
    } 
    else if(this.selectedQuestion.questionnaireDetail.answerType=="Yes/No")
    {
      this.optCount=2;
    }
    if(this.opt==this.optCount){
      this.show=true;
    } 

  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.httpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
  
  createQuestionsOptions2(): FormGroup {
    return this.formBuilder.group({ 
      questionValuesID:null,
      questionID:this.optionArray[0].questionID,
      dropDownOptions: null,
      providerServiceMapID:this.optionArray[0].providerServiceMapID,
      deleted:this.optionArray[0].deleted,
      processed:this.optionArray[0].processed,
      createdBy:this.optionArray[0].createdBy,
      createdDate:this.optionArray[0].createdDate
    });
  }
  createQuestionsOptions(): FormGroup {
    return this.formBuilder.group({ 
      questionValuesID:null,
      questionID:null,
      dropDownOptions: null,
      providerServiceMapID:null,
      deleted:null,
      processed:null,
      createdBy:null,
      createdDate:null
    });
  }
  onSubmit() {
    //this.selectedQuestion.questionnaireDetail.triggerFeedbackFor = (this.selectedQuestion.questionnaireDetail.answerType == "Yes/No" && this.selectedQuestion.questionnaireDetail.triggerFeedback) ? this.selectedQuestion.questionnaireDetail.triggerFeedbackFor : '';
    //this.selectedQuestion.questionnaireDetail.showTextFor = (this.selectedQuestion.questionnaireDetail.answerType == "Yes/No" && this.selectedQuestion.questionnaireDetail.showText) ? this.selectedQuestion.questionnaireDetail.showTextFor : '';
    //this.selectedQuestion.questionnaireDetail.interaction=this.interaction;
    // this.selectedQuestion.questionnaireDetail["triggerFeedback"] = this.triggerfeedback;
    // this.selectedQuestion.questionnaireDetail["interaction"] = this.Interaction;
    console.log("answer Type",this.newOpt);
    if(this.newOpt!=undefined)
      this.selectedQuestion.questionnaireDetail.mctsQuestionValues=this.newOpt.value;
    this.selectedQuestion["variableName"] = this.variablename;
    this.selectedQuestion["variableDataType"] = this.variablename != '' ? this.variableDataType : '';
    console.log("form",this.editQuestionsForm);
    console.log("after",this.newOpt);
    console.log(JSON.stringify(this.selectedQuestion));
    this.questionaireService.editQuestionaire(this.selectedQuestion)
      .subscribe((response) => {
        console.log(response);
        this.dialogRef.close(response);
      },
        (error) => {
          console.log(error);
          this.alertService.alert( error.errorMessage , 'error');
          this.dialogRef.close();
        });
  }

  setShowTextFlag(ev) {
    this.showTextFlag = ev.checked;
    if (this.showTextFlag) {
      console.log("this.showTextFlag############", this.showTextFlag);
      console.log("this.selectedQuestion.questionnaireDetail", JSON.stringify(this.selectedQuestion.questionnaireDetail, null, 4));

      this.selectedQuestion.questionnaireDetail.showTextFor = 'Yes';
    }
    console.log('selectedQuestion.questionnaireDetail.showText', this.selectedQuestion.questionnaireDetail.showText);

  }
  setShowTriggerFeedbackFlag(ev) {
    this.showTriggerFeedbackFlag = ev.checked;
    if (this.setShowTriggerFeedbackFlag) {
      console.log("this.setShowTriggerFeedbackFlag", this.setShowTriggerFeedbackFlag);

      this.selectedQuestion.questionnaireDetail.triggerFeedbackFor = 'Yes'
    }
  }

  resetDependentOfShowText() {
    this.variablename = '';
    this.variableDataType = '';
  }

  resetVariableDataType() {
    this.variableDataType = '';
  }
  checkShowTextValue() {
    if (this.selectedQuestion.questionnaireDetail.showText != undefined && this.selectedQuestion.questionnaireDetail.showText != null && this.selectedQuestion.questionnaireDetail.showText != '') {
      this.showTextFlag = true;
    }
  }

  checkTriggerFeedbackValue() {
    if (this.selectedQuestion.questionnaireDetail.triggerFeedback != undefined || this.selectedQuestion.questionnaireDetail.triggerFeedback != null || this.selectedQuestion.questionnaireDetail.triggerFeedback != '') {
      this.showTriggerFeedbackFlag = true;
    }
  }

  editQuestionsForm: FormGroup;
  newOpt: FormArray;

  getOpt(): FormGroup {
    for(var j=0;j<this.optionArray.length;j++)
    {
      return this.formBuilder.group({
        dropDownOptions: this.optionArray[j].dropDownOptions
      });
      //console.log("dropDownOpt",dropDownOpt)
    }
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      dropDownOptions: ''
    });
  }

  onAddOption(): void {
   // this.opt=this.selectedQuestion.questionnaireDetail.mctsQuestionValues.length;
     this.opt++; 
    console.log("onAddOption.............");
    console.log("count: ", this.optCount);
    //console.log("optionArray: ", optionArray);
    console.log("answerType: ", this.selectedQuestion.questionnaireDetail.answerType);

     if(this.selectedQuestion.questionnaireDetail.answerType=="DropDown")
     {
       this.optCount=50;
     }
     else if(this.selectedQuestion.questionnaireDetail.answerType=="Multiple")
     {
       this.optCount=5;
     } 
     else if(this.selectedQuestion.questionnaireDetail.answerType=="Yes/No")
     {
       this.optCount=2;
     }

    //  const newOption= this.formBuilder.group({
    //  dropDownOptions: [null, Validators.required]
    //  });
    //  optionArray.push(newOption);
    let quesList = <FormArray>this.editQuestionsForm.controls['newOpt'];      
    quesList.push(this.createQuestionsOptions2());
    this.newOpt=quesList;
    console.log("before",this.newOpt);
    console.log("quesList: ",quesList);

     if(this.opt==this.optCount){
       this.show=true;
       console.log("opt",this.opt);
       console.log("optCount",this.optCount);
     }    
    // this.newOpt = this.editQuestionsForm.get('newOpt') as FormArray;
    // this.newOpt.push(this.createItem());
  }
  // createQuestionsOptions(): FormGroup {
  //       return this.formBuilder.group({       
  //            option: new FormControl(''),    
  //              });  }
  onRemoveOption(i: number) {
    //alert("delete");
    this.newOpt = this.editQuestionsForm.get('newOpt') as FormArray;
    this.newOpt.at(i).patchValue({deleted:true});
    //this.newOpt.removeAt(i);
    
    if(this.opt>0){
      this.show=false;
      this.opt--;
      
    }   
    console.log("opt",this.opt);
      console.log("optCount",this.optCount);
  }
}
