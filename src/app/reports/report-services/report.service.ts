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
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../services/config/config.service';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { AuthService } from 'app/services/authentication/auth.service';

@Injectable()
export class ReportService {
    headers = new Headers(
        {'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': this.authService.getToken()
      }
       );
    options = new RequestOptions({ headers: this.headers , responseType: ResponseContentType.Blob });
    constructor(private _http: SecurityInterceptedHttp,
        private configService: ConfigService, private httpIntercept: InterceptedHttp, private httpReport: Http, private authService: AuthService) { }

    private getComplaintReportURL = this.configService.getMctsBaseURL() + 'mctsReportController/getComplaintReport';
    private getDataReportURL = this.configService.getMctsBaseURL() + 'mctsReportController/getDataReport';
    private getCallSummaryReportURL = this.configService.getMctsBaseURL() + 'mctsReportController/getCallSummaryReport';
    private getCallDetailsReportURL = this.configService.getMctsBaseURL() + 'mctsReportController/getCallDetailReport';
    private getNHMReportURL = this.configService.getMctsBaseURL() + 'mctsReportController/getNHMReport';
    private getCallsAnsweredReportURL = this.configService.getMctsBaseURL() + 'mctsReportController/getCallAnsweredReport';
    private getCallsNotAnsweredReportURL = this.configService.getMctsBaseURL() + 'mctsReportController/getCallNotAnsweredReport';
    private getHighRiskReportURL = this.configService.getMctsBaseURL() + 'mctsReportController/getHighRiskReport';
    private getCongenitalAnomaliesReportURL = this.configService.getMctsBaseURL() + 'mctsReportController/getCongenitalAnomaliesReport';
    private getValidRecordsReportURL = this.configService.getMctsBaseURL() + 'mctsReportController/getValidRecordsReport';
    private getInValidRecordsReportURL = this.configService.getMctsBaseURL() + 'mctsReportController/getInvalidRecordReport';
    private getDailyReportURL = this.configService.getMctsBaseURL() + 'mctsReportController/getDailyReport';
    private getCallDetailsUniqueReportURL = this.configService.getMctsBaseURL() + 'mctsReportController/getCallDetailReportUnique';

    getComplaintReports(data) {
        return this.httpReport
        .post(this.getComplaintReportURL, data, this.options)
        .map(res => <Blob>res.blob());
        // return this.httpIntercept.post(this.getComplaintReportURL, data)
        //     .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getDataReports(data) {
        return this.httpReport
    .post(this.getDataReportURL, data, this.options)
    .map(res => <Blob>res.blob());
        // return this.httpIntercept.post(this.getDataReportURL, data)
        //     .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getCallSummaryReports(data) {
        return this.httpIntercept.post(this.getCallSummaryReportURL, data)
            .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getCallDetailsReports(data) {
        return this.httpReport
        .post(this.getCallDetailsReportURL, data, this.options)
        .map(res => <Blob>res.blob());
        // return this.httpIntercept.post(this.getCallDetailsReportURL, data)
        //     .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getNHMReports(data) {
        return this.httpReport
        .post(this.getNHMReportURL, data, this.options)
        .map(res => <Blob>res.blob());
        // return this.httpIntercept.post(this.getNHMReportURL, data)
        // .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getCallsAnsweredReports(data) {
        return this.httpReport
        .post(this.getCallsAnsweredReportURL, data, this.options)
        .map(res => <Blob>res.blob());
        // return this.httpIntercept.post(this.getCallsAnsweredReportURL, data)
        // .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getCallsNotAnsweredReports(data) {
        return this.httpReport
        .post(this.getCallsNotAnsweredReportURL, data, this.options)
        .map(res => <Blob>res.blob());
        
        // return this.httpIntercept.post(this.getCallsNotAnsweredReportURL, data)
        // .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getHighRiskReports(data) {
        return this.httpReport
        .post(this.getHighRiskReportURL, data, this.options)
        .map(res => <Blob>res.blob());
        // return this.httpIntercept.post(this.getHighRiskReportURL, data)
        // .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getCongenitalAnomaliesReports(data) {
        return this.httpReport
        .post(this.getCongenitalAnomaliesReportURL, data, this.options)
        .map(res => <Blob>res.blob());
        
        // return this.httpIntercept.post(this.getCongenitalAnomaliesReportURL, data)
        // .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getValidRecordsReports(data) {
        return this.httpIntercept.post(this.getValidRecordsReportURL, data)
        .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getInValidRecordsReports(data) {
        return this.httpReport
    .post(this.getInValidRecordsReportURL, data, this.options)
    .map(res => <Blob>res.blob());
        // return this.httpIntercept.post(this.getInValidRecordsReportURL, data)
        // .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getDailyReport(data) {
        return this.httpReport
        .post(this.getDailyReportURL, data, this.options)
        .map(res => <Blob>res.blob());
        // return this.httpIntercept.post(this.getDailyReportURL, data)
        // .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }

    getCallDetailsUniqueReports(data) {
        return this.httpReport
        .post(this.getCallDetailsUniqueReportURL, data, this.options)
        .map(res => <Blob>res.blob());
        // return this.httpIntercept.post(this.getCallDetailsUniqueReportURL, data)
        // .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
    }
}