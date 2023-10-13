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
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../config/config.service';
import { InterceptedHttp } from './../../../http.interceptor';
import { SecurityInterceptedHttp } from '../../../http.securityinterceptor';

@Injectable()
export class CallClosureService {

    test = [];
    private putCallResponseURL = this.configService.getMctsBaseURL() + 'mctsCallResponseController/put/call/response';
    private putCallClosureURL = this.configService.getMctsBaseURL() + 'outbondcallcontroller/put/call/closure';
    private getCallHistoryURL = this.configService.getMctsBaseURL() + 'outbondcallcontroller/get/call/history';
    private getCallResponseURL = this.configService.getMctsBaseURL() + 'mctsCallResponseController/get/call/response';
    private getCongenitalURL = this.configService.getMctsBaseURL() + 'congenitalAnomaliesController/get/conganomolies';
    private getDesignationsURL = this.configService.getAdminBaseURL() + 'm/getDesignation';
    private getFeedbackTypesURL = this.configService.getAdminBaseURL() + 'm/getFeedbackType';
    private getFeedbackNatureURL = this.configService.getAdminBaseURL() + 'm/getFeedbackNatureType';
    private getAgentIDsURL = this.configService.getAdminBaseURL() + 'getAllAgentIds';
    private getCongenitalHistoryURL = this.configService.getMctsBaseURL() + 'congenitalAnomaliesController/get/child/conganomolies';
    private getComplaintsHistoryURL = this.configService.getCommonBaseURL() + 'feedback/getFeedbacksList';
    private getBenDetailsURL = this.configService.getMctsBaseURL() + 'mctsOutboundCallDetailController/get/benificiary/details';
    private putSmsURL = this.configService.getMctsBaseURL() + 'mctsOutboundCallDetailController/put/sms/advice';
    private getNextCallURL = this.configService.getMctsBaseURL() + 'outbondcallcontroller/get/next/anc/pnc';
    private createFeedbackURL = this.configService.getCommonBaseURL() + 'feedback/createFeedback';

    private getServiceLines_new_url = this.configService.getAdminBaseURL() + 'm/role/serviceNew';
    private getProviderSpecificStates_url = this.configService.getAdminBaseURL() + 'm/role/stateNew';
    private getDistricts_url = this.configService.getCommonBaseURL() + 'location/districts/';
    private getTaluks_url = this.configService.getCommonBaseURL() + 'location/taluks/';
    private getServiceProviderID_url = this.configService.getAdminBaseURL() + 'getServiceProviderid';
    private getInstitutes_url = this.configService.getAdminBaseURL() + 'm/getInstution';
    private getMedicalHistory_url = this.configService.getCommonBaseURL() + 'beneficiary/get104BenMedHistory';
    private getMMUMedicalHistory_url = this.configService.getMMUBaseURL() + 'common/getBeneficiaryCaseSheetHistory';
    private getMMUCaseSheetPreview_url = this.configService.getMMUBaseURL() + 'common/get/Case-sheet/printData';

    private getTMCaseSheetPreview_url = this.configService.getTMBaseURL() + 'common/get/Case-sheet/printData';
    private getTMMedicalHistory_url = this.configService.getTMBaseURL() + 'common/getBeneficiaryCaseSheetHistory';
    // private getTMMedicalHistory_url = this.configService.getTMBaseURL() + 'common/getBeneficiaryCaseSheetHistory';


    private getChangeLogURL = this.configService.getMctsBaseURL() + 'mctsOutboundCallDetailController/get/change/log';

    //get calltypes for call closure screen
    private getCallTypes_url = this.configService.getCommonBaseURL() + 'call/getCallTypes';
    getWrapupTime = this.configService.getCommonBaseURL() +  'user/role/';
    constructor(private _http: SecurityInterceptedHttp, private configService: ConfigService, private httpIntercept: InterceptedHttp) { }

    putCallResponse(data) {
        return this.httpIntercept.post(this.putCallResponseURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    putCallClosure(data) {
        return this.httpIntercept.post(this.putCallClosureURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getCallHistory(data) {
        return this._http.post(this.getCallHistoryURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getCallResponse(data) {
        return this._http.post(this.getCallResponseURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getCongenital() {
        return this._http.post(this.getCongenitalURL, {})
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    // for reports

    getDesignations(data) {
        return this._http.post(this.getDesignationsURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getFeedbackTypes(data) {
        return this._http.post(this.getFeedbackTypesURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getFeedbackNature(data) {
        return this._http.post(this.getFeedbackNatureURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getAgentIDs(data) {
        return this._http.post(this.getAgentIDsURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }
    getCongenitalHistory(data) {
        return this._http.post(this.getCongenitalHistoryURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getBenificiaryDetails(data) {
        return this._http.post(this.getBenDetailsURL, data)
            .map((response: Response) => response).catch((error) => Observable.throw(error.json()));
    }

    putSms(data) {
        return this._http.post(this.putSmsURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getNextCall(data) {
        return this._http.post(this.getNextCallURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    createFeedback(data) {
        return this.httpIntercept.post(this.createFeedbackURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }
    getComplaints(data) {
        return this.httpIntercept.post(this.getComplaintsHistoryURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getStates(obj) {
        return this.httpIntercept.post(this.getProviderSpecificStates_url, obj)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getServiceLine(userID) {
        return this.httpIntercept.post(this.getServiceLines_new_url, { 'userID': userID })
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getDistricts(stateID) {
        return this.httpIntercept.get(this.getDistricts_url + stateID)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getTaluks(districtID) {
        return this.httpIntercept.get(this.getTaluks_url + districtID)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getInstitutes(data) {
        return this.httpIntercept.post(this.getInstitutes_url, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    //get call types for call closure
    getCallTypes(providerServiceMapID) {
        return this.httpIntercept.post(this.getCallTypes_url, { 'providerServiceMapID': providerServiceMapID, 'isOutbound': true })
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }
    getServiceProviderID(providerServiceMapID) {
        return this.httpIntercept.post(this.getServiceProviderID_url, { 'providerServiceMapID': providerServiceMapID })
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    //medical history of 104
    getMedicalHistory(data) {
        return this.httpIntercept.post(this.getMedicalHistory_url, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    //medical history mmu
    getMMUMedicalHistory(data) {
        return this.httpIntercept.post(this.getMMUMedicalHistory_url, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getCaseSheetDataToPreview(data) {
        return this.httpIntercept.post(this.getMMUCaseSheetPreview_url, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }
    
    getCaseSheetDataToPreviewToTm(data) {
        return this.httpIntercept.post(this.getTMCaseSheetPreview_url, data)
        .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }
    //medical history tm
    getTMMedicalHistory(data) {
        return this.httpIntercept.post(this.getTMMedicalHistory_url, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }


    getChangeLog(data) {
        return this._http.post(this.getChangeLogURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    //Shubham Shekhar,24-08-2021,Wrapu up configuration
    getRoleBasedWrapuptime(roleID) {
        return this.httpIntercept.get(this.getWrapupTime + roleID)
        .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

}
