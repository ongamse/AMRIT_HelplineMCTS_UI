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


import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class KnowledgeManagementService{

     test=[];
     private _geturl: string = this.configService.getMctsBaseURL() +"callConfigurationController/put/confignumbers";
     private _configurl: string = this.configService.getMctsBaseURL() +"callConfigurationController/put/configupdate";
     private _categoryurl = this.configService.getCommonBaseURL() + "api/helpline1097/co/get/category";
     private _subcategoryurl = this.configService.getCommonBaseURL() + "api/helpline1097/co/get/subcategory";
     private _uploadDocumentUrl = this.configService.getCommonBaseURL() + 'kmfilemanager/addFile';

    constructor(private _http:SecurityInterceptedHttp,private configService: ConfigService){}

    getCategories ()
    {
        return this._http.post( this._categoryurl, {})
            .map( this.extractData )
            .catch( this.handleError );
    }
    getSubCategories ( id: any )
    {
        let data = { "categoryID": id };
        return this._http.post( this._subcategoryurl, data)
            .map( this.extractData )
            .catch( this.handleError );
    }
    uploadDocument(uploadObj: any) {
        return this._http.post(this._uploadDocumentUrl , JSON.stringify(uploadObj)).map(this.extractData).catch(this.handleError)
    }
    private extractData(response: Response) {

        if (response.json().data) {
        return response.json().data;
        } else {
        console.log('Status', response.json().status);
        return response.json().status;

        }
    };

    private handleError(res: Response) {
        return Observable.throw(res.json());
    };

}