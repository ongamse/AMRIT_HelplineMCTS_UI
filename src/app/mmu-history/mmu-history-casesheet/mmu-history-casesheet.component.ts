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


import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-mmu-history-casesheet',
  templateUrl: './mmu-history-casesheet.component.html',
  styleUrls: ['./mmu-history-casesheet.component.css']
})
export class MmuHistoryCasesheetComponent implements OnInit {
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
  

  constructor(@Inject(MD_DIALOG_DATA) public data: any,
  private httpServiceService: HttpServices,
  public dialogRef: MdDialogRef<MmuHistoryCasesheetComponent>) { }
  QC: boolean = false;
  General: boolean = false;
  NCDScreening: boolean = false;
  CancerScreening: boolean = false;

  ngOnInit() {
    this.fetchLanguageResponse();
    let caseSheetVisitCategory = this.data.visitCategory;
    this.caseSheetCategory(caseSheetVisitCategory);
  }

  caseSheetCategory(caseSheetVisitCategory) {
    const type = caseSheetVisitCategory;

    if (type) {
      switch (type) {
        case 'Cancer Screening':
          this.CancerScreening = true;
          break;

        case 'General OPD (QC)':
        case 'General OPD':
        case 'NCD care':
        case 'PNC':
        case 'ANC':
          this.General = true;
          break;

        default:
          this.QC = false;
          this.NCDScreening = false;
          this.CancerScreening = false;
          this.General = false;
          break;
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
