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


import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { CzentrixServices } from '../services/czentrixService/czentrix.service';
import { Router } from '@angular/router';
import { SocketService } from '../services/socketService/socket.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-service-role-selection',
  templateUrl: './service-role-selection.component.html',
  styleUrls: ['./service-role-selection.component.css']
})
export class ServiceRoleSelectionComponent implements OnInit {
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
  

  constructor(public getCommonData: dataService, public router: Router, private httpServiceService: HttpServices, private czentrixService: CzentrixServices, private socketService: SocketService) { }
  privleges: any;
  
  ngOnInit() {
    this.fetchLanguageResponse();
    let tempPrev:any = [];
    this.privleges = this.getCommonData.userPriveliges.filter((userPrivelige) => {
      return userPrivelige.serviceName == "MCTS";
    });
    //this.privleges = this.getCommonData.userPriveliges;
    console.log(this.privleges);
    this.getCommonData.sendHeaderStatus.next("Role Selection");


    // this.router.navigate(['/MultiRoleScreenComponent', { outlets: { 'postLogin_router': [''] } }]);
  }

  route2dashboard(role, service) {
    this.getCommonData.currentService = service;
    sessionStorage.setItem('apiman_key', service.apimanClientKey);
    console.log(service, 'SERVICE');
    console.log(role, 'ROLE');
    this.getCommonData.currentRole = role;
    this.getCommonData.current_workingLocationID = role.workingLocationID;

    let roleName = role.RoleName;
    let screen_name = role.serviceRoleScreenMappings[0].screen.screenName;

    if (screen_name !== undefined && screen_name !== null && screen_name.trim().toUpperCase() === 'MC_Tracking_MO'.toUpperCase()) {
      this.getCommonData.Role_Name = 'MO';
    }
    if (screen_name !== undefined && screen_name !== null && screen_name.trim().toUpperCase() === 'MC_Tracking_ANM'.toUpperCase()) {
      this.getCommonData.Role_Name = 'ANM';
    }
    if (screen_name !== undefined && screen_name !== null && screen_name.trim().toUpperCase() === 'Supervising'.toUpperCase()) {
      this.getCommonData.Role_Name = 'SUPERVISOR';
    }

    // socket code start

    // this.socketService.getDebugMessage().subscribe((data)=>{
    //   console.log("Received", data.message);
    // })
    let providerServiceMapID = service.providerServiceMapID;
    let finalArray = [
      providerServiceMapID + "_" + roleName,
      providerServiceMapID + "_" + roleName + "_" + role.workingLocationID,
      providerServiceMapID + "_" + role.workingLocationID.toString()
    ]
    console.log(finalArray);
    // this.socketService.sendRoomsArray({ userId: this.getCommonData.uid, role: finalArray });

    //end of socket code

    this.czentrixService.agent_id = (role.agentID ? role.agentID : (this.getCommonData.agentID ? this.getCommonData.agentID : undefined));
    this.getCommonData.roleSelected.next({
      'id': this.czentrixService.agent_id,
      'role': role.RoleName,
      'service': service.serviceName
    });
    console.log(roleName.trim().toUpperCase(), "RoleName");
    if (screen_name !== undefined && screen_name !== null && screen_name.trim().toUpperCase() === 'MC_Tracking_MO'.toUpperCase()) {
      this.router.navigate(['/MultiRoleScreenComponent', { outlets: { 'postLogin_router': ['dashboard', { role: "AGENT" }] } }]);
    }

    if (screen_name !== undefined && screen_name !== null && screen_name.trim().toUpperCase() === 'MC_Tracking_ANM'.toUpperCase()) {
      this.router.navigate(['/MultiRoleScreenComponent', { outlets: { 'postLogin_router': ['dashboard', { role: "AGENT" }] } }]);
    }

    if (screen_name !== undefined && screen_name !== null && screen_name.trim().toUpperCase() === 'Supervising'.toUpperCase()) {
      this.router.navigate(['/MultiRoleScreenComponent', { outlets: { 'postLogin_router': ['dashboard', { role: "Supervisor" }] } }]);
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
