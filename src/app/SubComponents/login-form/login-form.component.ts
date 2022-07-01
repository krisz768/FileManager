import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {NgForm } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiConnectionService} from '../../Services/api-connection.service';
import { ResponseModel } from '../../ResponseModel';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(private _MatSnackBar : MatSnackBar, private apiConnectionService: ApiConnectionService) { }

  @Output() OnLoggedIn = new EventEmitter<string>();

  DisableForm : boolean = false;

  LoginButtonText : string = "Bejelentkezés";

  ngOnInit(): void {

  }

  LoginClick(formData: NgForm) : void {
    for (const Input in formData.form.controls) {
      if (formData.form.controls[Input].value == "") {
        this.ShowSnackBar("A mező nem lehet üres!");
        return;
      }
    }
    this.DisableForm = true;
    this.LoginButtonText = "Bejelentkezés...";
    this.apiConnectionService.Login(formData.form.controls["Username"].value, formData.form.controls["Password"].value).subscribe((data) => {this.LoginCallback(data)},(error) => {this._MatSnackBar.open("Hiba történt a szerver elérése közben.", "Bezárás");});
  }

  LoginCallback(data : ResponseModel) {
    if (data.error) {
      let ErrorText : string = this.apiConnectionService.ErrorCodesToString(data.data);
      this.ShowSnackBar(ErrorText);

      this.DisableForm = false;
    this.LoginButtonText = "Bejelentkezés";
    }else {
      this.OnLoggedIn.emit(data.data);
    }
  }

  ShowSnackBar(Text : string) : void {
    this._MatSnackBar.open(Text,'Bezárás',{
      duration: 10000
    });
  }

}
