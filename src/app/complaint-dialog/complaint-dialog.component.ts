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


import { Component, OnInit, Inject, ViewChild, Injector } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { dataService } from '../services/dataService/data.service';
import { CallClosureService } from '../services/mcts-agent/call-closure/call-closure.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-complaint-dialog',
  templateUrl: './complaint-dialog.component.html',
  styleUrls: ['./complaint-dialog.component.css']
})
export class ComplaintDialogComponent implements OnInit {

  /*ngModels*/
  complaintType: any;
  complaintNature: any;
  complaintAgainst: any;
  state: any;
  district: any;
  taluk: any;
  institution: any;
  complaint_date: any;
  remarks: any;
  designation: any;
  today:any;

  /* Helping variables */
  providerServiceMapID: any;
  createdBy: any;
  serviceProviderID: any;
  userID: any;
  isNational: any;
  serviceID: any;

  /* Data filling arrays */
  states: any = [];
  districts: any = [];
  taluks: any = [];
  designations: any = [];
  complaintTypes: any = [];
  complaintNatures: any = [];
  institutes: any = [];

  /* Request creating arrays */
  objs = []; // array for UI
  postArray = []; // array for API call as request array


  @ViewChild('complaintForm') _complaintForm: NgForm;
  currentLanguageSet: any;


  constructor( @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<ComplaintDialogComponent>,
    private commonDataService: dataService,
    private callClosureService: CallClosureService,
    private alertService: ConfirmationDialogsService,public httpServices:HttpServices
    ,private injector: Injector) {
      this.httpServices = injector.get(HttpServices);
     }

  ngOnInit() {
    let today_date=new Date();
    this.today=new Date(today_date);
    console.log(this.data);
    this.providerServiceMapID = this.commonDataService.currentService.providerServiceMapID;
    this.createdBy = this.commonDataService.uname;
    this.userID = this.commonDataService.uid;
    // this.serviceID = '';
    // this.isNational = '';

    this.getServiceProviderID(this.providerServiceMapID);
    this.getFeedbackTypes();
    this.getDesignations();

  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
        const getLanguageJson = new SetLanguageComponent(this.httpServices);
        getLanguageJson.setLanguage();
        this.currentLanguageSet = getLanguageJson.currentLanguageObject;
      }
  preventTyping(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }


  getServiceProviderID(providerServiceMapID) {
    this.callClosureService.getServiceProviderID(providerServiceMapID)
      .subscribe(response => {
        console.log(response, 'response of get SP-ID');
        this.serviceProviderID = response.data.serviceProviderID;
        this.getService(this.userID);
      }, err => {
        console.log('error while fetching ServiceProviderID', err);
      });
  }

  getService(userID) {
    this.callClosureService.getServiceLine(userID)
      .subscribe(response => {
        let services = response.data;
        this.serviceID = services[0].serviceID;
        this.isNational = services[0].isNational;
        this.getProviderSpecificStates();
      }, err => {

      })
  }

  getFeedbackTypes() {
    this.callClosureService.getFeedbackTypes({
      'providerServiceMapID': this.providerServiceMapID
    }).subscribe((response) => {
      console.log('Feedback Types', response);
      this.complaintTypes = response.data;
    },
      (error) => {
        console.log(error);
      });
  }

  getDesignations() {
    this.callClosureService.getDesignations({
      'providerServiceMapID': this.providerServiceMapID
    }).subscribe((response) => {
      console.log('Designations', response);
      this.designations = response.data;
    },
      (err) => {
        console.log(err);
      });
  }

  getComplaintNature(complaintType) {
    this.callClosureService.getFeedbackNature({
      'providerServiceMapID': this.providerServiceMapID,
      'feedbackTypeID': complaintType.feedbackTypeID
    }).subscribe((response) => {
      console.log('Feedback Nature', response);
      this.complaintNatures = response.data;
    },
      (error) => {
        console.log(error);
      });
  }


  getProviderSpecificStates() {
    let obj = {
      'userID': this.userID,
      'serviceID': this.serviceID,
      'isNational': this.isNational
    }
    this.callClosureService.getStates(obj)
      .subscribe(response => {
        this.states = response.data;
        // this.getDistricts(this.stateID);
      }, err => {
        console.log('error while fetching states', err);
      })
  }

  getDistricts(stateID) {
    console.log('stateID', stateID);
    this.callClosureService.getDistricts(stateID)
      .subscribe(response => {
        console.log('districts', response);
        this.districts = response.data;
      }, err => {
        console.log('error while fetching districts', err);
      })
  }

  getTaluks(districtID) {
    this.callClosureService.getTaluks(districtID).subscribe(response => {
      this.taluks = response.data;
    });
  }

  getInstitutes(stateID, districtID, talukID) {
    let request_obj = {
      'providerServiceMapID': this.providerServiceMapID,
      'stateID': stateID,
      'districtID': districtID,
      'blockID': talukID
    }
    this.callClosureService.getInstitutes(request_obj)
      .subscribe(response => {
        this.institutes = response.data;
        if (response.data.length < 1) {
          this.alertService.alert('Institute does not exist. Contact your administrator for mapping');
        }
      }, err => {
        console.log('error while fetching institutes', err);
      })
  }

  add_obj(form_values) {
    var tempObj = {
      'feedbackTypeName': form_values.ComplaintType.feedbackTypeName,
      'feedbackNature': form_values.ComplaintNature.feedbackNature,
      'designationName': form_values.Designation.designationName
    }

    let date_of_complaint: Date = new Date(form_values.doc);
    date_of_complaint.setHours(0);
    date_of_complaint.setMinutes(0);
    date_of_complaint.setSeconds(0);
    date_of_complaint.setMilliseconds(0);

    var reqObj = {
      'createdBy': this.createdBy,
      'serviceID': this.providerServiceMapID,
      'benCallID': this.commonDataService.callDetailID,
      'beneficiaryRegID': this.data.benRegID,
      'feedbackTypeID': form_values.ComplaintType.feedbackTypeID,
      'feedbackNatureID': form_values.ComplaintNature.feedbackNatureID,
      'designationID': form_values.Designation.designationID,
      'institutionID': form_values.Institution,
      'feedbackAgainst': (form_values.ComplaintAgainst !== undefined && form_values.ComplaintAgainst !== null) ? form_values.ComplaintAgainst.trim(): null,
      'feedback': (form_values.Remarks !== undefined && form_values.Remarks !== null) ? form_values.Remarks.trim(): null,
      'serviceAvailDate': new Date(date_of_complaint.valueOf() - 1 * date_of_complaint.getTimezoneOffset() * 60 * 1000),
    }
    console.log(tempObj);
    console.log(reqObj);
    this.objs.push(tempObj);
    this.postArray.push(reqObj);
    this._complaintForm.resetForm();
  }


  remove_obj(index) {
    this.objs.splice(index, 1);
    this.postArray.splice(index, 1);
  }

  saveComplaints() {
    console.log(this.postArray);
    this.dialogRef.close(this.postArray);
  }

}
