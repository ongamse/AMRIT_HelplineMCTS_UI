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


import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { ACAService } from '../services/supervisorService/agent-call-allocation.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { MdDialog } from '@angular/material';
import { dataService } from '../services/dataService/data.service';
import { NotificationService } from '../services/notificationService/notification-service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
	selector: 'app-agent-allocate-records',
	templateUrl: './agent-allocate-records.component.html',
	styleUrls: ['./agent-allocate-records.component.css'],
	//providers:[]
})

export class AgentAllocateRecordsComponent implements OnInit {
	users: any;
	@Input() mctsOutboundCalls: any = [];
	@Input() canAllocateToAll: boolean;
	@Input() filterAgent: any = '';
	@ViewChild('allocateForm') allocateForm: NgForm;
	initialCount: number;
	providerServiceMapID: any;
	@Output() refreshScreen: EventEmitter<any> = new EventEmitter<any>();
	userIDArray = [];
	agentChoice: number;
	roleObjArray = [];
	showProgressBar: Boolean = false
	currentLanguageSet: any;

	constructor(private _ACAService: ACAService,public httpServices:HttpServices, public dialog: MdDialog, private dataService: dataService, private notificationService: NotificationService, private alertService: ConfirmationDialogsService) {
	}


	ngOnInit() {
		this.enableAllocate = false;
		this.providerServiceMapID = this.dataService.currentService.serviceID;
		this.notificationService.getRoles(this.providerServiceMapID)
			.subscribe((response) => {
				console.log(response);
				this.roleObjArray = response.data;
				this.roleObjArray = this.roleObjArray.filter((obj) => {
					return obj.roleName.trim().toLowerCase() != "provideradmin" && obj.roleName.trim().toLowerCase() != "supervisor";
				})
				this.agentChoice = this.roleObjArray.filter((obj) => {
					return obj.roleName.trim().toLowerCase() == "anm";
				})[0].roleID;

				this._ACAService.getAgents({
					"providerServiceMapID": this.providerServiceMapID,
					"RoleID": this.agentChoice
				}).subscribe((resProviderData) => {
					console.log("reading...")
					this.users = resProviderData.data;
					console.log("users: ", this.users);
					console.log("selected Agent", this.filterAgent);
					if (this.filterAgent != '') {
						this.users = this.users.filter((obj) => {
							return (obj.firstName + " " + obj.lastName) != this.filterAgent;
						})
						console.log("filtered List", this.users);
					}
				});
			})
		console.log(this.mctsOutboundCalls.length);
		console.log(this.allocateForm);
		this.initialCount = this.mctsOutboundCalls.length;
	}

	searchReqObjChange(choice) {
		this.agentChoice = choice;
		this._ACAService.getAgents({
			"providerServiceMapID": this.providerServiceMapID,
			"RoleID": this.agentChoice
		}).subscribe((resProviderData) => {
			console.log("reading...")
			this.users = resProviderData.data;
			console.log("users: ", this.users);
			console.log("selected Agent", this.filterAgent);
			if (this.filterAgent != '') {
				this.users = this.users.filter((obj) => {
					return (obj.firstName + " " + obj.lastName) != this.filterAgent;
				})
				console.log("filtered List", this.users);
			}
		});
		this.allocateForm.form.patchValue({
			userID: []
		});
	}

	ngOnChanges() {
		this.initialCount = this.mctsOutboundCalls.length;
		this.allocateForm.form.patchValue({
			userID: []
		});
	}

	enableAllocate: Boolean = false;
	blockKey(e: any) {
		console.log('In blocking 0');
		console.log('value of e', e, this.initialCount, this.allocateForm.value, this.allocateForm.controls['allocateNo'].value);

		if (e.key == 0 && this.allocateForm.controls['allocateNo'].value == null) {
			return false;
		} else {
			return true;
		}
	}
	// if (e.value == 0) {


	// 	if ((e.key > 48 && e.keyCode < 58) || e.keyCode == 8 || e.keyCode == 9) {
	// 		console.log('e.keyCode true', e.keyCode);
	// 		this.enableAllocate = true;
	// 		return true;
	// 	}
	// 	else {
	// 		console.log('e.keyCode false', e.keyCode);
	// 		return false;
	// 	}
	// } else {
	// 	if ((e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8 || e.keyCode == 9) {
	// 		console.log('e.keyCode true in greater than 47', e.keyCode);
	// 		this.enableAllocate = false;
	// 		return true;
	// 	}
	// 	else {
	// 		console.log('e.keyCode false', e.keyCode);
	// 		return false;
	// 	}
	// }

	onCreate() {
		this.showProgressBar = true;
		console.log(this.allocateForm.value);
		this.allocateForm.value["providerServiceMapID"] = this.providerServiceMapID;
		console.log(JSON.stringify(this.allocateForm.value));
		this._ACAService.allocateCallsToAgenta(this.allocateForm.value)
			.subscribe(
			(response) => {
				console.log(response);
				this.showProgressBar = false;
				this.alertService.alert(response.data.response +" " +this.currentLanguageSet.recordsAllocated, 'success')
				//emit refresh event for screen refresh after allocation
				this.refreshScreen.emit();
			},
			(error) => {
				console.log(error);
				this.alertService.alert(error.data.response ? error.data.response : this.currentLanguageSet.errorInAllocation, 'error');
			}
			);
	}

	validate(key, value) {

		var tempObj = {};
		if (value < 1 && value == null) {
			tempObj[key] = undefined;
			this.allocateForm.form.patchValue(tempObj);
		}
		else if (value > this.initialCount) {
			tempObj[key] = this.initialCount;
			this.allocateForm.form.patchValue(tempObj)
		}
	}

	onAllocateAll() {
		this.userIDArray = [];
		// this.userIDArray = ["54", "55", "95"];
		for (var i = 0; i < this.users.length; i++) {
			this.userIDArray.push(this.users[i].userID);
		}
		this.allocateForm.value["userID"] = this.userIDArray;
		this.allocateForm.value["providerServiceMapID"] = this.providerServiceMapID;
		console.log(JSON.stringify(this.allocateForm.value));
		this._ACAService.allocateCallsToAgenta(this.allocateForm.value)
			.subscribe(
			(response) => {
				console.log(response);
				this.alertService.alert(response.data.response +" "+this.currentLanguageSet.recordsAllocated, 'success')
				//emit refresh event for screen refresh after allocation
				this.refreshScreen.emit();
			},
			(error) => {
				console.log(error);
				this.alertService.alert(error.data.response ? error.data.response : this.currentLanguageSet.errorInAllocation, 'error');
			}
			);
	}
	ngDoCheck() {
		this.assignSelectedLanguage();
	  }
	
	  assignSelectedLanguage() {
			const getLanguageJson = new SetLanguageComponent(this.httpServices);
			getLanguageJson.setLanguage();
			this.currentLanguageSet = getLanguageJson.currentLanguageObject;
		  }
	diasbleAllocateAll: Boolean = true;
	OnSelectChange() {
		console.log('cjeck');

		if (this.allocateForm.value.userID.length != 0) {
			this.diasbleAllocateAll = false;
		} else {
			this.diasbleAllocateAll = true;
		}
		console.log(this.allocateForm.value);
		// this.enableAllocate = true;s
		var tempValue = Math.floor(this.mctsOutboundCalls.length / (this.allocateForm.value.userID.length != 0 ? this.allocateForm.value.userID.length : 1));
		this.allocateForm.form.patchValue({
			allocateNo: tempValue
		});
		this.initialCount = tempValue;
	}


}
