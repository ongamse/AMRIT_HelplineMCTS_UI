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


import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivityThisWeekComponent } from './activity-this-week.component';
import { dataService } from '../services/dataService/data.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

let component: ActivityThisWeekComponent;
let fixture: ComponentFixture<ActivityThisWeekComponent>;

const FakeDataService = {
   current_role: '',
   current_campaign: '' 
}

const providerForFakeDataService = {
  provide: dataService, useValue: FakeDataService
};

const fakeRouter = {

};

const providerForFakeRouter = {
  provide: Router, useValue: fakeRouter
};

function InitializeActivityThisWeekTestBed() {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityThisWeekComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        providerForFakeDataService, providerForFakeRouter]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityThisWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}

describe('ActivityThisWeekComponent', () => {

  fdescribe('When the component is getting loaded, then ngOninit', () => {

    InitializeActivityThisWeekTestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should set role to empty string after ngOninit', () => {
      component.ngOnInit();
      expect(component.role).toBe('');
    });

  });
});
