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


import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class AgentSearchRecordService {

    test = [];
    _baseurl: any;
    data: any;

    constructor(private _http: SecurityInterceptedHttp, private configService: ConfigService, private httpIntercept: InterceptedHttp) {

    }

    //private _geturl: string = this._baseurl+"/agentcallallocationcontroller/get/unallocatedcalls";
    private _urlmovecalls: string = this.configService.getMctsBaseURL() + "outbondcallcontroller/moveCallsToOutbound";
    private _geturl: string = this.configService.getMctsBaseURL() + "outbondcallcontroller/get/unallocatedcalls";
    private _getReallocationURL = this.configService.getMctsBaseURL() + "outbondcallcontroller/get/reallocated/calls";
    private _moveToBinURL = this.configService.getMctsBaseURL() + "outbondcallcontroller/move/calls/tobucket";
    //  private _allocateurl: string = "http://10.152.3.152:1040/API/mcts/v1/put/agentcallallocate";

    moveCallsToOutbound(val: any) {
        return this.httpIntercept.post(this._urlmovecalls, val)
            .map(this.extractData).catch((error) => Observable.throw(error.json()));
    }

    getUnallocatedCalls(val: any) {
        return this.httpIntercept.post(this._geturl, val)
            .map(this.extractData).catch((error) => Observable.throw(error.json()));;
    }

    getSubRecords(data: any, key: any, val: any) {

        return data.json().filter(data => data.key == val);
    }

    getOutbondCount(val: any) {

        return this._http.post(this._geturl, val)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));;
    };

    getReallocationCalls(data) {
        return this.httpIntercept.post(this._getReallocationURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));;
    }
    moveToBin(data) {
        return this.httpIntercept.post(this._moveToBinURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));;
    }

    private extractData(res: Response) {

        if (res.json().data) {
            return res.json();
        } else {
            return res.json();
        }
    };

}
