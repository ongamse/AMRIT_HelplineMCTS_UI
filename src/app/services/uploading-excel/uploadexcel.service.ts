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
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor';
import { LoaderService } from '../common/loader.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from '../../services/authentication/auth.service';
import { ConfirmationDialogsService } from '../../services/dialog/confirmation.service';
import { SocketService } from '../../services/socketService/socket.service';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class UploadexcelService {

  constructor(private http: Http,private _http: SecurityInterceptedHttp,
    private configService: ConfigService,
    private httpIntercept: InterceptedHttp,
    private loaderService: LoaderService,
    public router: Router,
    private authService: AuthService,
    private socketService: SocketService,
    private message: ConfirmationDialogsService) { }


  postFormData(formData) {
    let URL = this.configService.getMctsBaseURL() + 'mctsDataHandlerController/mcts/data/upload';
 //   this.showLoader();
    return this._http.post(URL, formData).catch(this.onCatch).do((res: Response) => {
      this.onSuccess(res);
    }, (error: any) => {
      this.onError(error);
    })
      .finally(() => {
        this.onEnd();
      });
  }

  getUploadStatus(psmID) {
    let url = this.configService.getMctsBaseURL() + 'mctsDataHandlerController/mcts/data/upload/status';
    return this._http.post(url,{'providerServiceMapID':psmID}).map(this.extractData).catch(this.handleError);
  }

  private onEnd(): void {
    this.hideLoader();
  }
  private onSuccess(response: any) {
    if (response.json().data) {
      console.log('response.json().data', response.json(), response.json().data);
      return response;
    }
    else if (response.json().statusCode === 5002) {
      //    this.authService.cZentrixLogout();

      localStorage.removeItem("key");
      localStorage.removeItem("onCall");
      this.router.navigate(['']);
      this.message.alert(response.json().errorMessage, 'error');
      this.authService.removeToken();
      // this.socketService.logOut();
      return Observable.empty();
    } else {
      throw response;
    }
  }
  private onError(error: any) {
    this.hideLoader();
    console.log('error on file uploAD', error);

    return error;
  }
  private showLoader(): void {
    console.log('show loader');
    this.loaderService.show();
  }
  private hideLoader(): void {
    console.log('Loader hide')
    this.loaderService.hide();
  }
  private onCatch(error: any, caught?: Observable<Response>): Observable<Response> {
    console.log('catech', error);

    return Observable.throw(error);
  }


  private extractData(response: Response) {
    if (response.json().data) {
        return response.json().data;
    } else {
        return response.json();
    }
}
private handleError(error: Response | any) {
    return Observable.throw(error.json());
};
}
