import { Component, OnInit, Input} from '@angular/core';
import { DirNode } from "../../DirDataModel";
import {SelectionModel} from '@angular/cdk/collections';
import {Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ApiConnectionService} from '../../Services/api-connection.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-file-manager-list-view',
  templateUrl: './file-manager-list-view.component.html',
  styleUrls: ['./file-manager-list-view.component.css'],
})
export class FileManagerListViewComponent implements OnInit {

  constructor(private apiConnectionService: ApiConnectionService, private _MatSnackBar : MatSnackBar,private location: LocationStrategy) {
    history.pushState(null, '', window.location.href);
    this.location.onPopState((event) => {
        return this.OnBackButtonPressed();
    });
   }

  @Input() StartingData : DirNode[] = [];

  Path : string = "/";

  PrevPeth : string[] = [];

  IsLoading : boolean = false;

  dataSource = new MatTableDataSource(this.StartingData);

  rawData : DirNode[] = this.StartingData;


  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.StartingData);
    this.rawData = this.StartingData;
  }

  displayedColumns = ['select','logo', 'name', 'type', 'modified', 'size', 'actions'];
  selection = new SelectionModel<DirNode>(true, [])

  IsFileToString(Node : DirNode) {
    return Node.isFile ? "Fájl" : "Mappa";
  }

  LastModToString(Node : DirNode) {
    let date = new Date(Node.lastMod);
    return date.getFullYear() + ". " + (date.getMonth()+1).toString().padStart(2, '0') + ". " + date.getDate().toString().padStart(2, '0') + ". " + date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0');
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: DirNode): string {
    return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (sort.direction == "") {
      this.dataSource = new MatTableDataSource(this.rawData);
    } else {
      this.dataSource.data = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'name':
            return this.compare(a.name, b.name, isAsc);
          case 'type':
            return this.compare(a.isFile.toString(), b.isFile.toString(), isAsc);
          case 'modified':
            return this.compare(a.lastMod.toString(), b.lastMod.toString(), isAsc);
          case 'size':
            return this.compare(this.GetRealSize(a.size), this.GetRealSize(b.size), isAsc); 
          default:
            return this.compare(a.name, b.name, !isAsc);
        }
      });
    }
  }
  
  GetRealSize(size : string) : number {
    let sizeN : number = Number.parseFloat(size.split(' ')[0]);
    let Unit : string = size.split(' ')[1];

    let Final : number = 0;

    if(Unit == "B") {
      Final = sizeN;
    }else if (Unit == "KB"){
      Final = sizeN*1024;
    }else if (Unit == "MB"){
      Final = sizeN*(1024**2);
    }else if (Unit == "GB"){
      Final = sizeN*(1024**3);
    }else if (Unit == "TB"){
      Final = sizeN*(1024**4);
    } 
    return Final;
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    let Res = (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    return Res;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //path change
  TableClick(row : DirNode) {
    if (!row.isFile) {
      this.PrevPeth.push(this.Path);
      this.Path += row.name + "/";
      this.ReloadTable();
    }
  }

  //path change
  ReloadTable() {
    let Done = false;
    this.apiConnectionService.GetDirList(this.Path).subscribe((data) => {
      if (!data.error) {
        this.dataSource = new MatTableDataSource(data.data);
        this.rawData = data.data;
        this.IsLoading = false;
        Done = true;
      } else {
        this._MatSnackBar.open(this.apiConnectionService.ErrorCodesToString(data.data), "Bezárás");
        if (this.Path != "/") {
          this.Path = "/";
          this.ReloadTable();
        }
      }},(error) => {
        this._MatSnackBar.open("Hiba történt a szerver elérése közben.", "Bezárás");
      });

      setTimeout(() => {
        if (!Done) {
          this.IsLoading = true;
        }
      }, 200);
  }

  OnBackButtonPressed() : boolean{
    let PrevPeth = this.PrevPeth.pop();
    if (PrevPeth != undefined) {
      this.Path = PrevPeth;
      this.ReloadTable();
    }  else {
      this.location.back();
    }
    history.pushState(null, '', window.location.href);
    return false;
  }
}
