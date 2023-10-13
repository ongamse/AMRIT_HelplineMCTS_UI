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


import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class dataService {

	Userdata: any;
	userPriveliges: any;
	uid: any;
	uname: any;
	benData: any;
	currentService: any;
	currentRole: any;
	current_workingLocationID: any;
	roleSelected = new Subject();
	callDetailID: any;
	benObj: any;
	agentID: any;

	current_serviceID:any;

	sendHeaderStatus = new Subject();
	onCall = new Subject();
	Role_Name: any;

	bendata_for_MO: any;
	dataForMOTransferInClosure: any;

	call_wrapup = new Subject();

	call_recieved_by_mo: any = false;
	selfNoOnTransfer: any = false;

	loginKey:any;
	service_providerID:any;
	campaignName: any;
	
	apimanClientKey: any;
	appLanguage:any="English";
	constructor() {
	}

};



