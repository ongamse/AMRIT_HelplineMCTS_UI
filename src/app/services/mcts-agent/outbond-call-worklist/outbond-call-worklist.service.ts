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
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ConfigService } from '../../config/config.service';
import { InterceptedHttp } from './../../../http.interceptor';
import { SecurityInterceptedHttp } from '../../../http.securityinterceptor';

@Injectable()
export class OCWService {

    test = [];
    // private _allocateurl: string = "http://localhost:1040/API/mcts/v1/put/agentcallallocate";
    // private _callList: string = "http://localhost:1040/API/mcts/v1/get/worklist";
    private _callList: string = this.configService.getMctsBaseURL() + "outbondcallcontroller/get/worklist"; //temporary url api needs to modify
    private _hrscallList: string = this.configService.getMctsBaseURL() + "mcts/v1/get/worklist/hrp";
    private _historyUrl: string = this.configService.getMctsBaseURL() + "mcts/v1/get/calldeta/";
    private _putCallerIDURL: string = this.configService.getMctsBaseURL() + "mctsOutboundCallDetailController/put/call/history";
    private _saveBenDetailsURL: string = this.configService.getMctsBaseURL() + "mctsdatatransactioncontroller/upload/mctsdata";
    private _getBeneficiaryDetailsURL: string = this.configService.getMctsBaseURL() + "mctsidentitycontroller/search/beneficiary";
    private _saveEditedBeneficiaryDetailsURL: string = this.configService.getMctsBaseURL() + "mctsdatatransactioncontroller/edit/mctsdata";
    private _getUpdatedObjURL: string = this.configService.getMctsBaseURL() + "outbondcallcontroller/get/updated/object";

    //added to get dial preference
    private getDialPreferenceURL = this.configService.getCommonBaseURL() + "call/checkAutoPreviewDialing";
    // private addAutoDialNumbersURL = this.configService.getCommonBaseURL() + "cti/addAutoDialNumbers";
    private addAutoDialNumbersURL = this.configService.getCommonBaseURL() + "cti/addAutoDialNumbers";
    private getCampaignNameURL = this.configService.getAdminBaseURL() + "getAllAgentIds";
    private setAutoDialNumbersURL = this.configService.getCommonBaseURL() + "cti/setAutoDialNumbers";
    private _mothercallList = this.configService.getMctsBaseURL() + 'outbondcallcontroller/getMotherWorklist';
    private _childcallList = this.configService.getMctsBaseURL() + 'outbondcallcontroller/getChildWorklist';
    constructor(private http: Http, private _http: SecurityInterceptedHttp, private configService: ConfigService, private httpIntercept: InterceptedHttp) { }

    // getCallWorklist(data) {

    //     return this.httpIntercept.post(this._callList, data)
    //         .map((response: Response) => response.json()).catch((error)=> Observable.throw(error.json()));
    // }
    getMotherCallWorklist(data) {
        return this.httpIntercept.post(this._mothercallList, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }
      getChildCallWorklist(data) {
        return this.httpIntercept.post(this._childcallList, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }
    getHRSCallWorklist() {

        return this._http.get(this._hrscallList)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));

    }

    viewHistory(id: any) {

        return this._http.get(this._historyUrl + id)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    putCallerID(data) {
        return this._http.post(this._putCallerIDURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    saveBenDetails(data) {
        return this._http.post(this._saveBenDetailsURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    saveProviders(data: any) {
        console.log("inside the allocation services");
        console.log(data);
        return this._http.post(this._callList, data)

            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));

    }


    searchBeneficiary(data: any) {
        return this._http.post(this._getBeneficiaryDetailsURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    saveEditedBeneficiaryDetails(data: any) {
        return this._http.post(this._saveEditedBeneficiaryDetailsURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getUpdatedObject(data: any) {
        return this.httpIntercept.post(this._getUpdatedObjURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getDialPreference(data: any) {
        return this.httpIntercept.post(this.getDialPreferenceURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    startCallForAutoPreviewDialing(data: any) {
        return this.httpIntercept.post(this.setAutoDialNumbersURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getCampaignName(data: any) {
        return this.httpIntercept.post(this.getCampaignNameURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }
}