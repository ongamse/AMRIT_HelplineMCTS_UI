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


import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { OCWService } from '../services/mcts-agent/outbond-call-worklist/outbond-call-worklist.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';



@Component({
  selector: 'app-innerpage-agent-congenitalanomalies',
  templateUrl: './agent-congenitalanomalies.component.html',
  styleUrls: ['./agent-congenitalanomalies.component.css']
  //providers:[OCWService]
})

export class InnerpageAgentCongenitalAnomalies implements OnInit {
	@Output() showNext:EventEmitter<any> = new EventEmitter<any>();
	 public showCreateFlag=false;
	 serviceProviders: string[];
	 outbondWorklist: any;
	 outbondWorklistHRP: any;
	 data: any;
     @Input() historyDetails:any;
	currentLanguageSet: any;

	 constructor(private _OCWService: OCWService,public httpServices:HttpServices) {
	 	this.serviceProviders;

		 console.log("input in next child: ",this.historyDetails);
	 }

	ngOnInit() {
		//console.log("this is history",this.historyDetails)	
	}

	navigateToNext(){
		this.showNext.emit();
	}
	ngDoCheck() {
		this.assignSelectedLanguage();
	  }
	
	  assignSelectedLanguage() {
			const getLanguageJson = new SetLanguageComponent(this.httpServices);
			getLanguageJson.setLanguage();
			this.currentLanguageSet = getLanguageJson.currentLanguageObject;
		  }
}
