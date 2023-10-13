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


import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { CallAllocationService } from '../services/supervisorService/call-configuration.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { MdDialog } from '@angular/material';
import { dataService } from '../services/dataService/data.service';
import { NewMctsCallConfigurationComponent } from '../new-mcts-call-configuration/new-mcts-call-configuration.component';
import { EditCallConfigComponent } from '../edit-call-config/edit-call-config.component';
import { Router } from '@angular/router';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-inner-mcts-callconfiguration',
  templateUrl: './mcts-callconfiguration.component.html',
  styleUrls: ['./mcts-callconfiguration.component.css'],
  //providers:[]
})

export class InnerMctsCallConfiguration implements OnInit {

  providerServiceMapID: any;
  createdBy: any;
  recordsLength = 0;
  configKeysList = [];
  configList = [];
  minNewDate: Date;
  currentDate: any;
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
 
  constructor(private CallAllocationService: CallAllocationService, public dialog: MdDialog, private  httpServiceService: HttpServices, private dataService: dataService, public router: Router, private alertService: ConfirmationDialogsService) {

  }

  ngOnInit() {
    this.fetchLanguageResponse();
    let d: any = new Date();
    this.currentDate = new Date((d) - 1 * (d.getTimezoneOffset() * 60 * 1000)).toJSON();
    this.providerServiceMapID = this.dataService.currentService.serviceID;
    this.createdBy = this.dataService.uname;
    this.CallAllocationService.getConfigList({
      "providerServiceMapID": this.providerServiceMapID
    }).subscribe((response) => {
      console.log(response);
      this.recordsLength = Object.keys(response.data) ? Object.keys(response.data).length : 0;
      if (this.recordsLength) {
        this.configKeysList = Object.keys(response.data);
        console.log("response.data for configlist", response.data)
        this.configList = response.data;
        console.log(this.configList[this.configKeysList[this.configKeysList.length - 1]][0].effectiveUpto);
        this.minNewDate = new Date(this.configList[this.configKeysList[this.configKeysList.length - 1]][0].effectiveUpto);
        this.minNewDate.setDate(this.minNewDate.getDate() + 1);
        // for(var i =0 ; i < this.configKeysList.length; i++){
        // 	this.configList[this.configKeysList[i]] = this.configList[this.configKeysList[i]].filter(eachObj=>{
        // 		return eachObj.outboundCallType!="CONGENITAL_ANOMALIES"
        // 	});
        // }
      }
    },
      (error) => {
        console.log(error);
      });
  }

  onCreateNewConfig() {
    let newConfigDialog = this.dialog.open(NewMctsCallConfigurationComponent, {
      disableClose: true,
      height: "550px",
      width: "500px",
      data: {
        "minDate": this.minNewDate
      }
    });
    newConfigDialog.afterClosed()
      .subscribe((postData) => {
        console.log('postdat', postData);

        if (postData) {
          this.CallAllocationService.createCallConfig(postData)
            .subscribe(
            (response) => {
              console.log(response);
              this.alertService.alert(this.currentLanguageSet.succesfullyCreatedCallConfiguration, 'success');
              this.CallAllocationService.getConfigList({
                "providerServiceMapID": this.providerServiceMapID
              }).subscribe((response) => {
                console.log(response);
                this.recordsLength = Object.keys(response.data).length;
                this.configKeysList = Object.keys(response.data);
                this.configList = response.data;
                this.minNewDate = new Date(this.configList[this.configKeysList[this.configKeysList.length - 1]][0].effectiveUpto);
                this.minNewDate.setDate(this.minNewDate.getDate() + 1);
                // for(var i =0 ; i < this.configKeysList.length; i++){
                // 	this.configList[this.configKeysList[i]] = this.configList[this.configKeysList[i]].filter(eachObj=>{
                // 		return eachObj.outboundCallType!="CONGENITAL_ANOMALIES"
                // 	});
                // }
              },
                (error) => {
                  console.log(error);
                });
            },
            (error) => {
              console.log(error);
              this.alertService.alert(this.currentLanguageSet.failedToCreateCallConfiguration, 'error');
            });
        }
      },
      (error) => {
        console.log(error);
      });
  }

  editConfig(configData, event) {
    event.preventDefault();
    event.stopPropagation();
    // this.CallAllocationService.getConfigList({
    // 	"providerServiceMapID": this.providerServiceMapID
    // }).subscribe((response)=>{
    let editDialog = this.dialog.open(EditCallConfigComponent, {
      disableClose: true,
      // height:"600px",
      // width: 0.8 * window.innerWidth + "px",
      panelClass: 'panelC',
      data: {
        "configData": configData
      }
    });
    editDialog.afterClosed()
      .subscribe((data) => {
        if (data) {
          console.log(data);
          this.CallAllocationService.updateConfig(data)
            .subscribe((response) => {
              console.log(response);
              this.alertService.alert(response.data.response, 'success');
              this.CallAllocationService.getConfigList({
                "providerServiceMapID": this.providerServiceMapID
              }).subscribe((response) => {
                this.recordsLength = Object.keys(response.data).length;
                this.configKeysList = Object.keys(response.data);
                this.configList = response.data;
                this.minNewDate = new Date(this.configList[this.configKeysList[this.configKeysList.length - 1]][0].effectiveUpto);
                this.minNewDate.setDate(this.minNewDate.getDate() + 1);
                // for(var i =0 ; i < this.configKeysList.length; i++){
                // 	this.configList[this.configKeysList[i]] = this.configList[this.configKeysList[i]].filter(eachObj=>{
                // 		return eachObj.outboundCallType!="CONGENITAL_ANOMALIES"
                // 	});
                // }
              },
                (error) => {
                  console.log(error);
                });
            },
            (error) => {
              console.log(error);
            });
        }
      })
    // },
    // (error)=>{
    // 	console.log(error);
    // })
  }

  addQuestionaire(configData, number, event) {
    event.preventDefault();
    event.stopPropagation();
    // this.CallAllocationService.getConfigList({
    // 	"providerServiceMapID": this.providerServiceMapID
    // }).subscribe((response)=>{
    this.CallAllocationService.selectedCallConfig = configData;
    console.log(this.CallAllocationService.selectedCallConfig);
    this.CallAllocationService.selectedCallConfigName = "Configuration" + number;
    this.router.navigate(['/InnerpageComponent'], {
      queryParams: {
        number: '7'
      }
    });
    // },
    // (error)=>{
    // 	console.log(error);
    // });
  }

  deleteQuestionaire(configData, number, event) {
    event.preventDefault();
    event.stopPropagation();
    console.log(configData, 'Data Of COnfig');

    this.CallAllocationService.deleteConfig(configData)
      .subscribe(response => {
        if (response.data) {
          this.alertService.alert(response.data.response, 'success');
          this.CallAllocationService.getConfigList({
            'providerServiceMapID': this.providerServiceMapID
          }).subscribe((res) => {
            this.recordsLength = Object.keys(res.data).length;
            this.configKeysList = Object.keys(res.data);
            this.configList = res.data;
            this.minNewDate = new Date(this.configList[this.configKeysList[this.configKeysList.length - 1]][0].effectiveUpto);
            this.minNewDate.setDate(this.minNewDate.getDate() + 1);
          });
        }
      }, err => {
        console.log(err, 'Error while deleting call configuration');
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
