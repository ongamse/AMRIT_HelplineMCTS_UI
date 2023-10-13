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


import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { QuestionaireService } from '../services/questionaireService/questionaire-service';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
// import { json } from 'd3';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';
// import { RowPlaceholder } from '@angular/cdk';

@Component({
  selector: 'app-add-questionaire',
  templateUrl: './add-questionaire.component.html',
  styleUrls: ['./add-questionaire.component.css']
})
export class AddQuestionaireComponent implements OnInit {

  providerServiceMapID: any;
  createdBy: any;
  userId: any;
  variableNames = [];
  questionsForm: FormGroup;
  questionArrayList: any;
  optionArrayList: any;
  //newOption: any;
  index: number;
  index2: number;
  dropDownOptions:any;
  dateSelectors: Date;
  show: boolean;
  count: number=0;
  opt: number=1;
  rank: boolean=false;
  currentLanguageSet: any;
  // postData = [];
  // // newQuestionArray: FormArray;
  // filteredOptions: Observable<Object[]>;

  // QuestionList:any;

  constructor(private formBuilder: FormBuilder, public httpServices:HttpServices,
    private changeDetectorRef: ChangeDetectorRef, @Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<AddQuestionaireComponent>, private commonDataService: dataService, private QuestionaireService: QuestionaireService) { }

  ngOnInit() {
    this.serviceCall();
    this.getVariablesList();
    this.questionsForm = this.createQuestionsForm();
    this.onAddRow();
    //this.onAddOption();
    this.dateSelectors = new Date();
  }

  serviceCall() {
    this.providerServiceMapID = this.commonDataService.currentService.serviceID;
    this.createdBy = this.commonDataService.uname;
    this.userId = this.commonDataService.uid;
  }
  ngDoCheck() {
		this.assignSelectedLanguage();
	  }
	
	  assignSelectedLanguage() {
			const getLanguageJson = new SetLanguageComponent(this.httpServices);
			getLanguageJson.setLanguage();
			this.currentLanguageSet = getLanguageJson.currentLanguageObject;
		  }
  getVariablesList() {
    this.QuestionaireService.getVariables({
      "providerServiceMapID": this.providerServiceMapID,
      "fieldFor": (this.data.outboundCallType.slice(0, -1) == "ANC") ? "Mother Data" : "Child Data"
    }).subscribe((response) => {
      //console.log(JSON.stringify(response));
      this.variableNames = response.data;
      console.log("variable name list",this.variableNames)
      this.variableNames.forEach((element, index) => {
        if (element.dbColumnName === 'EDD') {
          this.variableNames.splice(index, 1);
        }
      });
    });
  }

  createQuestionsForm() {
    return this.formBuilder.group({
      newQuestions: new FormArray([])
      //newOption: this.formBuilder.array([])
    })
  }

  newQstn:FormGroup;

  newQstns(): FormArray {
    return this.newQstn.get("newQuestions") as FormArray
  }
  newOpt() : FormArray {
    return this.createItem().get("newOption") as FormArray
  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      questionRank: [null, Validators.required],
      mandatory: false,
      question: [null, Validators.required],
      interaction: null,
      answerType: 'Yes/No',
      showText: false,
      showTextFor: 'Yes',
      triggerFeedback: false,
      triggerFeedbackFor: 'Yes',
      variableName: null,
      variableDataType: null,
      newOption: this.formBuilder.array([this.formBuilder.group({
        dropDownOptions: null,
        isDisabled: false
     })])
      //dropDownOptions: null
    })
  }
  onAddRow() {
    this.questionArrayList = [];
    let questionList = <FormArray>this.questionsForm.controls['newQuestions'];
    questionList.push(this.createItem());
    this.questionArrayList = questionList;
    this.opt=1;  
    this.count = 0;
  }

  onDeleteRow(index) {
    let questionList = <FormArray>this.questionsForm.controls['newQuestions'];
    questionList.removeAt(index);
  }

  resetDependentOfShowText(newQuestion: FormGroup) {
    newQuestion.patchValue({ variableName: null, variableDataType: null });
  }

  onSubmit() {
    let questionlistValue = this.questionsForm.value;
    let postQuestionList = this.iterateArray(questionlistValue);
    this.QuestionaireService.putQuestionaire(postQuestionList)
      .subscribe((response) => {
        console.log(response.data);
        this.dialogRef.close(response);
      },
        (error) => {
          console.log(error);
          this.dialogRef.close();
        });
  }

  iterateArray(questionlistValue) {
    let postQuestionList = [];
    questionlistValue.newQuestions.forEach((question) => {
      const questionObj = {
        "displayOBCallType" : this.data.displayOBCallType,
        "providerServiceMapID": this.providerServiceMapID,
        "createdBy": this.createdBy,
        "outboundCallType": this.data.outboundCallType,
        "effectiveFrom": this.data.effectiveFrom,
        "effectiveUpto": this.data.effectiveUpto,
        "variableName": question.variableName ? question.variableName : null,
        "variableDataType": question.variableName ? question.variableDataType : null,
        "questionnaireDetail": {
          "questionRank": Number(question.questionRank),
          "question": (question.question !== undefined && question.question !== null) ? question.question.trim() : null,
          "isMandatory":question.mandatory,
          "questionOptions":question.newOption,
          "answerType": question.answerType,
          "showText": question.showText,
          "showTextFor": question.showTextFor,
          "triggerFeedback": question.triggerFeedback,
          "triggerFeedbackFor": (question.answerType == "Yes/No" && question.triggerFeedback) ? question.triggerFeedbackFor : null,
          "interaction": (question.interaction !== undefined && question.interaction !== null) ? question.interaction.trim() : null,
          "createdBy": this.createdBy,
          "providerServiceMapID": this.providerServiceMapID
        }
      };
      postQuestionList.push(questionObj);
    })
    return postQuestionList
  }
  checkRank(rank,event){
   // alert(rank);
   
    if(this.questionsForm.controls.questionRank!=undefined){
    if(this.questionsForm.controls.questionRank.value.length >10)
    {
      this.rank=true;
      this.questionsForm.patchValue({questionRank:null});
    }
    else
    this.rank=false;
    if(isNaN(rank))
    {
      this.rank=true;
      this.questionsForm.patchValue({questionRank:null});
    }
    else{
      if(this.questionsForm.controls.questionRank.value<=0)
     { 
       this.rank=true;
       this.questionsForm.patchValue({questionRank:null});
      }
      else
      this.rank=false;
    }
  }
  else if(this.questionsForm.controls.questionRank.value===undefined||this.questionsForm.controls.questionRank.value===null||this.questionsForm.controls.questionRank.value==="")
  this.rank=false;
  }
  onAddOption(optionArray: FormArray, index: number) {
   this.opt=optionArray.length+1; 
     console.log("onAddOption.............");
     console.log("count: ", this.count);
     console.log("optionArray: ", optionArray);
     console.log("answerType: ", this.questionsForm.value.newQuestions[index].answerType);

      if(this.questionsForm.value.newQuestions[index].answerType=="DropDown")
      {
        this.count=50;
      }
      else if(this.questionsForm.value.newQuestions[index].answerType=="Multiple")
      {
        this.count=5;
      } 
      else if(this.questionsForm.value.newQuestions[index].answerType=="Yes/No")
      {
        this.count=2;
      }

    this.show = false;

    if (this.opt == this.count) {
      this.show = true;
      optionArray.controls.forEach((element, index) => {
        if (element) {
          element.patchValue({ isDisabled: true });
        }
      });
    }
    const newOption = this.formBuilder.group({
      dropDownOptions: [null, Validators.required],
      isDisabled: this.show
    });
    optionArray.push(newOption);
  }
  
   createOption(): FormGroup{
    console.log("createOption.............");
    return this.formBuilder.group({
      dropDownOptions: [null, Validators.required],
      isDisabled: false
   });
  }

  onRemoveOption(optionArray: FormArray, index: number){
     console.log("onRemoveOption.............");
    // let optionList = <FormArray>this.formBuilder.array([this.createOption()]);
    // optionList.removeAt(index);
    optionArray.removeAt(index);
    console.log("opt is: ", this.opt);
    if(this.opt===this.count){
      this.show=false;
    }
    this.opt--;
    let lastindex = optionArray.length-1;
    optionArray.controls.forEach((element, index) => {
      if (index <= lastindex ) {
        console.log("removecondition");
        
        element.patchValue({ isDisabled: false });
      }
    });
  }

  resetAnswerType(index: number){
    console.log("answerType: ", this.questionsForm.value.newQuestions[index].answerType);
    this.opt=1;   
    this.show=false; 
   
      const control = <FormArray>this.questionsForm.get(['newQuestions',index,'newOption']);
      console.log("control len: ", control.length);
      control.controls.forEach((element, index) => {       
          element.patchValue({ isDisabled: false });
      });
      let len=control.length;
      if(this.questionsForm.value.newQuestions[index].answerType=="DropDown" || this.questionsForm.value.newQuestions[index].answerType=="Multiple" || this.questionsForm.value.newQuestions[index].answerType=="Yes/No")
      {
        console.log("answerType comp: ", this.questionsForm.value.newQuestions[index].answerType);
            if (control.length >= 1)    
            {
                for(let i=0;i<=len;i++)   
                {     
                  control.removeAt(1);  
                  console.log("option removed: ", i);
                } 
                  //control.removeAt(1);       
            }
            else{
                this.onAddOption(control, index);
              }
            control.at(0).patchValue({"dropDownOptions": null });
      }
      else{
          for(let i=0;i<=len;i++)   
          {     
            control.removeAt(0);  
            console.log("option removed: ", i);
          } 
      }
   }
}
