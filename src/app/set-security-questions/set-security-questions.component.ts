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
import { HttpServices } from '../services/http-services/http_services.service';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config/config.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { loginService } from 'app/services/loginService/login.service';
import { AuthService } from 'app/services/authentication/auth.service';
import * as CryptoJS from 'crypto-js';

declare let jQuery: any;


@Component({
  selector: 'app-set-security-questions',
  templateUrl: './set-security-questions.component.html',
  styleUrls: ['./set-security-questions.component.css']
})
export class SetSecurityQuestionsComponent implements OnInit {

  passwordPattern = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/;

  uid: any = this.getUserData.uid;
  passwordSection = false;
  questionsection = true;
  uname: any = this.getUserData.uname;
  _keySize: any;
  _ivSize: any;
  _iterationCount: any;
  encryptedConfirmPwd : any;
  key: any;
  iv: any;
  SALT: string = "RandomInitVector";
  Key_IV: string = "Piramal12Piramal";

  constructor(
    public getUserData: dataService,
    public http_calls: HttpServices,
    public router: Router,
    private configService: ConfigService,
    private alertService: ConfirmationDialogsService,
    private loginservice: loginService,
    private authService: AuthService
  ) {
    this._keySize = 256;
    this._ivSize = 128;
    this._iterationCount = 1989;

  }

  handleSuccess(response) {
    this.questions = response.data;
    this.replica_questions = response.data;

    this.Q_array_one = response.data;
    this.Q_array_two = response.data;
    console.log(this.questions);
  }

  handleError(response) {
    console.log('error', this.questions);
  }

  ngOnInit() {

    this.http_calls.getData(this.configService.getCommonBaseURL() + 'user/getsecurityquetions').subscribe(
      (response: any) => this.handleSuccess(response),
      (error: any) => this.handleError(error));

  }

  switch() {
    this.passwordSection = true;
    this.questionsection = false;
  }


  dynamictype_one: any = "password";
  dynamictype_two: any = "password";

  showPWD_one() {
    this.dynamictype_one = 'text';
  }
  showPWD_two() {
    this.dynamictype_two = 'text';
  }

  hidePWD() {
    this.dynamictype_one = 'password';
    this.dynamictype_two = 'password';
    
  }



  question1: any = "";
  question2: any = "";
  question3: any = "";

  answer1: any = '';
  answer2: any = '';
  answer3: any = '';

  questions: any = [];
  replica_questions: any = [];
  Q_array_one: any = [];
  Q_array_two: any = [];

  selectedQuestions: any = [];

  get keySize() {
		return this._keySize;
	  }
	
	  set keySize(value) {
		this._keySize = value;
	  }
	
	
	
	  get iterationCount() {
		return this._iterationCount;
	  }
	
	
	
	  set iterationCount(value) {
		this._iterationCount = value;
	  }
	
	
	
	  generateKey(salt, passPhrase) {
		return CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
      hasher: CryptoJS.algo.SHA512,
		  keySize: this.keySize / 32,
		  iterations: this._iterationCount
		})
	  }
	
	
	
	  encryptWithIvSalt(salt, iv, passPhrase, plainText) {
		let key = this.generateKey(salt, passPhrase);
		let encrypted = CryptoJS.AES.encrypt(plainText, key, {
		  iv: CryptoJS.enc.Hex.parse(iv)
		});
		return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
	  }
	
	  encrypt(passPhrase, plainText) {
		let iv = CryptoJS.lib.WordArray.random(this._ivSize / 8).toString(CryptoJS.enc.Hex);
		let salt = CryptoJS.lib.WordArray.random(this.keySize / 8).toString(CryptoJS.enc.Hex);
		let ciphertext = this.encryptWithIvSalt(salt, iv, passPhrase, plainText);
		return salt + iv + ciphertext;
	  }


  updateQuestions(selectedques, position) {
    console.log('position', position, 'Selected Question', selectedques);
    console.log('before if else block, selected questions', this.selectedQuestions);

    if (this.selectedQuestions.indexOf(selectedques) == -1) {
      this.selectedQuestions[position] = selectedques;
      if (position === 0) {
        this.answer1 = "";
        // jQuery("#ans1").prop("disabled",false);
      }
      if (position === 1) {
        this.answer2 = "";
        // jQuery("#ans2").prop("disabled",false);
      }
      if (position === 2) {
        this.answer3 = "";
        // jQuery("#ans3").prop("disabled",false);
      }

      console.log('if block, selected questions', this.selectedQuestions);

    }else {
      if (this.selectedQuestions.indexOf(selectedques) != position) {
        this.alertService.alert('This question is already selected. Choose unique question');
      }else {
        // this.alertService.alert("This question is mapped at this position already");
      }
      console.log('else block, selected questions', this.selectedQuestions);
      console.log('position else block', position);
    }
  }

  filterArrayOne(questionID) {
    this.Q_array_one = this.filter_function(questionID, this.Q_array_one);
    this.Q_array_two = this.filter_function(questionID, this.Q_array_two);
  }

  filterArrayTwo(questionID) {
    this.Q_array_two = this.filter_function(questionID, this.Q_array_two);
    this.questions = this.filter_function(questionID, this.questions);
  }

  filterArrayThree(questionID) {
    this.Q_array_one = this.filter_function(questionID, this.Q_array_one);
    this.questions = this.filter_function(questionID, this.questions);
  }

  filter_function(questionID, array) {
    let dummy_array = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i].QuestionID === questionID) {
        continue;
      }else {
        dummy_array.push(array[i]);
      }
    }
    return dummy_array;
  }

  dataArray: any = [];

  setSecurityQuestions() {
    if (this.selectedQuestions.length == 3) {
      this.dataArray = [
        {
          'userID': this.uid,
          'questionID': this.question1,
          'answers': this.answer1.trim(),
          'mobileNumber': '1234567890',
          'createdBy': this.uname
        },
        {
          'userID': this.uid,
          'questionID': this.question2,
          'answers': this.answer2.trim(),
          'mobileNumber': '1234567890',
          'createdBy': this.uname
        },
        {
          'userID': this.uid,
          'questionID': this.question3,
          'answers': this.answer3.trim(),
          'mobileNumber': '1234567890',
          'createdBy': this.uname
        }];

      console.log('Request Array', this.dataArray);
      console.log('selected questions', this.selectedQuestions);

      this.switch();
    }else {
      this.alertService.alert('All 3 questions should be different. Please check your selected questions');
    }
  }



  oldpwd: any;
  newpwd: any;
  confirmpwd: any;
  password: any;

  updatePassword(new_pwd) {
    this.password = this.encrypt(this.Key_IV, new_pwd)
		this.encryptedConfirmPwd=this.encrypt(this.Key_IV, this.confirmpwd)
    if (new_pwd === this.confirmpwd) {
      this.http_calls.postDataForSecurity(this.configService.getCommonBaseURL() + 'user/saveUserSecurityQuesAns', this.dataArray)
        .subscribe((response: any) => this.handleQuestionSaveSuccess(response, this.encryptedConfirmPwd),
        (error: any) => this.handleQuestionSaveError(error));

    } else {
      // tslint:disable-next-line:quotemark
      this.alertService.alert("Password doesn't match", 'error');
    }
  }


  handleQuestionSaveSuccess(response, encryptedConfirmPwd) {
    if(response && response.statusCode == 200 && response.data.transactionId !== undefined && response.data.transactionId !== null) {
    console.log('saved questions', response);
    this.http_calls.postDataForSecurity(this.configService.getCommonBaseURL() + 'user/setForgetPassword',
      { 'userName': this.uname, 'password': this.password , 'transactionId' : response.data.transactionId})
      .subscribe((res: any) => this.successCallback(res),
      (error: any) => this.errorCallback(error));
    }
    else
    {
      this.alertService.alert(response.errorMessage, 'error');
      
    }


  }
  handleQuestionSaveError(response) {
    console.log('question save error', response);
  }

  successCallback(response) {
    console.log(response);
    this.alertService.alert('Password changed successfully', 'success');
    this.loginservice.userLogout().subscribe((response) => { if (response !== undefined && response !== null) {
      this.router.navigate(['']);
      this.authService.removeToken();
    }
  });
  }
  errorCallback(response) {
    console.log(response);
  }

}
