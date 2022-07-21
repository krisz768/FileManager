import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-name-select',
  templateUrl: './name-select.component.html',
  styleUrls: ['./name-select.component.css']
})
export class NameSelectComponent implements OnInit {

  constructor(public matDialogRef: MatDialogRef<NameSelectComponent>,@Inject(MAT_DIALOG_DATA) public data: {Title: string, ActionName: string, InputName: string}) { }

  Name : string = "";

  ngOnInit(): void {
    
  }

  onNoClick() {
    this.matDialogRef.close();
  }

  onEnter() {
    this.matDialogRef.close(this.Name);
  }
}
