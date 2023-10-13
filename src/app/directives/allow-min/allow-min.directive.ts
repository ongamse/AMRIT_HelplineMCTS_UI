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


import {
  Directive,
  ElementRef,
  Attribute,
  HostListener,
  Input,
} from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Directive({
  selector: "[appAllowMin]",
})
export class AllowMinDirective {
  @Input("allowMin")
  public min: number;

  constructor(private elementRef: ElementRef) {}

  validate(input) {
    let min = this.min;

    if (+input >= +min) return true;
    else return false;
  }

  @HostListener("keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    let currentChar = String.fromCharCode(event.keyCode);
    let nextValue;

    if (currentChar == "." || !isNaN(Number(currentChar))) {
      if (!isNaN(Number(currentChar)))
        nextValue = this.elementRef.nativeElement.value + currentChar;
      else nextValue = this.elementRef.nativeElement.value;
    }
    if (!this.validate(nextValue)) event.preventDefault();
  }
  @HostListener("paste", ["$event"]) blockPaste(event: KeyboardEvent) {
    event.preventDefault();
  }

  @HostListener("copy", ["$event"]) blockCopy(event: KeyboardEvent) {
    event.preventDefault();
  }

  @HostListener("cut", ["$event"]) blockCut(event: KeyboardEvent) {
    event.preventDefault();
  }
}
