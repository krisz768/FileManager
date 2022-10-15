import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiConnectionService} from '../../Services/api-connection.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.css']
})
export class ShareDialogComponent implements OnInit {

  constructor (private _MatSnackBar : MatSnackBar,private apiConnectionService: ApiConnectionService,public dialogRef: MatDialogRef<ShareDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: {RelPath: string}) { }

  IsLoading : boolean = true;

  Link : string = "";

  async ngOnInit() {
    const RespData = await this.apiConnectionService.CreateShareLink(this.data.RelPath);
    if (RespData.error) {
      this._MatSnackBar.open(this.apiConnectionService.ErrorCodesToString(RespData.data), "Bezárás",{
        duration: 10000
      });
      this.dialogRef.close();
    } else {
      this.IsLoading = false;
      this.Link = this.apiConnectionService.ShareLink + RespData.data;
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  OnCopyClick() {
    this._MatSnackBar.open("Vágólapra másolva!", "Bezárás",{
      duration: 2000
    });
  }
}
