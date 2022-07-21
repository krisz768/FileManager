import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {

  constructor(public matDialogRef: MatDialogRef<LoginDialogComponent>) { }

  ngOnInit(): void {
  }

  OnLoggedIn(Username : string) : void {
    this.matDialogRef.close(Username);
  }
}
