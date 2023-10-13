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
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class loginService {

	private getLanguagesURL = this.configService.getCommonBaseURL() + "beneficiary/getRegistrationDataV1";
	mctsUrl = this.configService.getMctsBaseURL();
	logoutUserUrl: any;
	_authorisedUser: any;
	apiVersionUrl = this.mctsUrl + "version";
	transactionId: any;
	

	constructor(private http: SecurityInterceptedHttp, private configService: ConfigService, private httpIntercept: InterceptedHttp) {
		this.logoutUserUrl = this.configService.getOpenCommonBaseURL() + 'user/userLogout';
		this._authorisedUser = this.configService.getOpenCommonBaseURL() + 'user/getLoginResponse';

	};

	public authenticateUser = function (uname: any, pwd: any, doLogout: any) {


		return this.httpIntercept.post(this.configService.getOpenCommonBaseURL() + 'user/userAuthenticate', { 'userName': uname, 'password': pwd,         'doLogout': doLogout })
			// return this.http.post('http://localhost:1040/CommonV1/user/userAuthenticate',{'userName':uname,'password':pwd})
			.map(this.extractData)
			.catch(this.handleError);
	};
	public checkAuthorisedUser() {
		return this.httpIntercept.post(this._authorisedUser, {})
			.map(this.extractData)
			.catch(this.handleError);
	}

	public userLogOutFromPreviousSession(uname) {
    return this.httpIntercept
      .post(this.configService.getOpenCommonBaseURL() + "user/logOutUserFromConcurrentSession", {
        userName: uname
      })
      .map(this.extractData)
      .catch(this.handleError);
  };


	getSecurityQuestions(uname: any): Observable<any> {

		return this.http.post(this.configService.getOpenCommonBaseURL() + 'user/forgetPassword', { 'userName': uname })
			//return this.http.post('http://localhost:1040/CommonV1/user/forgetPassword', { 'userName': uname })
			.map(this.extractData)
			.catch(this.handleError);
	};
	validateSecurityQuestionAndAnswer(ans: any, uname: any): Observable<any> {

		return this.http.post(this.configService.getOpenCommonBaseURL() + 'user/validateSecurityQuestionAndAnswer', { 'SecurityQuesAns':ans,'userName': uname })
			//return this.http.post('http://localhost:1040/CommonV1/user/forgetPassword', { 'userName': uname })
			.map(this.extractData)
			.catch(this.handleError);
	};
	getTransactionIdForChangePassword(uname: any): Observable<any> {

		return this.http.post(this.configService.getOpenCommonBaseURL() + 'user/getTransactionIdForChangePassword', { 'userName': uname })
			//return this.http.post('http://localhost:1040/CommonV1/user/forgetPassword', { 'userName': uname })
			.map(this.extractData)
			.catch(this.handleError);
	};


	getLanguages() {
		return this.http.post(this.getLanguagesURL, {})
			.map((response: Response) => response.json()).catch(this.handleError);
	}

	userLogout() {
		return this.http.post(this.logoutUserUrl, {}).map(this.extractData).catch(this.handleError);
	}
	getApiVersionDetails() {
		return this.httpIntercept.get(this.apiVersionUrl)
			.map(res => res.json());
	}

	private extractData(res: Response) {
		// console.log("inside extractData:"+JSON.stringify(res.json()));
		// let body = res.json();
		//return body.data || {};
		return res.json();
	};

	private handleError(error: Response | any) {
		// In a real world app, you might use a remote logging infrastructure
		// let errMsg: string;
		// if (error instanceof Response) {
		// 	const body = error.json() || '';
		// 	const err = body.error || JSON.stringify(body);
		// 	errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		// } else {
		// 	errMsg = error.message ? error.message : error.toString();
		// }
		// console.error(errMsg);
		return Observable.throw(error.json());
	};
};



