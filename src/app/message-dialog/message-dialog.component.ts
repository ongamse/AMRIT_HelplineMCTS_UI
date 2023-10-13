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
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent implements OnInit {
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
  

  constructor(@Inject(MD_DIALOG_DATA) public data: any, private httpServiceService: HttpServices, public dialogRef: MdDialogRef<MessageDialogComponent>) { }

  ngOnInit() {
    this.fetchLanguageResponse();
  	console.log(this.data,"DATA IN MESSAGE DIALOG WINDOW");
  	this.checkForURL(this.data.message);
    // this.checkForURL("https://www.google.com www.gov.gov www.google.co.in http://uber.com");

  }

  result=[];


  urls=[];

  checkForURL(string)
  {
  	// var matches=[];
  	// matches=string.match(/\bhttp[s,]?:\/\/\S+/gi);
  	// console.log("matches",matches);
   //  if(matches) {
   //    if(matches.length>0)
   //    {
   //      this.urls=matches;
   //    }
   //  }
   //  else {
   //    matches = [];
   //  }

   var request_array=string.split(' ');
   console.log("first array split",request_array);

   for(let i=0;i<request_array.length;i++)
   {
    var req_array=request_array[i].split(",");
    console.log("second array split",req_array);
    for(let z=0;z<req_array.length;z++)
    {
      if(req_array[z].startsWith("www") && (req_array[z].endsWith(".com")||
                                            req_array[z].endsWith(".co")||
                                            req_array[z].endsWith(".in")||
                                            req_array[z].endsWith(".org")||
                                            req_array[z].endsWith(".net")||
                                            req_array[z].endsWith(".int")||
                                            req_array[z].endsWith(".edu")

                                            )
        )
      {
        this.result.push(req_array[z]);
      }
      else if(req_array[z].startsWith("WWW")&& (req_array[z].endsWith(".com")||
                                                req_array[z].endsWith(".co")||
                                                req_array[z].endsWith(".in")||
                                                req_array[z].endsWith(".org")||
                                                req_array[z].endsWith(".net")||
                                                req_array[z].endsWith(".int")||
                                                req_array[z].endsWith(".edu")
                                                )
        )
      {
        this.result.push(req_array[z]);
      }
      else if(req_array[z].startsWith("https")&& (req_array[z].endsWith(".com")||
                                                  req_array[z].endsWith(".co")||
                                                  req_array[z].endsWith(".in")||
                                                  req_array[z].endsWith(".org")||
                                                  req_array[z].endsWith(".net")||
                                                  req_array[z].endsWith(".int")||
                                                  req_array[z].endsWith(".edu")
                                                  )
        )
      {
        this.result.push(req_array[z]);
      }
      else if(req_array[z].startsWith("HTTPS")&& (req_array[z].endsWith(".com")||
                                                  req_array[z].endsWith(".co")||
                                                  req_array[z].endsWith(".in")||
                                                  req_array[z].endsWith(".org")||
                                                  req_array[z].endsWith(".net")||
                                                  req_array[z].endsWith(".int")||
                                                  req_array[z].endsWith(".edu")
                                                  )
        )
      {
        this.result.push(req_array[z]);
      }
      else if(req_array[z].startsWith("HTTP")&& (req_array[z].endsWith(".com")||
                                                 req_array[z].endsWith(".co")||
                                                 req_array[z].endsWith(".in")||
                                                 req_array[z].endsWith(".org")||
                                                 req_array[z].endsWith(".net")||
                                                 req_array[z].endsWith(".int")||
                                                 req_array[z].endsWith(".edu")
                                                 )
        )
      {
        this.result.push(req_array[z]);
      }
      else if(req_array[z].startsWith("http")&& (req_array[z].endsWith(".com")||
                                                 req_array[z].endsWith(".co")||
                                                 req_array[z].endsWith(".in")||
                                                 req_array[z].endsWith(".org")||
                                                 req_array[z].endsWith(".net")||
                                                 req_array[z].endsWith(".int")||
                                                 req_array[z].endsWith(".edu")
                                                 )
        )
      {
        this.result.push(req_array[z]);
      }
    }

  }


  console.log(this.result,"RESULT SET OF URLS");
  for(let a=0;a<this.result.length;a++)
  {
    if(!this.result[a].toUpperCase().startsWith("HTTPS") && !this.result[a].toUpperCase().startsWith("HTTP"))
    {
      this.result[a]="https://"+this.result[a];
    }
  }

  if(this.result.length>0)
  {
    this.urls=this.result;
  }

}

//AN40085822 23/10/2021 Integrating Multilingual Functionality --Start--
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
