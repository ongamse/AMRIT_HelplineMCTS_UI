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


import { Component, forwardRef, Inject, OnDestroy, OnInit } from '@angular/core';
import { loginService } from '../services/loginService/login.service';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MdDialog } from '@angular/material';
import { CzentrixServices } from '../services/czentrixService/czentrix.service';
import { SocketService } from '../services/socketService/socket.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { Subscription } from 'rxjs';
import { InterceptedHttp } from 'app/http.interceptor';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'login-component',
  templateUrl: './login.html',
  styleUrls: ['./login.component.css']
})

export class loginContentClass implements OnInit, OnDestroy{
  model: any = {};
  userID: any;
  password: any;
  loginResult: any;
  privleges: any;
  encryptedVar: any;
  key: any;
  iv: any;
  SALT: string = "RandomInitVector";
  Key_IV: string = "Piramal12Piramal";
  encPassword: string;
  _keySize: any;
  _ivSize: any;
  _iterationCount: any;
  logoutUserFromPreviousSessionSubscription: Subscription;
  encryptPassword: any;
  
  constructor(@Inject(forwardRef(() => loginService))private loginservice: loginService, public router: Router, public dataSettingService: dataService,
    public dialog: MdDialog, private czentrixService: CzentrixServices, private httpService: InterceptedHttp, private alertService: ConfirmationDialogsService) { 
      this._keySize = 256;
      this._ivSize = 128;
      this._iterationCount = 1989;
    };

  ngOnInit() {
    this.httpService.dologoutUsrFromPreSession(false);
    this.logoutUserFromPreviousSessionSubscription = this.httpService.logoutUserFromPreviousSessions$.subscribe((logoutUser) => {
      if(logoutUser) {
        this.loginUser(true);
      }
    })
    if (sessionStorage.getItem('authToken')) {
      this.loginservice.checkAuthorisedUser().subscribe((response) => {
        if (response.statusCode == 200) {
          this.privleges = response.data.previlegeObj.filter((userPrivelige) => {
            console.log('userPrivelige.serviceName', userPrivelige);
            if (userPrivelige && userPrivelige.serviceName && userPrivelige.serviceName != undefined)
              return userPrivelige.serviceName == 'MCTS'
          });

          console.log('privleges', this.privleges);
          //console.log("apimanClientKey", this.privleges[0].apimanClientKey);
          
          if (this.privleges.length > 0) {
            // console.log(this.userID);
            response = response.data;
            this.dataSettingService.Userdata = response;
            this.dataSettingService.agentID = response.agentID;
            this.czentrixService.ip = response.loginIPAddress;
            this.dataSettingService.current_serviceID=response.previlegeObj[0].roles[0].serviceRoleScreenMappings[0].providerServiceMapping.m_ServiceMaster.serviceID;
            
            // this.dataSettingService.userPriveliges = response.Previlege;
            this.dataSettingService.userPriveliges = this.privleges;
            this.dataSettingService.uid = response.userID;
            this.dataSettingService.uname = response.userName;
            console.log(this.privleges);

            if (response.isAuthenticated === true && response.Status === "Active") {
              this.router.navigate(['/MultiRoleScreenComponent']);
              localStorage.setItem('onCall', 'false');
              // open socket connection
              // this.socketService.reInstantiate();
            }
            if (response.isAuthenticated === true && response.Status === "New") {
              this.router.navigate(['/setQuestions']);

            }
          } else {
            console.log('checked for mcts');
            this.alertService.alert("User doesnot have privilege to access MCTS", 'error')
          }
        }

      }, (err) => { });
    }

  }

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

  login(doLogOut: any) {
    this.encryptPassword = this.encrypt(this.Key_IV, this.password)
    this.loginservice.authenticateUser(this.userID, this.encryptPassword, doLogOut).subscribe(
      (response: any) => {
        if(response !== undefined && response !== null && response.data.previlegeObj !== undefined && response.data.previlegeObj !== null) {
       this.successCallback(response)}
        },
      (error: any) => this.errorCallback(error));
  };
  successCallback(response: any) {
    console.log(JSON.stringify(response));
    if (response.statusCode == 200) {
      this.privleges = response.data.previlegeObj.filter((userPrivelige) => {
        console.log('userPrivelige.serviceName', userPrivelige);
        if (userPrivelige && userPrivelige.serviceName && userPrivelige.serviceName != undefined)
          return userPrivelige.serviceName == 'MCTS'
      });

      console.log('privleges', this.privleges);
      // console.log("apimanClientKey", this.privleges[0].apimanClientKey);
      if (this.privleges.length > 0) {
        // console.log(this.userID);
        response = response.data;
        console.log("response from apiman", response)
        this.dataSettingService.current_serviceID=response.previlegeObj[0].roles[0].serviceRoleScreenMappings[0].providerServiceMapping.m_ServiceMaster.serviceID;
        this.dataSettingService.Userdata = response;
        this.dataSettingService.agentID = response.agentID;
        this.dataSettingService.service_providerID = response.previlegeObj[0].roles[0].serviceRoleScreenMappings[0].providerServiceMapping.serviceProviderID;
        this.dataSettingService.campaignName = response.previlegeObj[0].roles[0].serviceRoleScreenMappings[0].providerServiceMapping.ctiCampaignName;
        this.dataSettingService.apimanClientKey = response.previlegeObj[0].apimanClientKey;
        sessionStorage.setItem('apiman_key', response.previlegeObj[0].apimanClientKey);
        this.czentrixService.ip = response.loginIPAddress;
        // this.dataSettingService.userPriveliges = response.Previlege;
        this.dataSettingService.userPriveliges = this.privleges;
        this.dataSettingService.uid = response.userID;
        this.dataSettingService.uname = response.userName;
        console.log(this.privleges);

        if (response.isAuthenticated === true && response.Status === "Active") {

          this.router.navigate(['/MultiRoleScreenComponent']);
          sessionStorage.setItem('authToken', response.key);
          localStorage.setItem('onCall', 'false');
          this.czentrixService.getCTILoginToken(this.userID.trim(), this.password).subscribe((response) => {
            this.dataSettingService.loginKey = response.data.login_key;
            console.log("loginKey: " + this.dataSettingService.loginKey);
          }, (err) => {
            //this.alertService.alert(err.errorMessage, 'error');
          })
          // open socket connection
          // this.socketService.reInstantiate();
        }
        if (response.isAuthenticated === true && response.Status === "New") {
          this.router.navigate(['/setQuestions']);
          sessionStorage.setItem('authToken', response.key);
          localStorage.setItem('onCall', 'false');

        }
      } else {
        console.log('checked for mcts');
        this.alertService.alert("User doesnot have privilege to access MCTS", 'error')
      }
    } else {
      console.log('login failed');

      // this.loginResult = response.errorMessage;
    }
  };
  errorCallback(error: any) {
    console.log(error);
    if (error.status) {
      this.loginResult = error.status;
    } else {
      this.loginResult = 'Internal issue please try after some time';
    }
  };
  
  /* AN4085822 - Concurrent login issue*/
  loginUser(doLogOut) {
    this.loginservice
    .userLogOutFromPreviousSession(this.userID)
    .subscribe(
      (userLogOutRes: any) => {
      if(userLogOutRes && userLogOutRes.data.response) {
    this.loginservice
      .authenticateUser(this.userID, this.encryptPassword, doLogOut)
      .subscribe(
        (response: any) => {
          if (
            response !== undefined &&
            response !== null &&
            response.data.previlegeObj !== undefined &&
            response.data.previlegeObj !== null
          ) {
            this.successCallback(response);
          }
        },
        (error: any) => this.errorCallback(error)
      );
      }
      else
      {
            this.alertService.alert(userLogOutRes.errorMessage, 'error');
      }
      });
  }


  ngOnDestroy() {
    if (this.logoutUserFromPreviousSessionSubscription) {
      this.logoutUserFromPreviousSessionSubscription.unsubscribe();
    }
  }
  
  dynamictype: any = 'password';
  showPWD() {
    this.dynamictype = 'text';
  }

  hidePWD() {
    this.dynamictype = 'password';
  }
}
