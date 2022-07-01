import { Component, OnInit } from '@angular/core';
import {ApiConnectionService} from '../Services/api-connection.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DirNode } from "../DirDataModel";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [ApiConnectionService]
})
export class MainComponent implements OnInit {

  constructor(private apiConnectionService: ApiConnectionService, private _MatSnackBar : MatSnackBar) { }

  State : number = -1;  //-1: loading screen, 0: Not Logged in, 1 Logged in
  Username : string = "";

  DirBaseData : DirNode[] = [];

  ngOnInit(): void {
    this.IsLoggedIn();
  }

  IsLoggedIn() : void {
    this.apiConnectionService.IsLoggedIn().subscribe((data) => {this.State = data.data? -1:0; if (data.data) {this.GetUsername()}}, (error) => {this._MatSnackBar.open("Hiba történt a szerver elérése közben.", "Bezárás");});
    
  }

  GetUsername () {
    this.apiConnectionService.GetUsername().subscribe((data) => {if (!data.error) {this.Username = data.data}},(error) => {this._MatSnackBar.open("Hiba történt a szerver elérése közben.", "Bezárás");});
    this.LoadDirBaseData();
  }

  OnLoggedIn(Username : string) : void {
    this.Username = Username
    this.State = -1;
    this.LoadDirBaseData();
  }

  LogOut() {
    this.apiConnectionService.LogOut().subscribe((data) => {this.State = 0; this.Username = "";});
  }

  LoadDirBaseData() {
    this.apiConnectionService.GetDirList("/").subscribe((data) => {if (!data.error) {this.State = 1; this.DirBaseData = data.data;} else {this._MatSnackBar.open(this.apiConnectionService.ErrorCodesToString(data.data), "Bezárás")}},(error) => {this._MatSnackBar.open("Hiba történt a szerver elérése közben.", "Bezárás");});
  }
}
