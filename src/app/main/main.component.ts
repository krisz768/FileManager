import { Component, OnInit } from '@angular/core';
import {ApiConnectionService} from '../Services/api-connection.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DirNode } from "../DirDataModel";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [ApiConnectionService]
})
export class MainComponent implements OnInit {

  constructor(private apiConnectionService: ApiConnectionService, private _MatSnackBar : MatSnackBar,private dialog: MatDialog) { }

  State : number = -1;  //-1: loading screen, 0: Not Logged in, 1 Logged in
  Username : string = "";

  DirBaseData : DirNode[] = [];

  ngOnInit(): void {
    this.IsLoggedIn();

    this.apiConnectionService.OnNewLogin.subscribe(Username => {this.OnNewLogin(Username)})
  }

  async IsLoggedIn() {
    const IsLogedIn = await this.apiConnectionService.IsLoggedIn();
    this.State = IsLogedIn.data ? -1:0; 
    if (IsLogedIn.data) {
      this.GetUsername();
    }
  }

  async GetUsername () {
    const UsernameData = await this.apiConnectionService.GetUsername();
    if (!UsernameData.error) {
      this.Username = UsernameData.data;
      this.LoadDirBaseData();
    }
  }

  OnLoggedIn(Username : string) : void {
    this.Username = Username;
    this.State = -1;
    this.LoadDirBaseData();
  }

  OnNewLogin(Username : string) {
    if (this.Username != Username) {
      this.Username = Username;
      this.dialog.closeAll();
      this.State = -1;
      this.LoadDirBaseData();
    }
  }

  async LogOut() {
    this.State = -1;
    const LogData = await this.apiConnectionService.LogOut();
    if (!LogData.error) {
      this.State = 0; 
      this.Username = "";
    }
  }

  async LoadDirBaseData() {
    const DirData = await this.apiConnectionService.GetDirList("/");
    if (!DirData.error) {
      this.State = 1; 
      this.DirBaseData = DirData.data;
    } else {
      this._MatSnackBar.open(this.apiConnectionService.ErrorCodesToString(DirData.data), "Bezárás");
    }
  }
}
