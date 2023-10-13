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


import { Component, OnInit, Input, Inject } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { QuestionaireService } from '../services/questionaireService/questionaire-service';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { ConfirmationDialogsService } from 'app/services/dialog/confirmation.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-map-questionaire',
  templateUrl: './map-questionaire.component.html',
  styleUrls: ['./map-questionaire.component.css']
})
export class MapQuestionaireComponent implements OnInit {
  @Input() benificiaryData: any;
  providerServiceMapID: any;
  selectedCallType: any;
  callTypes = [];
  interaction: any;
  answers = [];
  // filteredDiseaseSummaryList: any = [];
  // diseaseSummaryList: any = [];

  questionOne: any;
  questionTwo: any;
  answerType: any;
  answerTypeOne: any;
  answerTypeTwo: any;

  questionrows = [];
  formBuilder: FormBuilder = new FormBuilder();
  mappingForm: FormGroup;
  searchTerm: any;
  dispSave: any;
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
  
  constructor(private dataService: dataService, private questionaireService: QuestionaireService, @Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<MapQuestionaireComponent>, private httpServiceService: HttpServices,private alertService: ConfirmationDialogsService ) { 
    this.mappingForm = this.formBuilder.group({
      //questions: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.fetchLanguageResponse();
    this.questionsWorkList("");
  }

  //data: any = [];
  //filterTerm;

  questionsWorkList(value) {
    // let reqObj = {
    //   "mctsQAMappingDetail": {
    //     "providerServiceMapID": this.data.providerServiceMapID,
    //     "outboundCallType": this.data.outboundCallType,
    //     "effectiveFrom": this.data.effectiveFrom
    //   }

    // };
    // this.questionaireService.getQuestionaire(reqObj).subscribe((response) => {
    //   console.log("ques Response", response.data);
    //   this.questionrows = response.data.questions;
      //console.log("question rows getQuestionaire putCallResponse", JSON.stringify(this.questionrows, null, 4));
   // });
  //  this.questionrows = this.data.questionrows.filter(ques => {
  //     ques.questionnaireDetail.answerType==='DropDown' || ques.questionnaireDetail.answerType==='Yes/No'  ;
  // });
  if(value === "child")
  {
    this.questionrows = this.data.questiondata.filter(ques => {
      return  ques.questionnaireDetail.answerType=="DropDown" || ques.questionnaireDetail.answerType=='Yes/No'
      ||ques.questionnaireDetail.answerType=="Date"||ques.questionnaireDetail.answerType=="Text"
      ||ques.questionnaireDetail.answerType=="Date & Time" ||ques.questionnaireDetail.answerType=="Multiple"||ques.questionnaireDetail.answerType=="Time"  ;
     });  
  }
  else
   this.questionrows = this.data.questiondata.filter(ques => {
      return  ques.questionnaireDetail.answerType=="DropDown" || ques.questionnaireDetail.answerType=='Yes/No'  ;
     });  
     //this.questionrows = this.data.questiondata;
   console.log("entire: ",this.questionrows);
  }

  questionsList: any = [];
  filteredQuestionList: any = [];

  filterQuestionsList(searchTerm: any,value: any) {
    this.questionsWorkList(value);
     console.log("items are: ",searchTerm);
      // if (searchTerm)
	  	// {
        if((searchTerm !=undefined||searchTerm !=null)&&(searchTerm.questionnaireDetail !=undefined)){
          searchTerm=searchTerm.questionnaireDetail.question;
        }
       this.questionrows=this.questionrows;
       console.log("search reponse of rows:",this.questionrows);
       if(searchTerm ===undefined){
         searchTerm="";}
        this.questionrows = this.questionrows.filter(ques => {
            return ques.questionnaireDetail.question.toLowerCase().startsWith((searchTerm!=undefined||searchTerm!=null||searchTerm!="") ? searchTerm.toLowerCase():searchTerm);
      });
      console.log("search reponse is",this.questionrows);
    //}
    // else {
    //   this.questionrows = this.data.questiondata.filter(ques => {
    //     return  ques.questionnaireDetail.answerType=="DropDown" || ques.questionnaireDetail.answerType=='Yes/No'  ;
    //    }); 
    //    }

      //  if(quesID==1)
      //  searchTerm= null;

      //  this.answerTypeOne = this.questionrows;
      //  console.log("Your Filtered Data Here",this.answerTypeOne);
      }

      displayFn(option): string | undefined {
        console.log("option: ", option);
        if(option!=undefined || option!=null){
        return option.questionnaireDetail.question;
        }
      }
      

      saveMappedQuestions(object: any)
      {
         // console.log(object);
          let mapedQuesObj: any = {};
          mapedQuesObj.parentQuestionID = this.questionOne.questionID ? this.questionOne.questionID : null,
          mapedQuesObj.parentAnswer = object.answerType,
          mapedQuesObj.childQuestionID = this.questionTwo.questionID ? this.questionTwo.questionID : null,
          mapedQuesObj.providerServiceMapID = this.dataService.currentService.serviceID;
          console.log(JSON.stringify(mapedQuesObj));
          if(this.questionOne.questionID!=this.questionTwo.questionID)
          {
            this.dispSave=true;
            let data = JSON.stringify(mapedQuesObj);
            this.questionaireService.addDerivedQuestion(data).subscribe((response) => {
             //data;
             this.dialogRef.close(response);
             //this.alertService.alert("Derived question successfully", 'success');
            }, (err) => {
              this.alertService.alert(err.status, 'error');
              this.dialogRef.close();
            });
          }
          else{
            this.alertService.alert(this.currentLanguageSet.childAndParentQuestionsMustBeDifferent, 'info');
            this.dispSave=false;
          }
    }

    public onChange(quesID: any){  
      //console.log("argum: ",args);
      let parentAnsw=[];
      console.log("question",this.questionOne);
      console.log("parentAnsw: ",parentAnsw);
      if((this.questionOne !=undefined||this.questionOne !=null)&&(this.questionOne.questionnaireDetail !=undefined)){
      for(var j=0;j<this.questionOne.questionnaireDetail.mctsQuestionValues.length; j++){
        //this.answerTypeOne ===parentAnsw[j];
        if(this.questionOne.questionnaireDetail.mctsQuestionValues[j].deleted===false){
        parentAnsw[j]= this.questionOne.questionnaireDetail.mctsQuestionValues[j].dropDownOptions;  
        this.answerTypeOne =  parentAnsw[j];
        }
      }
    }
     //parentAnsw= this.questionOne.questionnaireDetail.mctsQuestionValues.dropDownOptions;
      this.answerTypeOne=parentAnsw;
            console.log("Your answerTypeOne Data Here",this.answerTypeOne);
            console.log("Your parentAnsw Data Here",parentAnsw);   
            if(quesID===1) {
              // for(var i=0;i<this.answerTypeOne.length;i++){
              //   console.log("items are: ",this.questionOne);
              //   if(this.questionOne ===this.questionrows[i])
              //   this.questionrows.splice(i, 1);
              // }
              }

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
