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
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { ConfigService } from '../config/config.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class RegisterService {
//domain = "10.152.3.152:1040/Common/";
	constructor(private _http: SecurityInterceptedHttp, private configService: ConfigService) { }

	generateReg(values: any) {


		let createData = '{"titleId":1,"firstName":"' + values.FirstName + '",'
			+ '"middleName":"' + values.LastName + '","lastName":"' + values.LastName + '","genderID":1,'
			+ '"maritalStatusID":1,"dOB":"' + values.DOB + '","fatherName":"' + values.FirstName + '",'
			+ '"husbandName":"' + values.FirstName + '","phoneNo":"' + values.PhoneNo + '","phoneTypeID":1,'
			+ '"altPhoneNo":"' + values.PhoneNo + '","altPhoneTypeID":1,'
			+ '"parentBenRegID":"' + values.ParentBenRegID + '","beneficiaryTypeID":1,'
			+ '"registeredServiceID":1,"deleted":false,"createdBy":"CO","govtIdentityTypeID":1,"statusID":1}';


		console.log(createData)
		//let createData='{"callType":"'+values.calltype+'","remarks":"'+values.callRemarks+'","invalidType":"'+values.invalidCallType+'"}';
		return this._http.post(this.configService.getCommonBaseURL() + 'Common/beneficiary/create', createData).map((response: Response) =>
		// return this._http.post('http://localhost:9090/CommonV1/benificiary/create', createData, { headers: headers }).map((response: Response) =>
			response.json()
		).catch((error) => Observable.throw(error.json()));
	}

	getRelationships() {
		console.log("cndbasmfg")
		// let url = this.domain + this.baseUrl + "/get/beneficiaryRelationship";
		return this._http.get(this.configService.getCommonBaseURL() + "user/get/beneficiaryRelationship").map((response: Response) =>
		// return this._http.get("http://localhost:9090/CommonV1/get/beneficiaryRelationship").map((response: Response) =>
			response.json()
		).catch((error) => Observable.throw(error.json()));
	}

	retrieveRegHistory(registrationNo: any) {
		console.log("retrieveRegHistory")
		//let url = this.domain+this.baseUrl+"/get/beneficiaryRelationship";
		return this._http.get(this.configService.getCommonBaseURL() + "beneficiary/searchUser/" + registrationNo).map((response: Response) =>
		// return this._http.get("http://localhost:9090/CommonV1/beneficiary/searchUser/" + registrationNo).map((response: Response) =>
			response.json()
		).catch((error) => Observable.throw(error.json()));
	}

}
