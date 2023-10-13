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
export class ACAService {

    test = [];
    private _geturl: string = this.configService.getCommonBaseURL() + "user/getUsersByProviderID";
    private _allocateurl: string = this.configService.getMctsBaseURL() + "outbondcallcontroller/put/agentcallallocate";

    constructor(private _http: SecurityInterceptedHttp, private configService: ConfigService,private httpIntercept: InterceptedHttp) { }

    getAgents(data) {

        return this._http.post(this._geturl, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));

    }

    allocateCallsToAgenta(data: any) {
        console.log("inside the call config services");
        console.log(data);
        return this._http.post(this._allocateurl, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));

    }
}