import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pregress-dialog',
  templateUrl: './pregress-dialog.component.html',
  styleUrls: ['./pregress-dialog.component.css']
})
export class PregressDialogComponent implements OnInit {


  Title : string = "Felkészülés...";
  Prep : boolean = true;
  Max : string = "?";
  Inprogress : number = 0;
  Percent : number = 0;

  PercentDisplay? : number;

  constructor() { }

  ngOnInit(): void {
  }

  OneDone() {
    this.Inprogress++;
    const Maxint = Number.parseInt(this.Max);
    this.Percent = Math.round((this.Inprogress/Maxint)*100);
  }
}
