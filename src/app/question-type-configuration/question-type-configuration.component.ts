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


import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { QuestionaireService } from '../services/questionaireService/questionaire-service';
import { MdDialog, MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { AddQuestionaireComponent } from '../add-questionaire/add-questionaire.component';
import { EditQuestionaireComponent } from '../edit-questionaire/edit-questionaire.component';
import { ActivatedRoute } from '@angular/router';
import { CallAllocationService } from '../services/supervisorService/call-configuration.service';
import { Router } from '@angular/router';
import { MapQuestionaireComponent } from '../map-questionaire/map-questionaire.component';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

// import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-inner-question-type-configuration',
  templateUrl: './question-type-configuration.component.html',
  styleUrls: ['./question-type-configuration.component.css']
})
export class InnerQuestionTypeConfigurationComponent implements OnInit {

  @ViewChild('questionTypeConfigForm') questionTypeConfigForm: NgForm;
  providerServiceMapID: any;
  createdBy: any;
  callTypes: any;
  listDisplay: boolean = false;
  questionrows = [];
  postData: any;
  configName: any;
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
  

  constructor(private dataService: dataService, private questionaireService: QuestionaireService, private httpServiceService: HttpServices, public dialog: MdDialog, public route: ActivatedRoute,
    private CallAllocationService: CallAllocationService, private alertService: ConfirmationDialogsService, public router: Router, ) { }

  ngOnInit() {
    this.fetchLanguageResponse();
    this.providerServiceMapID = this.dataService.currentService.serviceID;
    this.createdBy = this.dataService.uname;
    this.callTypes = this.CallAllocationService.selectedCallConfig;
    this.configName = this.CallAllocationService.selectedCallConfigName;
    // this.route.queryParams.subscribe((params)=>{
    //   console.log(JSON.parse(params['configData']));
    // });
    console.log(this.callTypes);
  }

  onSubmit() {
    console.log(this.questionTypeConfigForm.value);
    this.postData = {
      "mctsQAMappingDetail": {
        "providerServiceMapID": this.providerServiceMapID,
        "outboundCallType": this.questionTypeConfigForm.value.callType,
        "effectiveFrom": this.callTypes[0].effectiveFrom
      }
    };
    console.log(JSON.stringify(this.postData));
    this.questionaireService.getQuestionaire(this.postData)
      .subscribe((response) => {
        this.listDisplay = true;
        console.log(response.data);
        this.questionrows = response.data.questions;
      },
      (error) => {
        console.log(error);
      })
  }

  onEditClick(row) {
    // event.preventDefault();
    console.log(row);
    let editDialog = this.dialog.open(EditQuestionaireComponent, {
      disableClose: true,
      height: "500px",
      width: '800px',
      data: {
        "selectedQuestion": row
      }
    });
    editDialog.afterClosed()
      .subscribe((response) => {
        console.log(response);
        if (response) {
          this.alertService.alert(response.data.response, 'success');
          //refreshing screen after dialog closes
          this.questionaireService.getQuestionaire(this.postData)
            .subscribe((response) => {
              // this.listDisplay = true;
              console.log(response.data);
             this.questionrows = response.data.questions;
                           
            },
            (error) => {
              console.log(error);
              this.alertService.alert( error.errorMessage , 'error');
            });
        } else {
          this.questionaireService.getQuestionaire(this.postData)
            .subscribe((response) => {
              // this.listDisplay = true;
              console.log(response.data);
              this.questionrows = response.data.questions;
            },
            (error) => {
              console.log(error);
              this.alertService.alert( error.errorMessage , 'error');
            });
        }
      },
      (error) => {
        console.log(error);
        this.alertService.alert( error.errorMessage , 'error');
      })
  }

  onDeleteClick(row, event) {
    event.preventDefault();
    console.log("row data:",row);
    this.alertService.confirm('', this.currentLanguageSet.areYouSureYouWantToDelete)
      .subscribe((response) => {
        if (response) {
          this.questionaireService.deleteQuestionaire(
            row
            //"questionID": row.questionnaireDetail.questionID
          ).subscribe((response) => {
            console.log(response);
            if (response) {
              console.log(response);
              this.alertService.alert(response.data.response, 'success');
              //refreshing screen after dialog closes
              this.questionaireService.getQuestionaire(this.postData)
                .subscribe((response) => {
                  // this.listDisplay = true;
                  console.log(response.data);
                  this.questionrows = response.data.questions;
                },
                (error) => {
                  console.log(error);
                  this.alertService.alert( error.errorMessage , 'error');
                });
            }
          },
            (error) => {
              console.log(error);
              this.alertService.alert( error.errorMessage , 'error');
            });
        }
      });
  }
onDeleteMultiple(){
  let deleteDialog = this.dialog.open(DeleteMultipleComponent, {
    disableClose: true,
    height: "500px",
    width: '900px',
    data: {
      "questionrows": this.questionrows,
      "postData":this.postData
    }
  });
  deleteDialog.afterClosed()
    .subscribe((response) => {
      console.log(response);
      if (response) {
        this.alertService.alert(response.data.response, 'success');
        //refreshing screen after dialog closes
        this.questionaireService.getQuestionaire(this.postData)
          .subscribe((response) => {
            // this.listDisplay = true;
            console.log(response.data);
            this.questionrows = response.data.questions;
          },
          (error) => {
            console.log(error);
            this.alertService.alert( error.errorMessage , 'error');
          });
      } else {
        this.questionaireService.getQuestionaire(this.postData)
          .subscribe((response) => {
            // this.listDisplay = true;
            console.log(response.data);
            this.questionrows = response.data.questions;
          },
          (error) => {
            console.log(error);
            this.alertService.alert( error.errorMessage , 'error');
          });
      }
    },
    (error) => {
      this.alertService.alert( error.errorMessage , 'error');
    })
}
  onAddQuestions() {
    let questiontype = this.questionCallType;
    let displayOBCCallType = this.callTypes.filter(function (obj) {
      if (obj.outboundCallType == questiontype) {
        return obj.displayOBCallType;
      }
    });

    console.log(displayOBCCallType);
    let addQuestionareDialog = this.dialog.open(AddQuestionaireComponent, {
      disableClose: true,
      width: "800px",
      height: "500px",
      panelClass: 'm-w-100',
      data: {
        "displayOBCallType": displayOBCCallType[0].displayOBCallType,
        "outboundCallType": this.questionTypeConfigForm.value.callType,
        "effectiveFrom": this.callTypes[0].effectiveFrom,
        "effectiveUpto": this.callTypes[0].effectiveUpto
      }
    });

    addQuestionareDialog.afterClosed()
      .subscribe((response) => {
        console.log(response);
        if (response) {
          this.alertService.alert(response.data.response, 'success');
          //refreshing screen after dialog closes
          this.questionaireService.getQuestionaire(this.postData)
            .subscribe((response) => {
              // this.listDisplay = true;
              console.log(response.data);
              this.questionrows = response.data.questions;
            },
            (error) => {
              console.log(error);
              this.alertService.alert( error.errorMessage , 'error');
            });
        }
      },
      (error) => {
        console.log(error);
        this.alertService.alert( error.errorMessage , 'error');
      });
  }

  interactionData: any;
  interactionFlag: boolean;
  addConfig(row, event) {
    this.interactionFlag = true;
    event.preventDefault();
    console.log('Selected Row Data::::', JSON.stringify(row));
    this.interactionData = row;
  }
  questionCallType: any;
  showPrevt(event) {
    console.log("there", JSON.stringify(this.interactionData, null, 4));
    this.callTypes = this.CallAllocationService.selectedCallConfig;
    let callType = this.callTypes.filter((item) => {
      console.log('item', item);

      return item.outboundCallType == this.interactionData.outboundCallType;
    })[0]
    this.interactionFlag = false;

    console.log('callType', callType.outboundCallType);
    // JSON.stringify(this.questionTypeConfigForm.value, null, 4)
    this.questionCallType = callType.outboundCallType;
  }

  navigateToPrev() {
    console.log("in previous routing...");
    // this.showPrevScreen.emit(true);
    this.router.navigate(['/InnerpageComponent'], {
      queryParams: {
        number: '6'
      }
    });
  }

  onMapQuestions() {

    let questiontype = this.questionCallType;
    let displayOBCCallType = this.callTypes.filter(function (obj) {
      if (obj.outboundCallType == questiontype) {
        return obj.displayOBCallType;
      }
    });
    console.log("Mapscreen entered");
    // this.questionrows = this.questionrows.filter(ques => {
    //   return  ques.questionnaireDetail.answerType==='DropDown' || ques.questionnaireDetail.answerType==='Yes/No'  ;
    // });
    console.log(displayOBCCallType);
    let mapQuestionareDialog = this.dialog.open(MapQuestionaireComponent, {
      disableClose: true,
      width: "700px",
      height: "500px",
      panelClass: 'm-w-100',
      data: {
        // "providerServiceMapID": this.providerServiceMapID,
        // "outboundCallType": this.questionTypeConfigForm.value.callType,
        // "effectiveFrom": this.callTypes[0].effectiveFrom
        "questiondata":this.questionrows
      }
    });
    mapQuestionareDialog.afterClosed()
    .subscribe((response) => {
      console.log(response);
      if (response) {
        this.alertService.alert(response.data.response, 'success');
      }
    },
  (error) => {
    console.log(error);
    this.alertService.alert( error.errorMessage , 'error');
  });
  }

  //BU40088124 23/10/2021 Integrating Multilingual Functionality --Start--
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
@Component({
  selector: 'app-delete-multiple',
  templateUrl: './deleteMultiple.component.html',
  styleUrls: ['./deleteMultiple.component.css']
})
export class DeleteMultipleComponent implements OnInit {
  providerServiceMapID: any;
  createdBy: any;
  questionrows=[];
  temp: any=[];
  deleteFlag: boolean = false;
  languageComponent: SetLanguageComponent;
  
  currentLanguageSet: any;
  constructor(private dataService: dataService,private httpServiceService: HttpServices, private questionaireService: QuestionaireService, @Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<DeleteMultipleComponent>, private alertService: ConfirmationDialogsService ) { 
  }
  ngOnInit(){
    this.fetchLanguageResponse();
    this.providerServiceMapID = this.dataService.currentService.serviceID;
    this.createdBy = this.dataService.uname;
    this.questionrows=this.data.questionrows;
  }
  deleteSelected(row,i,event)
  {
    //event.preventDefault();
    let temp1=this.temp;
    if(event.checked)
    {
      //alert("checked");
      temp1.push(row);
    }
    else if(!event.checked){
      //alert("unchecked");
      for(var j=0;j<temp1.length;j++)
      {
        if(temp1[j].questionID === row.questionID){
          temp1.splice(j,1);
          break;
        }
        
      }
      
    }
    this.temp=temp1;
    if(this.temp.length > 0 ){
      this.deleteFlag = true;
    }else{
      this.deleteFlag = false;
    }
    console.log("temp",this.temp);
  }
  sort(array:any[],property:string,isNumber:boolean){
    if(isNumber){
        return array.sort((item1,item2)=> {
            return (item1[property] > item2[property]) ? 1 : -1;});
    }else{
        return array.sort((item1,item2)=> {
            return (item1[property].toLowerCase() > item2[property].toLowerCase()) ? 1 : -1;});
    }
}
  deleteOptions()
  {
    event.preventDefault();
    // for(var i=0;i<this.temp.length;i++)
    // {

    // }
    this.temp = this.temp.sort((a, b) => (a.questionnaireDetail.questionRank < b.questionnaireDetail.questionRank ? -1 : 1));
    console.log("sorted",this.temp);
    this.alertService.confirm('', this.currentLanguageSet.areYouSureYouWantToDelete)
      .subscribe((response) => {
        if (response) {
          this.questionaireService.deleteMultipleQuestionaire(this.temp
            ).subscribe((response) => {
            console.log(response);
            if (response) {
              console.log(response);
              this.dialogRef.close(response);
            }
          },
            (error) => {
              console.log(error);
              this.dialogRef.close();
            });
        }
      });
 
  }

  //BU40088124 23/10/2021 Integrating Multilingual Functionality --Start--
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