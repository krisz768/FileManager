import { Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { DirNode } from "../../DirDataModel";

@Component({
  selector: 'app-copy-move-dialog',
  templateUrl: './copy-move-dialog.component.html',
  styleUrls: ['./copy-move-dialog.component.css']
})
export class CopyMoveDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CopyMoveDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: {StartingData: DirNode[], FileName: string, Title: string, ActionName: string}) { }

  Path : {Path : string, IsFile : boolean} = {Path : "/", IsFile : false};

  ngOnInit(): void {
  }

  onNoClick() : void {
    this.dialogRef.close();
  }
}
