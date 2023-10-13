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
  selector: 'cancer-examination-case-sheet',
  templateUrl: './cancer-examination-case-sheet.component.html',
  styleUrls: ['./cancer-examination-case-sheet.component.css']
})
export class CancerExaminationCaseSheetComponent implements OnInit {

  @Input('data')
  casesheetData: any;

  gynecologicalImageUrl = 'assets/images/gynecologicalExamination.png';
  breastImageUrl = 'assets/images/breastExamination.png';
  abdominalImageUrl = 'assets/images/abdominalExamination.png';
  oralImageUrl = 'assets/images/oralExamination.png';

  signsAndSymptoms: any;
  BenCancerLymphNodeDetails: any;
  oralExamination: any;
  breastExamination: any;
  abdominalExamination: any;
  gynecologicalExamination: any;
  imageAnnotatedData: any;
  beneficiaryDetails: any;

  blankRows = [1, 2, 3, 4]
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
  

  constructor(private httpServiceService: HttpServices) { }

  ngOnInit() {
    this.fetchLanguageResponse();
  }

  ngOnChanges() {
    if (this.casesheetData) {
      if (this.casesheetData.BeneficiaryData)
        this.beneficiaryDetails = this.casesheetData.BeneficiaryData;

      this.signsAndSymptoms = this.casesheetData.nurseData.signsAndSymptoms;
      this.BenCancerLymphNodeDetails = this.casesheetData.nurseData.BenCancerLymphNodeDetails;
      this.oralExamination = this.casesheetData.nurseData.oralExamination;
      this.breastExamination = this.casesheetData.nurseData.breastExamination;
      this.abdominalExamination = this.casesheetData.nurseData.abdominalExamination;
      this.gynecologicalExamination = this.casesheetData.nurseData.gynecologicalExamination;
      this.imageAnnotatedData = this.casesheetData.ImageAnnotatedData;
    }
  }

  getImageAnnotation(imageID) {
    let arr = this.imageAnnotatedData.filter(item => item.imageID == imageID);
    return arr.length > 0 ? arr[0] : null;
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
