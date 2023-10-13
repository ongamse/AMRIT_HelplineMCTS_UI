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


import { Component, OnInit, Inject, Input } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { dataService } from '../services/dataService/data.service';
import { CallClosureService } from '../services/mcts-agent/call-closure/call-closure.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
    selector: 'app-medical-history-dialog',
    templateUrl: './medical-history-dialog.html'
})

export class MedicalHistoryDialogComponent implements OnInit {
    @Input('benRegID')
    benRegID: any;
    medHistory104: any;
    languageComponent: SetLanguageComponent;
    currentLanguageSet: any;
    

    constructor(private callClosureService: CallClosureService,
        private httpServiceService: HttpServices) {
    }

    ngOnInit() {
        this.fetchLanguageResponse();
    }

    ngOnChanges() {
        let obj = {
            'beneficiaryRegID': this.benRegID
        }
        this.get104MedicalHistory(obj);
    }
    get104MedicalHistory(obj) {
        this.callClosureService.getMedicalHistory(obj)
            .subscribe(response => {
                console.log(response.data, 'ben med history success');
                this.medHistory104 = response.data;
            }, err => {
                console.log(err, 'ben med history error');
            });
    }

    //AN40085822 23/10/2021 Integrating Multilingual Functionality --Start--
   ngDoCheck(){
    this.fetchLanguageResponse();
  }

  fetchLanguageResponse() {
    this.languageComponent = new SetLanguageComponent(this.httpServiceService);
    this.languageComponent.setLanguage();
    this.currentLanguageSet = this.languageComponent.currentLanguageObject; 
  }
  //--End--
}
