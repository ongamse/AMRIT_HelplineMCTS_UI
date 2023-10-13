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
  selector: 'app-history-case-sheet',
  templateUrl: './history-case-sheet.component.html',
  styleUrls: ['./history-case-sheet.component.css']
})
export class HistoryCaseSheetComponent implements OnInit {

  @Input('data')
  caseSheetData: any;


  pastIllnessList: any;
  pastSurgeryList: any;
  familyHistory: any;
  childOptionalVaccineList: any;
  comorbidConditionList: any;
  medicationHistoryList: any;
  femaleObstetricHistory: any;
  developmentalHistory: any;
  feedingHistory: any;
  menstrualHistory: any;
  perinatalHistory: any
  personalHistory: any;
  immunizationHistory: any;

  beneficiary: any;
  ANCDetailsAndFormula: any;
  generalhistory: any;
  blankRows = [1, 2, 3, 4];
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
  

  constructor(private httpServiceService: HttpServices) { }

  ngOnInit() {
    this.fetchLanguageResponse();
  }


  ngOnChanges() {
    if (this.caseSheetData && this.caseSheetData.BeneficiaryData) {
      this.beneficiary = this.caseSheetData.BeneficiaryData;
      if (this.caseSheetData.nurseData && this.caseSheetData.nurseData.history) {
        this.generalhistory = this.caseSheetData.nurseData.history;
        if (this.caseSheetData.nurseData.anc)
          this.ANCDetailsAndFormula = this.caseSheetData.nurseData.anc.ANCCareDetail;
        if (this.caseSheetData.nurseData.history.PastHistory && this.caseSheetData.nurseData.history.PastHistory.pastIllness)
          this.pastIllnessList = this.caseSheetData.nurseData.history.PastHistory.pastIllness;
        if (this.caseSheetData.nurseData.history.PastHistory && this.caseSheetData.nurseData.history.PastHistory.pastSurgery)
          this.pastSurgeryList = this.caseSheetData.nurseData.history.PastHistory.pastSurgery;
        if (this.caseSheetData.nurseData.history.FamilyHistory)
          this.familyHistory = this.caseSheetData.nurseData.history.FamilyHistory;
        if (this.caseSheetData.nurseData.history.childOptionalVaccineHistory && this.caseSheetData.nurseData.history.childOptionalVaccineHistory.childOptionalVaccineList)
          this.childOptionalVaccineList = this.caseSheetData.nurseData.history.childOptionalVaccineHistory.childOptionalVaccineList;
        if (this.caseSheetData.nurseData.history.ComorbidityConditions && this.caseSheetData.nurseData.history.ComorbidityConditions.comorbidityConcurrentConditionsList)
          this.comorbidConditionList = this.caseSheetData.nurseData.history.ComorbidityConditions.comorbidityConcurrentConditionsList;
        if (this.caseSheetData.nurseData.history.MedicationHistory && this.caseSheetData.nurseData.history.MedicationHistory.medicationHistoryList)
          this.medicationHistoryList = this.caseSheetData.nurseData.history.MedicationHistory.medicationHistoryList;
        if (this.caseSheetData.nurseData.history.FemaleObstetricHistory)
          this.femaleObstetricHistory = this.caseSheetData.nurseData.history.FemaleObstetricHistory;
        if (this.caseSheetData.nurseData.history.DevelopmentHistory)
          this.developmentalHistory = this.caseSheetData.nurseData.history.DevelopmentHistory;
        if (this.caseSheetData.nurseData.history.FeedingHistory)
          this.feedingHistory = this.caseSheetData.nurseData.history.FeedingHistory;
        if (this.caseSheetData.nurseData.history.MenstrualHistory)
          this.menstrualHistory = this.caseSheetData.nurseData.history.MenstrualHistory;
        if (this.caseSheetData.nurseData.history.PerinatalHistory)
          this.perinatalHistory = this.caseSheetData.nurseData.history.PerinatalHistory;
        if (this.caseSheetData.nurseData.history.PersonalHistory)
          this.personalHistory = this.caseSheetData.nurseData.history.PersonalHistory;
        console.log('generalhistory', JSON.stringify(this.generalhistory, null, 4));
      }
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