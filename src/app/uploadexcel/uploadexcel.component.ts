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


import { Component, DoCheck, OnInit, ViewChild } from "@angular/core";
import { UploadexcelService } from "../services/uploading-excel/uploadexcel.service";
import { NgForm } from "@angular/forms";
import { ConfirmationDialogsService } from "../services/dialog/confirmation.service";
import { LoaderComponent } from "../loader/loader.component";
import { MdDialog } from "@angular/material";
import { dataService } from "../services/dataService/data.service";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";
@Component({
  selector: "app-uploadexcel",
  templateUrl: "./uploadexcel.component.html",
  styleUrls: ["./uploadexcel.component.css"],
})
export class UploadexcelComponent implements OnInit, DoCheck {
  choices = ["Mother", "Child"];
  fileList: FileList;
  file: any;
  fileContent: any;
  fileListCount: boolean = false;
  error1: boolean = false;
  error2: boolean = false;
  @ViewChild("uploadForm") uploadForm: NgForm;
  maxFileSize: number = 5.0;
  providerServiceMapID: any;
  userID: any;
  createdBy: any;
  fileTypeID: any;
  invalid_file_flag = false;
  inValidFileName = false;
  fileSizeIsMoreThanRequired = true;

  valid_file_extensions =  ['xls', 'xlsx', 'xlsm', 'xlsb'];

  value: any;
  timerSubscription: Subscription;
  refresh: boolean = true;
  status: any;
  modDate: any;
  fileRes: any;
  currentLanguageSet: any;

  constructor(
    public _UploadexcelService: UploadexcelService,
    public dialog: MdDialog,
    private dataService: dataService,
    private alertService: ConfirmationDialogsService,
    private httpServices: HttpServices
  ) {}

  ngOnInit() {
    this.assignSelectedLanguage();
    this.providerServiceMapID = this.dataService.currentService.serviceID;
    this.userID = this.dataService.uid;
    this.createdBy = this.dataService.uname;
    this.autoRefresh(true);
  }
  /* Multilingual implementation - JA354063 */
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  /* Ends*/
  onFileUpload(event) {
    this.file = undefined;

    this.fileList = event.target.files;
    this.file = event.target.files[0];
    console.log(this.file);


    if (this.fileList.length == 0) {
    this.error1 = true;
    this.error2 = false;
    this.invalid_file_flag = false;
    this.inValidFileName = false;
    }
    else {
    if (this.file) {

        let fileNameExtension = this.file.name.split(".");
        let fileName = fileNameExtension[0];
        if(fileName !== undefined && fileName !== null && fileName !== "")
        {
        var isvalid = this.checkExtension(this.file);
        console.log(isvalid, 'VALID OR NOT');
        if (isvalid) {
    
            if ((this.fileList[0].size / 1000 / 1000) > this.maxFileSize) {
            console.log("File Size" + this.fileList[0].size / 1000 / 1000);
            this.error2 = true;
            this.error1 = false;
            this.invalid_file_flag = false;
            this.inValidFileName = false;
            }
            else {
            this.error1 = false;
            this.error2 = false;
            this.invalid_file_flag = false;
            this.inValidFileName = false;
            const myReader: FileReader = new FileReader();
            myReader.onloadend = this.onLoadFileCallback.bind(this)
            myReader.readAsDataURL(this.file);
            this.invalid_file_flag = false;
            }
          }
          else {
              this.invalid_file_flag = true;
              this.inValidFileName = false;
              this.error2 = false;
              this.error1 = false;
          }

          }
          else {
          //this.alertService.alert(this.currentLanguageSet.invalidFileName, 'error');
          this.inValidFileName = true;
          this.invalid_file_flag = false;
          this.error2 = false;
          this.error1 = false;
          }
          } else {
          
          this.invalid_file_flag = false;
          }
          

    //const validFormat = this.checkExtension(this.file);
    // if (validFormat) {
    //   this.invalid_file_flag = false;
    // } else {
    //   this.invalid_file_flag = true;
    // }

    // if (
    //   this.file &&
    //   this.file.size / 1024 / 1024 <= this.maxFileSize &&
    //   this.file.size / 1024 / 1024 > 0
    // ) {
    //   const myReader: FileReader = new FileReader();
    //   myReader.onloadend = this.onLoadFileCallback.bind(this);
    //   myReader.readAsDataURL(this.file);
    // } else if (
    //   this.fileList.length > 0 &&
    //   this.fileList[0].size / 1024 / 1024 <= this.maxFileSize
    // ) {
    //   console.log(this.fileList[0].size / 1024 / 1024, "FILE SIZE1");
    //   this.error1 = false;
    //   this.error2 = false;
    // } else if (this.fileList[0].size / 1024 / 1024 === 0) {
    //   console.log(this.fileList[0].size / 1024 / 1024, "FILE SIZE1");
    //   this.error1 = false;
    //   this.error2 = true;
    // } else if (this.fileList[0].size / 1024 / 1024 > this.maxFileSize) {
    //   console.log(this.fileList[0].size / 1024 / 1024, "FILE SIZE1");
    //   this.error1 = true;
    //   this.error2 = false;
    // }

    // if (this.file.size / 1024 / 1024 > this.maxFileSize) {
    //   this.fileSizeIsMoreThanRequired = true;
    // } else {
    //   this.fileSizeIsMoreThanRequired = false;
    }
  }

  onLoadFileCallback = (event) => {
    this.fileContent = event.currentTarget.result;
  };

  checkExtension(file) {
    let count = 0;
    console.log("FILE DETAILS", file);
    if (file) {
      let array_after_split = file.name.split(".");
      if(array_after_split.length == 2) {
      let file_extension = array_after_split[array_after_split.length - 1];
      for (let i = 0; i < this.valid_file_extensions.length; i++) {
        if (
          file_extension.toUpperCase() ===
          this.valid_file_extensions[i].toUpperCase()
        ) {
          count = count + 1;
        }
      }
      if (count > 0) {
        return true;
      } else {
        return false;
      }
    } else
    {
      return false;
    }
    } else {
      return true;
    }
  }

  onSubmit() {
    console.log(this.uploadForm.value.choice);
    console.log(this.fileList[0]);
    this.fileTypeID =
      this.uploadForm.value.choice == "Mother" ? "Mother Data" : "Child Data";
    let file: File = this.fileList[0];
    let requestData = {
      providerServiceMapID: this.providerServiceMapID,
      userID: this.userID,
      createdBy: this.createdBy,
      fieldFor: this.fileTypeID,
      fileName: this.file !== undefined ? this.file.name : "",
      fileExtension:
        this.file !== undefined ? "." + this.file.name.split(".")[1] : "",
      fileContent:
        this.fileContent !== undefined ? this.fileContent.split(",")[1] : "",
    };
    this._UploadexcelService.postFormData(requestData).subscribe(
      (response) => {
        this.autoRefresh(true);
        console.log(response.json());
        console.log(response.json().statusCode == 5000);
        console.log(
          response
            .json()
            .errorMessage.indexOf(
              "The process cannot access the file because it is being used by another process"
            ) != -1
        );
        if (
          response.json().statusCode == 5000 &&
          response
            .json()
            .errorMessage.indexOf(
              "The process cannot access the file because it is being used by another process"
            ) != -1
        ) {
          this.alertService
            .alertConfirm(
              this.currentLanguageSet.fileIsUsedInAnotherProcessPleaseCloseAndTryAgain,
              "error"
            )
            .subscribe(() => {
              this.uploadForm.resetForm();
            });
        } else if (
          response.json().statusCode == 5000 &&
          response.json().errorMessage
        ) {
          this.alertService
            .alertConfirm(response.json().data, "error")
            .subscribe(() => {
              this.uploadForm.resetForm();
            });
        } else {
          this.uploadForm.resetForm();
          this.file = undefined;
          if (response.json().data.response != "FileID") {
            this.alertService.alertConfirm(
              response.json().data.response,
              "info"
            );
          }
        }
      },
      (error) => {
        console.log(error);
        this.alertService
          .alertConfirm(this.currentLanguageSet.errorWhileUploadingExcelFile, "error")
          .subscribe(() => {
            this.uploadForm.resetForm();
            this.file = undefined;
          });
      }
    );
  }

  uploadStatus() {
    this._UploadexcelService
      .getUploadStatus(this.providerServiceMapID)
      .subscribe(
        (res) => {
          if (!res.hasOwnProperty("fileStatus")) {
            if (this.timerSubscription) this.timerSubscription.unsubscribe();

            this.alertService.alert(this.currentLanguageSet.noFileUploaded);
          } else if (res.fileStatus.fileStatus == "New") {
            this.value = 1;
            this.status = res.fileStatus.fileStatus;
            this.modDate = res.createdDate;
            this.fileRes = res;
          } else if (res.fileStatus.fileStatus == "InProgress") {
            this.calculateValue(res);
            this.status = res.fileStatus.fileStatus;
            this.modDate = res.createdDate;
            this.fileRes = res;
          } else if (
            res.fileStatus.fileStatus == "Completed" ||
            res.fileStatus.fileStatus == "Failed"
          ) {
            this.timerSubscription.unsubscribe();
            this.status = res.fileStatus.fileStatus;
            this.modDate = res.createdDate;
            this.fileRes = res;
          }
        },
        (err) => {
          this.alertService.alert(err.status, "error");
          if (this.timerSubscription) this.timerSubscription.unsubscribe();
        }
      );
  }
  autoRefresh(val) {
    this.refresh = val;
    if (val) {
      this.uploadStatus();
      const timer = Observable.interval(5 * 1000);
      this.timerSubscription = timer.subscribe(() => {
        this.uploadStatus();
      });
    } else {
      this.timerSubscription.unsubscribe();
    }
  }
  ngOnDestroy() {
    if (this.timerSubscription) this.timerSubscription.unsubscribe();
  }
  calculateValue(res) {
    this.value = (
      ((parseInt(res.validRecordUpload) + parseInt(res.erroredRecordUpload)) *
        100) /
      (parseInt(res.validRecordCount) + parseInt(res.erroredRecordCount))
    ).toFixed(2);
  }
}
