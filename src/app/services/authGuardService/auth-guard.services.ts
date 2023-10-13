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


import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild, Router, ActivatedRoute,
  ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate
} from '@angular/router';
import { dataService } from '../dataService/data.service';
import { Http, Response } from '@angular/http';
import { InterceptedHttp } from './../../http.interceptor';
import { ConfigService } from '../config/config.service';
import { AuthService } from './../../services/authentication/auth.service';
import 'rxjs/add/operator/toPromise'


@Injectable()
export class AuthGuard implements CanActivate {
  _baseURL = this._config.getCommonBaseURL();
  _authorisedUser = this._baseURL + 'user/getLoginResponse';
  _deleteToken = this._baseURL + 'user/userLogout';
  constructor(
    private router: Router, private _config: ConfigService,
    private route: ActivatedRoute, public dataSettingService: dataService, private _http: InterceptedHttp
    , private authService: AuthService) { }

  canActivate(route, state) {
    let key = localStorage.getItem('onCall');
    let authkey = sessionStorage.getItem('authToken');
    console.log('KEY', key);
  if(authkey) {
      if (key === 'true') {
        alert('You are not allowed to go back');
        return false;
      }
      if (key === 'false') {
        return true;
      }
    }
    else {
      return false;
    }
    }

  // canActivateChild() {

  // }

}

@Injectable()
export class SaveFormsGuard implements CanDeactivate<dataService> {

  canDeactivate() {
    var key = localStorage.getItem('onCall');
    if (key === 'true') {
      //alert("You are not allowed to go back");
      return true;
    }
    else {
      return false;
    }
  }

}