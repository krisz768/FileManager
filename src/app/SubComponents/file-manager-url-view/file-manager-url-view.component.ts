import { Component, OnInit, Output,EventEmitter,ViewChild, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-file-manager-url-view',
  templateUrl: './file-manager-url-view.component.html',
  styleUrls: ['./file-manager-url-view.component.css']
})
export class FileManagerUrlViewComponent implements OnInit,OnChanges {

  constructor() { }

  folders : string[] = []

  @Output() OnNewSearch = new EventEmitter<string>();

  @Input() Path : {Path : string, IsFile : boolean} = {Path : "/", IsFile : false};
  @Output() PathChange = new EventEmitter<{Path : string, IsFile : boolean}>();

  @Input() PrevPeth : {Path : string, IsFile : boolean}[] = [];
  @Output() PrevPethChange = new EventEmitter<{Path : string, IsFile : boolean}[]>();

  @ViewChild('FilterInput') FiterInput : ElementRef = new ElementRef(null);

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["Path"] != undefined) {
      this.OnPathChange();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.OnNewSearch.emit(filterValue);
  }

  OnPathChange() {
    this.folders = this.Path.Path.split("/");
    if (this.folders.length == 2 && this.folders[0] == "" && this.folders[1] == "") {
      this.folders = [];
    } else if (this.folders[0] == ""){
      this.folders.shift();
    }
    if (this.folders[this.folders.length-1] == ""){
      this.folders.pop();
    }

    if (this.FiterInput != null) {
      if (this.FiterInput.nativeElement != null) {
        if (this.FiterInput.nativeElement.value != "") {
          this.FiterInput.nativeElement.value = "";
          this.OnNewSearch.emit("");
        }
      }
    }
    
  }

  ChangePath(index : number) {
    let finalpath : string = "/"; 

    for (let i = 0; i <= index; i++) {
      finalpath += this.folders[i] + "/";
    }

    if (this.Path.IsFile) {
      this.PrevPeth.push({Path: this.Path.Path, IsFile: this.Path.IsFile});
      this.PrevPethChange.emit(this.PrevPeth);
      history.pushState(null, '', window.location.href);
    }
    this.Path = {Path: finalpath, IsFile: false};
    this.PathChange.emit({Path: finalpath, IsFile: false});
  }
}
