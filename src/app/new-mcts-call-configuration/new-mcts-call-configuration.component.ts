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


import { Component, OnInit, Output, EventEmitter,ViewChild, Inject } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl, NgForm, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CallAllocationService } from '../services/supervisorService/call-configuration.service';
import { MdDialog } from '@angular/material';
import { dataService } from '../services/dataService/data.service';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-new-mcts-call-configuration',
  templateUrl: './new-mcts-call-configuration.component.html',
  styleUrls: ['./new-mcts-call-configuration.component.css']
})
export class NewMctsCallConfigurationComponent implements OnInit {

	requiredObj : Object;
	requiredArray : any = [];
	fResponse: boolean = false;
	@ViewChild('f') myForm: NgForm;
	callTypeForm : FormGroup;
	formBuilder : FormBuilder = new FormBuilder();	
	defaultChoice = "Months";
  	responseJson = [];
	providerServiceMapID: any;
	createdBy: any;
  	minDate: Date;
	errorObj = {
		"ancs": [],
		"pncs": []
	};
	errorFlag = false;
	errorArr = [];
	languageComponent: SetLanguageComponent;
	
	currentLanguageSet: any;

	constructor(private CallAllocationService : CallAllocationService,private httpServiceService: HttpServices, public dialog: MdDialog, private dataService: dataService,@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<NewMctsCallConfigurationComponent>){

	}

	ngOnInit() {
		this.fetchLanguageResponse();
		this.providerServiceMapID = this.dataService.currentService.serviceID;
		this.createdBy = this.dataService.uname;
		this.minDate = this.data.minDate? this.data.minDate: new Date();
		console.log("Min Date"+ this.minDate);
		this.callTypeForm = this.formBuilder.group({
			ancs : this.formBuilder.array([]),
			pncs : this.formBuilder.array([])
		});
	}

	validate(key,value){
		if(value < 0) {
			var tempObj={};
			tempObj[key] = undefined;
			this.myForm.form.patchValue(tempObj);
		}
	}

	onSubmit(){
		this.callTypeForm = this.formBuilder.group({
			ancs : this.formBuilder.array([]),
			pncs : this.formBuilder.array([])
		});
		this.callTypeForm.valueChanges.subscribe((value)=>{
			// console.log(value);
			this.errorArr = [];
			if(value.ancs.length == this.myForm.value.anc && value.pncs.length == this.myForm.value.pnc && this.errorObj.ancs.length == this.myForm.value.anc && this.errorObj.pncs.length == this.myForm.value.pnc){
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
			console.log("errorObj", this.errorObj);
			console.log("errorArr", this.errorArr);
			console.log("errorFlag", this.errorFlag);
		});
		this.errorObj = {
			"ancs": [],
			"pncs": []
		};
		this.errorArr = [];
		this.errorFlag = false;
		this.requiredObj = this.myForm.value;
		for(var i=1; i<=this.myForm.value.anc;i++){
			(<FormArray>this.callTypeForm.get('ancs')).push(this.createItem({
				"outboundCallType": "ANC"+i
			}));
			this.errorObj.ancs.push({
				"fromTerm": 0,
				"toTerm": 0
			});
		}
		for(var i=1; i<=this.myForm.value.pnc;i++){
			(<FormArray>this.callTypeForm.get('pncs')).push(this.createItem({
				"outboundCallType": "PNC"+i
			}));
			this.errorObj.pncs.push({
				"fromTerm": 0,
				"toTerm": 0
			});
		}
		this.fResponse = true;
		console.log(this.errorObj);
	}

	blockKey(e: any){
        if(e.keyCode===9){
            return true;
        }
        else {
            return false;
        }
    }

	createItem(obj){
		return this.formBuilder.group({
				outboundCallType: [{value: obj.outboundCallType, disabled: true},[Validators.required]],
				displayOBCallType: [null],
				fromTerm: [null,[Validators.required, Validators.min(0), Validators.max(this.myForm.value.configTerms=="Months"?12:48)]],
				toTerm: [null,[Validators.required, Validators.min(0), Validators.max(this.myForm.value.configTerms=="Months"?12:48)]]
			}
			)
	}
	
	onSubmitF1(){
		console.log(this.callTypeForm.value);
		for(var i =0; i < this.callTypeForm.value.ancs.length;i++){
			var tempObj = {};
			tempObj['outboundCallType'] = "ANC"+(i+1);
			tempObj['displayOBCallType'] = this.callTypeForm.value.ancs[i]['displayOBCallType']?this.callTypeForm.value.ancs[i]['displayOBCallType'] : "ANC"+(i+1); 
			tempObj['effectiveFrom'] = new Date((this.myForm.value.effectiveFrom) - 1 * (this.myForm.value.effectiveFrom.getTimezoneOffset() * 60 * 1000)).toJSON();
			tempObj['effectiveUpto'] = new Date((this.myForm.value.effectiveUpto) - 1 * (this.myForm.value.effectiveUpto.getTimezoneOffset() * 60 * 1000)).toJSON();
			tempObj['fromTerm'] = this.myForm.value.configTerms=="Months"?this.callTypeForm.value.ancs[i]['fromTerm']+'M':this.callTypeForm.value.ancs[i]['fromTerm']+'W';
			tempObj['toTerm'] = this.myForm.value.configTerms=="Months"?this.callTypeForm.value.ancs[i]['toTerm']+'M':this.callTypeForm.value.ancs[i]['toTerm']+'W';
			tempObj['noOfAgents'] = this.myForm.value.noOfAgents;
			tempObj['totalCallsPerDay'] = this.myForm.value.totalCallsPerDay;
			tempObj['noOfAttempts'] = this.myForm.value.noOfAttempts;
			tempObj['nextAttemptPeriod'] = this.myForm.value.nextAttemptPeriod;
			tempObj['providerServiceMapID'] = this.providerServiceMapID;
			tempObj['createdBy'] = this.createdBy;
			this.requiredArray.push(tempObj)
		}
		for(var i =0; i < this.callTypeForm.value.pncs.length;i++){
			var tempObj = {};
			tempObj['outboundCallType'] = "PNC"+(i+1);
			tempObj['displayOBCallType'] = this.callTypeForm.value.pncs[i]['displayOBCallType']?this.callTypeForm.value.pncs[i]['displayOBCallType']:"PNC"+(i+1);
			tempObj['effectiveFrom'] = new Date((this.myForm.value.effectiveFrom) - 1 * (this.myForm.value.effectiveFrom.getTimezoneOffset() * 60 * 1000)).toJSON();
			tempObj['effectiveUpto'] = new Date((this.myForm.value.effectiveUpto) - 1 * (this.myForm.value.effectiveUpto.getTimezoneOffset() * 60 * 1000)).toJSON();
			tempObj['fromTerm'] = this.myForm.value.configTerms=="Months"?this.callTypeForm.value.pncs[i]['fromTerm']+'M':this.callTypeForm.value.pncs[i]['fromTerm']+'W';
			tempObj['toTerm'] = this.myForm.value.configTerms=="Months"?this.callTypeForm.value.pncs[i]['toTerm']+'M':this.callTypeForm.value.pncs[i]['toTerm']+'W';
			tempObj['noOfAgents'] = this.myForm.value.noOfAgents;
			tempObj['totalCallsPerDay'] = this.myForm.value.totalCallsPerDay;
			tempObj['noOfAttempts'] = this.myForm.value.noOfAttempts;
			tempObj['nextAttemptPeriod'] = this.myForm.value.nextAttemptPeriod;
			tempObj['providerServiceMapID'] = this.providerServiceMapID;
			tempObj['createdBy'] = this.createdBy;
			this.requiredArray.push(tempObj)
		}
		// var tempObj = {};
		// tempObj['outboundCallType'] = "CONGENITAL_ANOMALIES";
		// tempObj['effectiveFrom'] = new Date((this.myForm.value.effectiveFrom) - 1 * (this.myForm.value.effectiveFrom.getTimezoneOffset() * 60 * 1000)).toJSON();
		// tempObj['effectiveUpto'] = new Date((this.myForm.value.effectiveUpto) - 1 * (this.myForm.value.effectiveUpto.getTimezoneOffset() * 60 * 1000)).toJSON();
		// // tempObj['fromTerm'] = this.myForm.value.configTerms=="Months"?this.callTypeForm.value.pncs[i]['fromTerm']+'M':this.callTypeForm.value.pncs[i]['fromTerm']+'W';
		// // tempObj['toTerm'] = this.myForm.value.configTerms=="Months"?this.callTypeForm.value.pncs[i]['toTerm']+'M':this.callTypeForm.value.pncs[i]['toTerm']+'W';
		// tempObj['noOfAttempts'] = this.myForm.value.noOfAttempts;
		// tempObj['nextAttemptPeriod'] = this.myForm.value.nextAttemptPeriod;
		// tempObj['providerServiceMapID'] = this.providerServiceMapID;
		// tempObj['createdBy'] = this.createdBy;
		// this.requiredArray.push(tempObj)
		console.log(JSON.stringify(this.requiredArray));
		this.dialogRef.close(this.requiredArray);
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
