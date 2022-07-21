import { Component, Input, OnInit,} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-upload-file-dialog',
  templateUrl: './upload-file-dialog.component.html',
  styleUrls: ['./upload-file-dialog.component.css']
})
export class UploadFileDialogComponent implements OnInit {

  constructor(public matDialogRef: MatDialogRef<UploadFileDialogComponent>) { }

  ngOnInit(): void {
  }

  onNoClick() {
    this.matDialogRef.close();
  }

  files: File[] = [];

  filesDropped(files: File[]): void {
    this.files = files;
    this.matDialogRef.close(files);
  }

  ShowDialog() {
    (document.querySelector('.dropzone input')! as HTMLElement).click();
  }

  FileSelected(e: any) {
    this.files = e.target.files;
    this.matDialogRef.close(e.target.files);
  }
}
