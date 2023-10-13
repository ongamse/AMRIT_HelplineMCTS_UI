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
import { ConfigService } from '../../services/config/config.service';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class CallCountService {

  constructor(private _http: SecurityInterceptedHttp,
    private configService: ConfigService, private httpIntercept: InterceptedHttp) { }

  private getCallAnsweredCountURL = this.configService.getMctsBaseURL() + 'callCountController/getCallAnsweredCount';
  private getCallVerifiedCountURL = this.configService.getMctsBaseURL() + 'callCountController/getCallVerifiedCount';

  getCallAnsweredCount(data) {
    return this.httpIntercept.post(this.getCallAnsweredCountURL, data)
      .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
  }

  getCallVerifiedCount(data) {
    return this.httpIntercept.post(this.getCallVerifiedCountURL, data)
      .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
  }
}
