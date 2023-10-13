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
import { CanActivate, CanActivateChild, Router, ActivatedRoute, RouterStateSnapshot, CanDeactivate  } from '@angular/router';
import { dataService } from '../dataService/data.service';

@Injectable()
export class AuthGuard2 implements CanActivate {

  constructor(
    private router: Router,
    private route: ActivatedRoute, public dataSettingService: dataService) { }

  canActivate(route, state) {
    console.log(route);

    console.log(state);
    var key = localStorage.getItem('onCall');
    var key2  = localStorage.getItem("key");
    if(key == "yes") {
      return true;;
    }

    else {
    	      alert("Plese wait for call to come");

      return false;
    }
  }

  // canActivateChild() {

  // }

}

