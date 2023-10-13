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


import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { CzentrixServices } from './../services/czentrixService/czentrix.service';
import { dataService } from '../services/dataService/data.service';
import { CallCountService } from '../services/call-count-service/call-count.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
    selector: 'app-call-statistics',
    templateUrl: './call-statistics.component.html',
})
export class CallStatisticsComponent implements OnInit {

    @Output() hide_component: EventEmitter<any> = new EventEmitter<any>();
    public totalCalls;
    public totalInvalidCalls;
    public totalCallDuration;
    public totalFreeTime;
    public totalBreakTime;

    current_date: any;

    //added for no.of calls answered and count of calls verified
    totalCallsAnswered: any;
    totalVerifiedCalls: any;
    public providerServiceMapID;

    reqObj: any;
    role: any;
    currentLanguageSet: any;

    constructor(private callService: CzentrixServices, private callCountService: CallCountService,
        private dataService: dataService,public httpServices:HttpServices) { };
        ngDoCheck() {
            this.assignSelectedLanguage();
          }
        
          assignSelectedLanguage() {
                const getLanguageJson = new SetLanguageComponent(this.httpServices);
                getLanguageJson.setLanguage();
                this.currentLanguageSet = getLanguageJson.currentLanguageObject;
              }
    ngOnInit() {
        this.role = this.dataService.Role_Name;
        console.log("Role", this.role);
        
        this.todayCallLists();
        this.providerServiceMapID = this.dataService.currentService.serviceID;
        this.reqObj = {
            "agentID": this.callService.agent_id,
            "providerServiceMapID": this.providerServiceMapID
        }
        this.current_date = new Date();
        this.todayAnsweredCalls();
        this.todayVerifiedCalls();
    };
    todayCallLists() {

        this.callService.getTodayCallReports(this.callService.agent_id).subscribe((response) => {
            // this.totalCalls = 'Total Calls : ' + response.total_calls;
            // this.totalInvalidCalls = 'Total Invalid Calls : ' + response.total_invalid_calls;
            // this.totalCallDuration = 'Total Call Duration :' + response.total_call_duration;
            // this.totalBreakTime = 'Total Break Time :' + response.total_break_time;
            // this.totalFreeTime = 'Total Free Time :' + response.total_free_time;
            this.totalCalls = response.data.total_calls;
            this.totalInvalidCalls = response.data.total_invalid_calls;
            this.totalCallDuration = response.data.total_call_duration;
            this.totalBreakTime = response.data.total_break_time;
            this.totalFreeTime = response.data.total_free_time;
        }, (err) => {
            console.log('Error in Total Call Report', err);
        })
    }

    todayAnsweredCalls() {
        this.callCountService.getCallAnsweredCount(this.reqObj).subscribe((response) => {
            this.totalCallsAnswered = response.data.response;
        }, (err) => {
            console.log('Error in Total Call Answered Report', err);
        })
    }

    todayVerifiedCalls() {
        this.callCountService.getCallVerifiedCount(this.reqObj).subscribe((response) => {
            console.log("verified response.data.response", response.data.response)
            this.totalVerifiedCalls = response.data.response;
        }, (err) => {
            console.log('Error in Total Calls Verified Report', err);
        })
    }

    close() {
        this.hide_component.emit('6');
    };

}