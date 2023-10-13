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
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { GenerateBeneficiaryID } from '../services/generateBeneficiaryService/generateBenIDservice.service';
import { dataService } from '../services/dataService/data.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-generate-benificiary-id',
  templateUrl: './generate-benificiary-id.component.html',
  styleUrls: ['./generate-benificiary-id.component.css']
})
export class GenerateBenificiaryIDComponent implements OnInit {
  benData: any;
  motherReportList: any = [];
  childReportList: any = [];
  rowIsSelected = false;
  is_motherRecord = false;

  providerServiceMapID: any;
  serviceProviderID: any;
  current_StateID: any;
  userID: any;
  isNational: any;
  serviceID: any;


  states: any = [];
  districts: any = [];
  genders: any = [];

  // search criteria ngModels
  firstname: any;
  lastname: any;
  gender: any;
  beneficiaryID: any;
  state: any;
  district: any;
  contactNumber: any;

  searchBeneficiaryObj: any;
  ben_searched = false;
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
  

  constructor(public dialogRef: MdDialogRef<GenerateBenificiaryIDComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    public generateBenIDservice: GenerateBeneficiaryID,
    private httpServiceService: HttpServices,
    public commonData: dataService) { }

  ngOnInit() {

    this.fetchLanguageResponse();
    this.providerServiceMapID = this.commonData.userPriveliges[0].providerServiceMapID;
    this.userID = this.commonData.uid;
    // this.current_StateID = this.commonData.userPriveliges[0].stateID;
    this.benData = this.data.benObj;
    this.getServiceProviderID(this.providerServiceMapID);
    this.getGenders();

    console.log('***Beneficiary Details***', JSON.stringify(this.benData));

  }

  getServiceProviderID(providerServiceMapID) {
    this.generateBenIDservice.getServiceProviderID(providerServiceMapID)
      .subscribe(response => {
        console.log(response, 'RESPONSEEEEEEEEEE');
        this.serviceProviderID = response.data.serviceProviderID;
        this.current_StateID = response.data.stateID;
        this.getService(this.userID);
        // this.getProviderSpecificStates(this.serviceProviderID);
      }, err => {
        console.log('error while fetching ServiceProviderID', err);
      });
  }

  getService(userID) {
    this.generateBenIDservice.getServiceLine(userID)
      .subscribe(response => {
        let services = response.data;
        this.serviceID = services[0].serviceID;
        this.isNational = services[0].isNational;
        this.getProviderSpecificStates();
      }, err => {

      })
  }

  getProviderSpecificStates() {
    let obj = {
      'userID': this.userID,
      'serviceID': this.serviceID,
      'isNational': this.isNational
    }
    this.generateBenIDservice.getStates(obj)
      .subscribe(response => {
        this.states = response.data;
        this.getDistricts(this.current_StateID);
      }, err => {
        console.log('error while fetching states', err);
      })
  }

  getDistricts(stateID) {
    this.generateBenIDservice.getDistricts(stateID)
      .subscribe(response => {
        this.districts = response.data;
      }, err => {
        console.log('error while fetching districts', err);
      })
  }

  getGenders() {
    this.generateBenIDservice.getGenders()
      .subscribe(response => {
        this.genders = response.data.m_genders;
        console.log(this.genders, "GENDERS");
        this.populate();
      }, err => {
        console.log('error while fetching genders', err);
        this.populate();
      });

  }
  populate() {
    if (this.benData.childValidDataHandler) {
      this.is_motherRecord = false;
      // this.searchBeneficiary_mother(this.data.benObj);
      this.populateSearchForm_withChildData(this.benData.childValidDataHandler);
    } else {
      this.is_motherRecord = true;
      // this.searchBeneficiary_child(this.data.benObj);
      this.populateSearchForm_withMotherData(this.benData.mctsDataReaderDetail);
    }
  }
  populateSearchForm_withMotherData(obj) {
    let name = obj.Name.split(' ');

    this.firstname = name[0];
    if (name.length > 1) {
      this.lastname = name[name.length - 1];
    }
    this.gender = 2, // hardcoding gender as 2 i.e 'Female' as its Mother
      this.beneficiaryID = obj.beneficiaryID ? obj.beneficiaryID : '';
    this.state = obj.State_Name;
    this.district = this.districts.filter(function (item) {
      if (item.districtName === obj.District_Name) {
        return obj.District_Name;
      } else {
        return undefined;
      }
    });
    this.contactNumber = obj.Whom_PhoneNo;
  }

  populateSearchForm_withChildData(obj) {
    let name = obj.Child_Name.split(' ');
    this.firstname = name[0];
    if (name.length > 1) {
      this.lastname = name[name.length - 1];
    }
    console.log(obj + "DAAATA");
    if (obj.Gender != undefined) {
      let gender = obj.Gender;
      console.log(this.genders);

      let genderTemp = this.genders.filter(function (item) {
        if (gender.toLowerCase() == item.genderName.toLowerCase()) {
          return item;
        }
      })
      this.gender = genderTemp[0].genderID;
    }
    //this.gender = obj.Gender_ID ? obj.Gender_ID : undefined;

    this.beneficiaryID = obj.beneficiaryID ? obj.beneficiaryID : '';
    this.state = obj.State_Name;
    this.district = this.districts.filter(function (item) {
      if (item.districtName === obj.District_Name) {
        return obj.District_Name;
      } else {
        return undefined;
      }
    });
    this.contactNumber = obj.Phone_No;
  }

  searchBeneficiary(form_values, is_motherRecord) {
    let obj = {
      'beneficiaryID': form_values.BeneficiaryID,
      'firstName': form_values.Firstname,
      'lastName': form_values.Lastname,
      'genderID': form_values.Gender,
      // 'genderName': '',
      'outboundCallType': this.benData.outboundCallType,
      'stateID': '',
      'stateName': form_values.State,
      'districtID': '',
      'districtName': form_values.District,
      'contactNumber': form_values.ContactNumber
    };

    // Setting the NAMES/IDs of the obj fields by searching from their master data
    this.states.filter((item) => {
      if (item.stateName.toLowerCase() === form_values.State.toLowerCase()) {
        obj['stateID'] = item.stateID;
      }
    });

    this.districts.filter((item) => {
      if (item.districtName.toLowerCase() === form_values.District.toLowerCase()) {
        obj['districtID'] = item.districtID;
      }
    });

    // this.genders.filter((item) => {
    //   if (item.genderID === form_values.Gender) {
    //     obj['genderName'] = item.genderName;
    //   }
    // });

    // searching the beneficiary
    this.generateBenIDservice.searchBeneficiary(obj)
      .subscribe(response => {
        console.log('search successful', response);
        if (is_motherRecord) {
          this.motherReportList = response.data;
          console.log('mother search data', this.motherReportList)
          this.searchBeneficiaryObj = obj;
          this.ben_searched = true;
        } else {
          this.childReportList = response.data;
          console.log('child search data', this.childReportList);
          this.searchBeneficiaryObj = obj;
          this.ben_searched = true;
        }

      }, err => {
        console.log('Search error', err);
        this.motherReportList = [];
        this.childReportList = [];
        this.searchBeneficiaryObj = undefined;
        this.ben_searched = false;
      })
  }

  // searchBeneficiary_mother(obj) {
  //   this.generateBenIDservice.searchBeneficiary(obj)
  //     .subscribe(response => {
  //       console.log('search successful', response);
  //       this.motherReportList = response.data;
  //     }, err => {
  //       console.log('Search error', err);
  //       this.motherReportList = [];
  //     })
  // }

  // searchBeneficiary_child(obj) {
  //   this.generateBenIDservice.searchBeneficiary(obj)
  //     .subscribe(response => {
  //       console.log('search successful', response);
  //       this.childReportList = response.data;
  //     }, err => {
  //       console.log('Search error', err);
  //       this.childReportList = [];
  //     })
  // }

  createBeneficiaryID_forMother() {
    let benDataWithVanID = this.benData;
    benDataWithVanID.vanID = this.commonData.current_serviceID;
    let obj = {
      'mctsOutboundCall': benDataWithVanID,
      'beneficiarySearchModal': this.searchBeneficiaryObj
    }
    obj['beneficiarySearchModal'].createdBy = this.commonData.uname;
    this.generateBenIDservice.createBeneficiaryID(obj)
      .subscribe(response => {
        console.log('createBeneficiaryID_forMother: ', (response['_body']));
        response = (response['_body']).replace(/(\d+)([\[:.])?(\d+)([,\}\]])/g, "\"$1$2$3\"$4");
        response = JSON.parse(response);
        //this.dataService.benObj = response.data;
        console.log('create ben ID successful', response);
        if (response.data.mctsDataReaderDetail.BeneficiaryRegID != undefined) {
          let obj = {
            'status': 'success',
            'data': response.data
          }
          this.commonData.benObj = response.data;
          this.dialogRef.close(obj);
        }
      }, err => {
        console.log('create ben ID error', err);
      });
  }



  createBeneficiaryID_forChild() {
    let benDataWithVanID = this.benData;
    benDataWithVanID.vanID = this.commonData.current_serviceID;
    let obj = {
      'mctsOutboundCall': benDataWithVanID,
      'beneficiarySearchModal': this.searchBeneficiaryObj
    }
    obj['beneficiarySearchModal'].createdBy = this.commonData.uname;
    this.generateBenIDservice.createBeneficiaryID(obj)
      .subscribe(response => {
        console.log('createBeneficiaryID_forChild: ', (response['_body']));
        response = (response['_body']).replace(/(\d+)([\[:.])?(\d+)([,\}\]])/g, "\"$1$2$3\"$4");
        response = JSON.parse(response);
        console.log('create ben ID successful', response);
        if (response.data.childValidDataHandler.BeneficiaryRegID != undefined) {
          let obj = {
            'status': 'success',
            'data': response.data
          }
          this.commonData.benObj = response.data;
          this.dialogRef.close(obj);
        }
      }, err => {
        console.log('create ben ID error', err);
      });
  }

  createBeneficiaryID_forFoundResult_mother(beneficiaryRegID, beneficiaryID) {
    this.benData.mctsDataReaderDetail['BeneficiaryRegID'] = beneficiaryRegID;
    this.benData.mctsDataReaderDetail['beneficiaryID'] = beneficiaryID;
    let benDataWithVanID = this.benData;
    benDataWithVanID.vanID = this.commonData.current_serviceID;
    this.generateBenIDservice.createBeneficiaryID_ifRecordSelected(benDataWithVanID)
      .subscribe(response => {
        console.log('createBeneficiaryID_forFoundResult_mother: ', (response['_body']));
        response = (response['_body']).replace(/(\d+)([\[:.])?(\d+)([,\}\]])/g, "\"$1$2$3\"$4");
        response = JSON.parse(response);
        console.log(response, 'RESPONSE AFTER REGISTRATION AFTER ROW SELECT');
        let obj = {
          'status': 'success',
          'data': response.data
        }
        this.commonData.benObj = response.data;
        this.dialogRef.close(obj);
      }, err => {
        console.log('create ben ID error when row selected', err);
      })
  }

  createBeneficiaryID_forFoundResult_child(beneficiaryRegID, beneficiaryID) {
    this.benData.childValidDataHandler['BeneficiaryRegID'] = beneficiaryRegID;
    this.benData.childValidDataHandler['beneficiaryID'] = beneficiaryID;
    let benDataWithVanID = this.benData;
    benDataWithVanID.vanID = this.commonData.current_serviceID;
    this.generateBenIDservice.createBeneficiaryID_ifRecordSelected(benDataWithVanID)
      .subscribe(response => {
        console.log('createBeneficiaryID_forFoundResult_child: ', (response['_body']));
        response = (response['_body']).replace(/(\d+)([\[:.])?(\d+)([,\}\]])/g, "\"$1$2$3\"$4");
        response = JSON.parse(response);
        console.log(response, 'RESPONSE AFTER REGISTRATION AFTER ROW SELECT');
        let obj = {
          'status': 'success',
          'data': response.data
        }
        this.commonData.benObj = response.data;
        this.dialogRef.close(obj);
      }, err => {
        console.log('create ben ID error when row selected', err);
      })
  }

  closure() {
    let obj = {
      'status': 'closure',
    }
    this.dialogRef.close(obj);
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
