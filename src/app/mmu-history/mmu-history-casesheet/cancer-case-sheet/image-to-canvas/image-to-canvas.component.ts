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


import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'image-to-canvas',
  templateUrl: './image-to-canvas.component.html',
  styleUrls: ['./image-to-canvas.component.css']
})
export class ImageToCanvasComponent implements OnInit {

  @Input('imgUrl')
  imgUrl: string;

  @Input('annotatedMarker')
  annotatedMarker: any;

  @ViewChild('canvas')
  canvas: ElementRef;

  blankRows = [1, 2, 3, 4, 5];
  languageComponent: SetLanguageComponent;
  currentLanguageSet: any;
  

  constructor( private httpServiceService: HttpServices) { }

  ngOnInit() {
    this.fetchLanguageResponse();
  }

  ngOnChanges() {
    if (this.imgUrl) {
      this.loadImageOnCanvas(this.imgUrl);
    }

    if (this.annotatedMarker) {
      console.log('marker', this.annotatedMarker);
      if (this.annotatedMarker.markers)
        this.annotateImage(this.annotatedMarker.markers, this.imgUrl);
    }
  }

  loadImageOnCanvas(imgUrl) {
    let ctx = this.canvas.nativeElement;
    if (ctx.getContext) {
      ctx = ctx.getContext('2d');
      let img = new Image();
      img.onload = function () {
        ctx.drawImage(img, 0, 0, 250, 250);
      };
      img.src = imgUrl;
    }
  }

  annotateImage(markers, imgUrl) {
    let canvas = this.canvas.nativeElement;
    if (canvas.getContext) {
      let ctx = canvas.getContext('2d');
      ctx.font = 'bold 20px serif';

      let img = new Image();
      img.onload = function () {
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
        let score = 1;
        markers.forEach((mark, index) => {
          if (mark.xCord) mark.offsetX = mark.xCord;
          if (mark.yCord) mark.offsetY = mark.yCord;
          if (score <= 6) {
            ctx.strokeRect(mark.offsetX - 10, mark.offsetY - 10, 20, 20);
            ctx.fillText(score, mark.offsetX - 3, mark.offsetY + 6);
          }
          score++;
        })
      };
      img.src = imgUrl;
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
