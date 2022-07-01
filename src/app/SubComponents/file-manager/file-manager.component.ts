import { Component, OnInit, Input } from '@angular/core';
import { DirNode } from "../../DirDataModel";

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})
export class FileManagerComponent implements OnInit {

  constructor() { }

  MobileView : boolean = false;

  @Input() StartingData : DirNode[] = [];

  ngOnInit(): void {
    window.onresize = () => {this.MobileView = window.innerWidth < 1000;};

    this.MobileView = window.innerWidth < 1000;
  }

}
