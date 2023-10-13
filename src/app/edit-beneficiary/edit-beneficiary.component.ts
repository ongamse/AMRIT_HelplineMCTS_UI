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
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { OCWService } from '../services/mcts-agent/outbond-call-worklist/outbond-call-worklist.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { dataService } from '../services/dataService/data.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-edit-beneficiary',
  templateUrl: './edit-beneficiary.component.html',
  styleUrls: ['./edit-beneficiary.component.css']
})
export class EditBeneficiaryComponent implements OnInit {
  editBenForm: FormGroup;

  benificiaryData: any;
  pncFlag: Boolean;
  ancFlag: boolean;
  flagForClearFix: Boolean;
  showProgressBar: Boolean = false;

  phoneNoTypes = ['Self', 'Asha', 'ANM', 'Spouse', 'Other'];
  currentLanguageSet: any;
  constructor(private formBuilder: FormBuilder, @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<EditBeneficiaryComponent>, private oCWService: OCWService,
    private alertService: ConfirmationDialogsService, public commonData: dataService,
    public httpServices:HttpServices) { }

  today: Date;
  maxlmpDate: Date;

  ngOnInit() {
    this.assignSelectedLanguage();
    this.createEditForm();
    this.phoneNoTypes;
    console.log(JSON.stringify(this.data.benObj, null, 4), "edit ben Obj before edit");
    // this.today = new Date();
    // let maxlmpDate: Date;
    // maxlmpDate = new Date();
    // maxlmpDate.setMonth(maxlmpDate.getMonth() - 10);
    // this.maxlmpDate = maxlmpDate.toISOString();
    // this.today = this.today.toISOString()
    // console.log('this.maxlmpDate.getFullYear()', this.today, maxlmpDate, this.maxlmpDate);
    this.patchData();
    this.pncFlag = (this.data.benObj.childValidDataHandler) ? true : false;
    this.flagForClearFix = (this.data.benObj.outboundCallType.slice(0, -1) == "PNC") ? true : false;
    this.ancFlag = (this.data.benObj.outboundCallType.slice(0, -1) == "ANC") ? true : false;
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.httpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }

  patchData() {
    if (this.data.benObj.childValidDataHandler != undefined) {
      this.benificiaryData = this.data.benObj.childValidDataHandler;
    } else {

      this.benificiaryData = this.data.benObj.mctsDataReaderDetail;
    }
    let phoneTypeTemp = this.phoneNoTypes.filter((item) => {
      if (this.benificiaryData.Phone_No_of != undefined && this.data.benObj.childValidDataHandler != undefined) {
        return item.toUpperCase() == (this.benificiaryData.Phone_No_of).toUpperCase();
      } else {
        if (this.benificiaryData.PhoneNo_Of_Whom != undefined) {
          return item.toUpperCase() == (this.benificiaryData.PhoneNo_Of_Whom).toUpperCase();

        }
      }
    })[0];
    if (this.data.benObj.childValidDataHandler != undefined) {
      this.editBenForm.patchValue({
        motherName: this.benificiaryData.Mother_Name, districtName: this.benificiaryData.District_Name, talukName: this.benificiaryData.Taluka_Name, healthBlock: this.benificiaryData.Block_Name, phcName: this.benificiaryData.PHC_Name,
        sfName: this.benificiaryData.SubCenter_Name, gpVillage: this.benificiaryData.GP_Village, phoneNo: this.benificiaryData.Phone_No, phoneNoType: phoneTypeTemp
        , ashaName: this.benificiaryData.ASHA_Name, anmName: this.benificiaryData.ANM_Name, ashaPhoneNo: this.benificiaryData.ASHA_Phone_No,
        anmPhoneNo: this.benificiaryData.ANM_Phone_No, childName: this.benificiaryData.Child_Name, dob: this.benificiaryData.DOB, address: this.benificiaryData.Address
      })
    } else {
      this.editBenForm.patchValue({
        motherName: this.benificiaryData.Name, husbandName: this.benificiaryData.Husband_Name, districtName: this.benificiaryData.District_Name, talukName: this.benificiaryData.Taluka_Name, healthBlock: this.benificiaryData.Block_Name, phcName: this.benificiaryData.PHC_Name,
        sfName: this.benificiaryData.SubCenter_Name, gpVillage: this.benificiaryData.GP_Village, phoneNo: this.benificiaryData.Whom_PhoneNo, phoneNoType: phoneTypeTemp
        , ashaName: this.benificiaryData.ASHA_Name, anmName: this.benificiaryData.ANM_Name,
        ashaPhoneNo: this.benificiaryData.ASHA_Ph, anmPhoneNo: this.benificiaryData.ANM_Ph, childName: this.benificiaryData.Child_Name, lmpDate: this.benificiaryData.LMP_Date, edd: this.benificiaryData.EDD,
        address: this.benificiaryData.Address
      })
      this.calMinAndMaxDateForLMP();
    }
  }

  blockKey(e: any) {
    if (e.keyCode === 9) {
      return true;
    }
    else {
      return false;
    }
  }

  get motherName() {
    return this.editBenForm.controls['motherName'].value;
  }

  get phoneNoType() {
    return this.editBenForm.controls['phoneNoType'].value;
  }

  get husbandName() {
    return this.editBenForm.controls['husbandName'].value;
  }

  get districtName() {
    return this.editBenForm.controls['districtName'].value;

  }

  get talukName() {
    return this.editBenForm.controls['talukName'].value;
  }
  get healthBlock() {
    return this.editBenForm.controls['healthBlock'].value;
  }

  get phcName() {
    return this.editBenForm.controls['phcName'].value;
  }

  get sfName() {
    return this.editBenForm.controls['sfName'].value;
  }

  get gpVillage() {
    return this.editBenForm.controls['gpVillage'].value;
  }

  get phoneNo() {
    return this.editBenForm.controls['phoneNo'].value;
  }

  get ashaName() {
    return this.editBenForm.controls['ashaName'].value;
  }

  get anmName() {
    return this.editBenForm.controls['anmName'].value;
  }

  get ashaPhoneNo() {
    return this.editBenForm.controls['ashaPhoneNo'].value;
  }

  get anmPhoneNo() {
    return this.editBenForm.controls['anmPhoneNo'].value;
  }

  get childName() {
    return this.editBenForm.controls['childName'].value;
  }

  get lmpDate() {
    return this.editBenForm.controls['lmpDate'].value;
  }

  get edd() {
    return this.editBenForm.controls['edd'].value;
  }

  get dob() {
    return this.editBenForm.controls['dob'].value;
  }

  get address() {
    return this.editBenForm.controls['address'].value;
  }

  createEditForm() {
    this.editBenForm = this.formBuilder.group({
      motherName: [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]{4,30}')])],
      husbandName: [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]{4,30}')])],
      districtName: [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]{4,30}')])],
      talukName: [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]{4,30}')])],
      healthBlock: [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]{4,30}')])],
      phcName: [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]{4,30}')])],

      sfName: [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]{4,30}')])],
      //gpVillage: [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]{4,30}')])],
      gpVillage: [null],
      phoneNo: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]{10}$')])],
      phoneNoType: [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]{4,30}')])],
      ashaName: [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]{4,30}')])],
      anmName: [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]{4,30}')])],

      //ashaPhoneNo: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]{10}$')])],
      ashaPhoneNo: [null],
      anmPhoneNo: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]{10}$')])],
      childName: [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]{4,30}')])],
      lmpDate: [null, Validators.required],
      edd: [null, Validators.required],

      dob: [null, Validators.required],
      address: [null, Validators.required]
    })
  }

  saveBenDetails() {
    this.showProgressBar = true;
    let temp;
    if (this.data.benObj.childValidDataHandler != undefined) {
      temp = Object.assign(this.benificiaryData, {
        Mother_Name: this.motherName,
        District_Name: this.districtName,
        Taluka_Name: this.talukName,
        Block_Name: this.healthBlock,
        PHC_Name: this.phcName,
        SubCenter_Name: this.sfName,
        GP_Village: this.gpVillage,
        Phone_No: this.phoneNo,
        Phone_No_of: this.phoneNoType,
        ASHA_Name: this.ashaName,
        ANM_Name: this.anmName,
        ASHA_Phone_No: this.ashaPhoneNo,
        ANM_Phone_No: this.anmPhoneNo,
        Child_Name: this.childName,
        DOB: this.dob,
        Address: (this.address !== undefined && this.address !== null) ? this.address.trim() : null
      }
      )
    } else {
      temp = Object.assign(this.benificiaryData, {
        Name: this.motherName,
        Husband_Name: this.husbandName,
        District_Name: this.districtName,
        Taluka_Name: this.talukName,
        Block_Name: this.healthBlock,
        PHC_Name: this.phcName,
        SubCenter_Name: this.sfName,
        GP_Village: this.gpVillage,
        Whom_PhoneNo: this.phoneNo,
        PhoneNo_Of_Whom: this.phoneNoType,
        ASHA_Name: this.ashaName,
        ANM_Name: this.anmName,
        ASHA_Ph: this.ashaPhoneNo,
        ANM_Ph: this.anmPhoneNo,
        LMP_Date: this.lmpDate,
        EDD: this.edd,
        //Child_Name: this.childName,
        //DOB: this.dob,
        Address: (this.address !== undefined && this.address !== null) ? this.address.trim() : null
      }
      )
    }
    delete temp['fileManager'];

    console.log('get tem', temp);
    if (this.data.benObj.childValidDataHandler != undefined) {
      this.data.benObj.childValidDataHandler = temp;
    } else {
      this.data.benObj.mctsDataReaderDetail = temp;
    }

    this.data.benObj = Object.assign(this.data.benObj, {
      changeInSelfDetails: true,
      changeInContacts: true,
      changeInAddress: true,
      vanID: this.commonData.current_serviceID
    })
    console.log(JSON.stringify(this.data.benObj, null, 4), "ben Obj after edit");
    
    this.oCWService.saveEditedBeneficiaryDetails(this.data.benObj).subscribe((response) => {
      if (response.statusCode == 200) {
        this.dialogRef.close(this.data.benObj);
        this.showProgressBar = false;
        this.alertService.alertConfirm(this.currentLanguageSet.beneficiaryDataUpdatedSuccessfully, 'success');
      }
    });
  }

  calculateEDD() {
    console.log('lmp', this.lmpDate);

    if (this.lmpDate != null) {
      let eddDate = new Date(this.lmpDate);
      // this.lastMPISO = new Date(this.lmpDate).toISOString();
      // console.log('this.lastMPISO', this.lastMPISO);
      eddDate.setDate(this.lmpDate.getDate() + 7);
      eddDate.setMonth(this.lmpDate.getMonth() + 9);
      this.editBenForm.patchValue({ edd: eddDate })
    } else {
      this.editBenForm.patchValue({ edd: null })
    }
  }

  calMinAndMaxDateForLMP() {
    this.today = new Date();
    this.maxlmpDate = new Date();
    this.maxlmpDate.setMonth(this.today.getMonth() - 10);
  }
}
