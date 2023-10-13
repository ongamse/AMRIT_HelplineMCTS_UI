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


import { Component, OnInit, Input } from '@angular/core';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'cancer-doctor-diagnosis-case-sheet',
  templateUrl: './cancer-doctor-diagnosis-case-sheet.component.html',
  styleUrls: ['./cancer-doctor-diagnosis-case-sheet.component.css']
})
export class CancerDoctorDiagnosisCaseSheetComponent implements OnInit {

  @Input('data')
  casesheetData: any;

  beneficiaryDetails: any;
  currentVitals: any;
  caseSheetDiagnosisData: any;
  date: any;
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
  

  constructor( private httpServiceService: HttpServices) { }

  ngOnInit() {
    this.fetchLanguageResponse();
    let t = new Date();
    this.date = t.getDate() + "/" + t.getMonth() + "/" + t.getFullYear();
  }

  ngOnChanges() {
    console.log(this.casesheetData);

    if (this.casesheetData) {
      if (this.casesheetData.BeneficiaryData)
        this.beneficiaryDetails = this.casesheetData.BeneficiaryData;

      if (this.casesheetData.nurseData && this.casesheetData.nurseData.currentVitals)
        this.currentVitals = this.casesheetData.nurseData.currentVitals;

      if (this.casesheetData.doctorData && this.casesheetData.doctorData.diagnosis)
        this.caseSheetDiagnosisData = this.casesheetData.doctorData.diagnosis;
    }

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
