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
import { NgForm, FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-edit-call-config',
  templateUrl: './edit-call-config.component.html',
  styleUrls: ['./edit-call-config.component.css']
})
export class EditCallConfigComponent implements OnInit {

  providerServiceMapID: any;
  createdBy: any;
  userId: any;
  effectiveFrom: any;
  effectiveUpto: any;
  configTerms: any;
  responseJson = [];
  fullConfigData = [];
  congenitalArray = [];
  postData = [];
  noOfAttempts: any;
  nextAttemptPeriod: any;
  @ViewChild('editConfigurationForm') editConfigurationForm: NgForm;
  callTypeForm : FormGroup;
  ancArray: FormArray;
  pncArray: FormArray;
	formBuilder : FormBuilder = new FormBuilder();
  errorObj = {
		"ancs": [],
		"pncs": []
	};
  ancs = 0;
  pncs = 0;
	errorFlag = false;
	errorArr = [];
  currentDate : Date;
  currentLanguageSet: any;

  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<EditCallConfigComponent>, private commonDataService : dataService,
  public httpServices:HttpServices) { }

  effectiveUptoMinDate:Date;
  ngOnInit() {
    this.assignSelectedLanguage();
    this.currentDate = new Date();
    this.providerServiceMapID = this.commonDataService.currentService.serviceID;
    this.createdBy = this.commonDataService.uname;
    this.userId = this.commonDataService.uid;
    this.fullConfigData = this.data.configData;
    this.responseJson = this.fullConfigData.filter(eachObj=>{
      return eachObj.outboundCallType!='CONGENITAL_ANOMALIES'
    });
    console.log("this.responseJson", this.responseJson);
    
    this.congenitalArray = this.fullConfigData.filter(eachObj=>{
      return eachObj.outboundCallType=='CONGENITAL_ANOMALIES'
    });
    this.effectiveFrom = new Date(this.responseJson[0].effectiveFrom);
    // if(this.effectiveFrom == this.currentDate){
    //   this.effectiveUptoMinDate = new Date(this.effectiveFrom)
    // }else{
      if(this.currentDate > this.effectiveFrom){
        this.effectiveUptoMinDate = new Date(this.currentDate)
      }else{
        this.effectiveUptoMinDate = new Date(this.effectiveFrom)
      }
    // }
    this.effectiveUpto = new Date(this.responseJson[0].effectiveUpto);
    this.configTerms = this.responseJson[0].fromTerm.slice(-1)=='M'?'Months':'Weeks';
    this.noOfAttempts = this.responseJson[0].noOfAttempts;
    this.nextAttemptPeriod = this.responseJson[0].nextAttemptPeriod;
    this.ancArray = new FormArray([]);
    this.pncArray = new FormArray([]);
    for(var i =0; i< this.responseJson.length;i++){
      if(this.responseJson[i].outboundCallType.slice(0,-1)=="ANC"){
        this.ancs = this.ancs+1;
      }
      else {
        this.pncs = this.pncs+1;
      }
    }
    this.callTypeForm = this.formBuilder.group({
			ancs : this.ancArray,
			pncs : this.pncArray
		});
		this.callTypeForm.valueChanges.subscribe((value)=>{
			// console.log(value);
			this.errorArr = [];
			if(value.ancs.length == this.ancs && value.pncs.length == this.pncs && this.errorObj.ancs.length == this.ancs && this.errorObj.pncs.length == this.pncs){
				for(var i =0; i< value.ancs.length; i++){
					// console.log(this.errorObj);
					this.errorObj['ancs'][i].toTerm = (value.ancs[i].fromTerm > value.ancs[i].toTerm) ? 1: 0;
					this.errorObj['ancs'][i].fromTerm = (i!=0 && value.ancs[i].fromTerm <= value.ancs[i-1].toTerm)? 1:0;
					if((this.errorObj['ancs'][i].toTerm==1 || this.errorObj['ancs'][i].fromTerm==1 ) && this.callTypeForm.valid){
						this.errorArr.push('1');
					}
					// this.errorFlag = ((this.errorObj['ancs'][i].toTerm==1 || this.errorObj['ancs'][i].fromTerm==1 ) && this.callTypeForm.valid)? true: false;
				}
				// console.log("finished anc loop");
				for(var i =0; i< value.pncs.length; i++){
					// console.log(this.errorObj);
					this.errorObj['pncs'][i].toTerm = (value.pncs[i].fromTerm > value.pncs[i].toTerm)? 1: 0;
					this.errorObj['pncs'][i].fromTerm = (i!=0 && value.pncs[i].fromTerm <= value.pncs[i-1].toTerm)? 1:0;
					if((this.errorObj['pncs'][i].toTerm==1 || this.errorObj['pncs'][i].fromTerm==1 ) && this.callTypeForm.valid){
						this.errorArr.push('1');
					}
					// this.errorFlag = ((this.errorObj['pncs'][i].toTerm==1 || this.errorObj['pncs'][i].fromTerm==1 ) && this.callTypeForm.valid)? true: false;
				}
				// console.log("finished pnc loop");
				this.errorFlag = this.errorArr.length>0? true: false;
			}
			// console.log("errorObj", this.errorObj);
			// console.log("errorArr", this.errorArr);
			// console.log("errorFlag", this.errorFlag);
		});
    let a = new Date();
    for(var i=0; i<this.ancs;i++){
			(<FormArray>this.callTypeForm.get('ancs')).push(this.createItem(this.responseJson[i],a));
			this.errorObj.ancs.push({
				"fromTerm": 0,
				"toTerm": 0
			});
		}
		for(var i=0; i<this.pncs;i++){
      (<FormArray>this.callTypeForm.get('pncs')).push(this.createItem(this.responseJson[this.ancs+i],a));
			this.errorObj.pncs.push({
				"fromTerm": 0,
				"toTerm": 0
			});
		}

    console.log(this.callTypeForm.value);
    console.log(this.errorObj);
    
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.httpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }

  blockKey(e: any){
      if(e.keyCode===9){
          return true;
      }
      else {
          return false;
      }
  }

  validate(key, value) {
		if(value < 0 && key=="noOfAttempts") {
      this.noOfAttempts = undefined;
		}
    else if (value < 0 && key=="nextAttemptPeriod"){
      this.nextAttemptPeriod = undefined;
    }
	}

  createItem(obj,curentDate){
		return this.formBuilder.group({
    
        outboundCallType: [{value: obj.outboundCallType, disabled: true},[Validators.required]],
        displayOBCallType: [{value:obj.displayOBCallType, disabled : curentDate > new Date(obj.effectiveFrom)? true : false },[Validators.required]],
        fromTerm: [parseInt(obj.fromTerm.slice(0,-1)),[Validators.required, Validators.min(0), Validators.max(this.configTerms=="Months"?12:48)]],
        toTerm: [parseInt(obj.toTerm.slice(0,-1)),[Validators.required, Validators.min(0), Validators.max(this.configTerms=="Months"?12:48)]]
			}
			)
	}

  onSubmit(){
    console.log(this.editConfigurationForm.value);
    console.log(this.callTypeForm.value);
    for(var i=0; i< this.ancs; i++){
      var tempObj = {};
      tempObj['createdDate']= this.responseJson[i]['createdDate'];
      tempObj['providerServiceMapID'] = this.providerServiceMapID;
      tempObj["mctsCallConfigID"] = this.responseJson[i]["mctsCallConfigID"];
      tempObj['displayOBCallType'] = this.callTypeForm.value.ancs[i]['displayOBCallType']?this.callTypeForm.value.ancs[i]['displayOBCallType']:"ANC"+(i+1);
      tempObj["fromTerm"] = this.configTerms=="Months"?this.callTypeForm.value.ancs[i].fromTerm+'M':this.callTypeForm.value.ancs[i].fromTerm+'W';
      tempObj["toTerm"] = this.configTerms=="Months"?this.callTypeForm.value.ancs[i].toTerm+'M':this.callTypeForm.value.ancs[i].toTerm+'W';
      tempObj["effectiveFrom"] = new Date((this.effectiveFrom) - 1 * (this.effectiveFrom.getTimezoneOffset() * 60 * 1000)).toJSON();
      tempObj["effectiveUpto"] = new Date((this.effectiveUpto) - 1 * (this.effectiveUpto.getTimezoneOffset() * 60 * 1000)).toJSON();
      tempObj["configTerms"] = this.configTerms;
      tempObj["noOfAttempts"] = this.noOfAttempts;
      tempObj["nextAttemptPeriod"] = this.nextAttemptPeriod;
      tempObj["lastModDate"] = new Date().toISOString();
      this.postData.push(tempObj);
    }
    for(var i=0; i< this.pncs; i++){
      var tempObj = {};
      tempObj['createdDate'] = this.responseJson[this.ancs + i]['createdDate'];
      tempObj['providerServiceMapID'] = this.providerServiceMapID;
      tempObj["mctsCallConfigID"] = this.responseJson[this.ancs + i]["mctsCallConfigID"];
      tempObj['displayOBCallType'] = this.callTypeForm.value.pncs[i]['displayOBCallType']?this.callTypeForm.value.pncs[i]['displayOBCallType']:"PNC"+(i+1);
      tempObj["fromTerm"] = this.configTerms=="Months"?this.callTypeForm.value.pncs[i].fromTerm+'M':this.callTypeForm.value.pncs[i].fromTerm+'W';
      tempObj["toTerm"] = this.configTerms=="Months"?this.callTypeForm.value.pncs[i].toTerm+'M':this.callTypeForm.value.pncs[i].toTerm+'W';
      tempObj["effectiveFrom"] = new Date((this.effectiveFrom) - 1 * (this.effectiveFrom.getTimezoneOffset() * 60 * 1000)).toJSON();
      tempObj["effectiveUpto"] = new Date((this.effectiveUpto) - 1 * (this.effectiveUpto.getTimezoneOffset() * 60 * 1000)).toJSON();
      tempObj["configTerms"] = this.configTerms;
      tempObj["noOfAttempts"] = this.noOfAttempts;
      tempObj["nextAttemptPeriod"] = this.nextAttemptPeriod;
      tempObj["lastModDate"] = new Date().toISOString();
      this.postData.push(tempObj);
    }
    // var tempObj = {};
    // tempObj["mctsCallConfigID"] = this.congenitalArray[0]["mctsCallConfigID"];
    // tempObj["effectiveFrom"] = new Date((this.effectiveFrom) - 1 * (this.effectiveFrom.getTimezoneOffset() * 60 * 1000)).toJSON();
    // tempObj["effectiveUpto"] = new Date((this.effectiveUpto) - 1 * (this.effectiveUpto.getTimezoneOffset() * 60 * 1000)).toJSON();
    // tempObj["configTerms"] = this.configTerms;
    // tempObj["noOfAttempts"] = this.noOfAttempts;
    // tempObj["nextAttemptPeriod"] = this.nextAttemptPeriod;
    // tempObj["lastModDate"] = new Date().toISOString();
    // this.postData.push(tempObj);
    console.log(this.postData);
    this.dialogRef.close(this.postData);
  }
}
