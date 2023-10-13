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
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CallAllocationService {

    test = [];
    selectedCallConfig: any;
    selectedCallConfigName: any;
    private _geturl: string = this.configService.getMctsBaseURL() + "callConfigurationController/put/confignumbers";
    private _configurl: string = this.configService.getMctsBaseURL() + "callConfigurationController/put/configuration";
    private getConfigListURL = this.configService.getMctsBaseURL() + "callConfigurationController/get/configuration/list";
    private updateConfigURL = this.configService.getMctsBaseURL() + "callConfigurationController/put/configuration/update";
    private saveDialPreferenceURL = this.configService.getCommonBaseURL() + "call/isAutoPreviewDialing";
    private deleteConfigURL = this.configService.getMctsBaseURL() + "callConfigurationController/delete/configuration";    
    private getConfigListURLForReport = this.configService.getMctsBaseURL() + "callConfigurationController/get/configuration/listForReport";
    constructor(private _http: SecurityInterceptedHttp, private configService: ConfigService, private httpIntercept: InterceptedHttp) { }

    getProviders(data: any) {

        return this._http.post(this._geturl, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));;

    }

    createCallConfig(data: any) {
        console.log("inside the allocation services");
        console.log(data);
        return this.httpIntercept.post(this._configurl, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));;
    }

    getConfigList(data) {
        return this.httpIntercept.post(this.getConfigListURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));;
    }
    updateConfig(data) {
        return this.httpIntercept.post(this.updateConfigURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));;
    }

    deleteConfig(data) {
        return this.httpIntercept.post(this.deleteConfigURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    saveDialPreference(data) {
        return this.httpIntercept.post(this.saveDialPreferenceURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));;
    }
    getConfigListForReport(data) {
        return this.httpIntercept.post(this.getConfigListURLForReport, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));;
    }
}