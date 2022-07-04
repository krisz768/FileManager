import { Component, OnInit, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-manager-url-view',
  templateUrl: './file-manager-url-view.component.html',
  styleUrls: ['./file-manager-url-view.component.css']
})
export class FileManagerUrlViewComponent implements OnInit {

  constructor() { }

  folders : string[] = []

  @Output() OnNewSearch = new EventEmitter<string>();

  @Output() OnNewPath = new EventEmitter<{Path : string, IsFile : boolean}>();

  ngOnInit(): void {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.OnNewSearch.emit(filterValue);
  }

  OnPathChange(path : string) {
    this.folders = path.split("/");
    if (this.folders.length == 2 && this.folders[0] == "" && this.folders[1] == "") {
      this.folders = [];
    } else if (this.folders[0] == ""){
      this.folders.shift();
    }
    if (this.folders[this.folders.length-1] == ""){
      this.folders.pop();
    }
  }

  ChangePath(index : number) {
    let finalpath : string = ""; 

    if (index == -1) {
      finalpath = "/";
    }

    for (let i = 0; i <= index; i++) {
      finalpath += this.folders[i] + "/";
    }

    this.OnNewPath.emit({Path: finalpath, IsFile: false});
  }
}
