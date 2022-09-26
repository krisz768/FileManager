import { Component, OnInit, Input ,Output ,EventEmitter, OnDestroy, ViewChild, OnChanges, SimpleChanges} from '@angular/core';
import { DirNode } from "../../DirDataModel";
import {SelectionModel} from '@angular/cdk/collections';
import {Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ApiConnectionService} from '../../Services/api-connection.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { LocationStrategy } from '@angular/common';
import { Observable,ObservableInput,Subscription} from 'rxjs';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CopyMoveDialogComponent} from '../../Dialogs/copy-move-dialog/copy-move-dialog.component';
import { PregressDialogComponent } from 'src/app/Dialogs/pregress-dialog/pregress-dialog.component';
import { ConfirmDialogComponent } from 'src/app/Dialogs/confirm-dialog/confirm-dialog.component';
import { NameSelectComponent } from 'src/app/Dialogs/name-select/name-select.component';
import { UploadFileDialogComponent } from 'src/app/Dialogs/upload-file-dialog/upload-file-dialog.component';

@Component({
  selector: 'app-file-manager-list-view',
  templateUrl: './file-manager-list-view.component.html',
  styleUrls: ['./file-manager-list-view.component.css'],
})
export class FileManagerListViewComponent implements OnInit, OnDestroy,OnChanges {

  constructor(private apiConnectionService: ApiConnectionService, private _MatSnackBar : MatSnackBar,private location: LocationStrategy, private dialog: MatDialog) {

  }

  @Input() StartingData : DirNode[] = [];
  @Output() ReloadData = new EventEmitter();

  @Input() Path : {Path : string, IsFile : boolean} = {Path : "/", IsFile : false};
  @Output() PathChange = new EventEmitter<{Path : string, IsFile : boolean}>();

  @Input() MobileView : boolean = false;

  @Input() PrevPeth : {Path : string, IsFile : boolean}[] = [];
  @Output() PrevPethChange = new EventEmitter<{Path : string, IsFile : boolean}[]>();

  @Input() BackButtonPress: Observable<void> = new Observable();
  private BackButtonPressSubscription: Subscription = new Subscription();

  IsLoading : boolean = false;

  dataSource = new MatTableDataSource(this.StartingData);

  private rawData : DirNode[] = this.StartingData;

  private OpenedDialog? : MatDialogRef<any, any> = undefined;
  private disableBackButton : boolean = false;
  private BackButtonPressed : boolean = false;

  @ViewChild(MatSort, { static: false }) matSort: MatSort = new MatSort();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["Path"] != null && changes["Path"].previousValue != undefined && !this.BackButtonPressed) {
        this.PrevPeth.push({Path: changes["Path"].previousValue.Path, IsFile: false});
        this.PrevPethChange.emit(this.PrevPeth);
        this.ReloadTable();
        history.pushState(null, '', window.location.href);
    }
    if (this.BackButtonPressed) {
      this.BackButtonPressed=false;
    }
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.StartingData);
    this.rawData = this.StartingData;

    this.dataSource.filterPredicate = function (record,filter) {
      return record.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase());
    }

    if (this.Path.Path != "/") {
      this.ReloadTable();
    }

    this.BackButtonPressSubscription = this.BackButtonPress.subscribe(() => {this.OnBackButtonPressed();});
  }

  ngOnDestroy() {
    this.BackButtonPressSubscription.unsubscribe();
  }

  displayedColumns = ['select','logo', 'name', 'type', 'modified', 'size', 'actions'];
  displayedColumnsMobile = ['select','logo', 'name', 'actions'];
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

  clearSort () {
    if (this.matSort != undefined) {
      ['name', 'type', 'modified', 'size'].forEach(col => {
        if (this.matSort.direction === 'asc') {
          this.matSort.sort({ id : col, start: 'desc', disableClear: false });
        } else if (this.matSort.direction === 'desc') {
          this.matSort.sort({ id : col, start: 'asc', disableClear: false });
        }
      });
    }
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (sort.direction == "") {
      this.dataSource.data = this.rawData;
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

  applyFilter(Filter: string) {
    this.dataSource.filter = Filter.trim().toLowerCase();
  }

  TableClick(row : DirNode) {
    this.ChangePathTo({Path: this.Path.Path + row.name + "/", IsFile: row.isFile});
  }

  ChangePathTo(Data : {Path : string, IsFile : boolean}) {
    if (!Data.IsFile) {
      this.Path = {Path: Data.Path, IsFile: Data.IsFile};
      this.PathChange.emit(this.Path);
      this.ReloadTable();
    } else {
      this.PrevPeth.push({Path: this.Path.Path, IsFile: false});
      this.Path = {Path: Data.Path, IsFile: Data.IsFile};
      this.PathChange.emit(this.Path);
      history.pushState(null, '', window.location.href);
    }
  }

  async ReloadTable() {
    let Done = false;
    this.clearSort();

    setTimeout(() => {
      if (!Done) {
        this.IsLoading = true;
      }
    }, 200);

    const DirData = await this.apiConnectionService.GetDirList(this.Path.Path);
    if (!DirData.error) {
      this.selection.clear();
      this.dataSource.data = DirData.data;
      this.rawData = DirData.data;
      this.IsLoading = false;
      Done = true;
    } else {
      this._MatSnackBar.open(this.apiConnectionService.ErrorCodesToString(DirData.data), "Bezárás");
      if (this.Path.Path != "/") {
        this.ChangePathTo({Path: "/", IsFile: false})
        Done = true;
        this.IsLoading = true;
      }
    }
  }

  OnBackButtonPressed() : void {
    if (!this.disableBackButton) {
      if (this.OpenedDialog == undefined) {
        this.BackButtonPressed=true;
        let PrevPeth = this.PrevPeth.pop();
        this.PrevPethChange.emit(this.PrevPeth);
        if (PrevPeth != undefined) {
          this.Path = {Path: PrevPeth.Path, IsFile: PrevPeth.IsFile};
          this.PathChange.emit(this.Path);
          if (!this.Path.IsFile) {
            this.ReloadTable();
          }
        }  else {
          this.location.back();
        }
      } else {
        this.OpenedDialog.close();
        this.OpenedDialog = undefined; 
      }
    } else {
      history.pushState(null, '', window.location.href);
    }
  }

  async ReloadDataEmitter() {
    const NewBaseData = await this.apiConnectionService.GetDirList("/");
    this.ReloadData.emit(NewBaseData);
    this.ReloadTable();
  }

  OnCopyButtonPressed() {
    if (this.selection.selected.length == 0) {
      this._MatSnackBar.open("Nincs egy fájl vagy mappa sem kijelölve.", "Bezárás",{
        duration: 3000
      });
    } else {
      history.pushState(null, '', window.location.href);
      const dialogRef = this.dialog.open(CopyMoveDialogComponent, {data: {StartingData: JSON.parse(JSON.stringify(this.StartingData)), FileName: "", Title: "Másolás", ActionName: "Másol"}, closeOnNavigation: false});
      this.OpenedDialog = dialogRef;
      dialogRef.afterClosed().subscribe(async result => {
        this.OpenedDialog = undefined;
        if(result != undefined) {
          if (!(result as string).endsWith("/")) {
            result += "/";
          }

          const PregressDialogRef = this.dialog.open(PregressDialogComponent, {closeOnNavigation: false, disableClose: true});
          this.disableBackButton = true;
          const Files = await this.GetAllFiles(this.Path.Path, this.selection.selected);
          PregressDialogRef.componentInstance.Max = Files.length.toString();
          PregressDialogRef.componentInstance.Prep = false;
          const CopySucess = await this.Copy(Files, result, this.Path.Path, PregressDialogRef);

          if(!CopySucess) {
            this._MatSnackBar.open("Hiba történt, másolás nem végrehajtható.", "Bezárás",{
              duration: 10000
            });
          } else {
            this._MatSnackBar.open("Másolás sikeres volt!", "Bezárás",{
              duration: 2000
            });
          }

          PregressDialogRef.close();
          this.disableBackButton = false;
        }

        this.ReloadDataEmitter();
      });
    }
  }

  async Copy(Files: DirNode[], Dest : string, Source : string, ProgressDialog : MatDialogRef<PregressDialogComponent>) : Promise<boolean> {
    ProgressDialog.componentInstance.Title = "Másolás...";
    for (const element of Files) {
      if (element.isFile) {
        if(element.path != undefined) {
          let relPath = element.path.replace(Source, "");

          const RespData = await this.apiConnectionService.CopyFile(Source + relPath + element.name, Dest + relPath + element.name);
          if (RespData.error) {
            return false;
          }
        }
      } else {
        if(element.path != undefined) {
          let relPath = element.path.replace(Source, "");

          const RespData = await this.apiConnectionService.CreateFolder(Dest + relPath + element.name);
          if (RespData.error) {
            return false;
          }
        }
      }
      ProgressDialog.componentInstance.OneDone();
    }

    return true;
  }

  OnMoveButtonPressed() {
    if (this.selection.selected.length == 0) {
      this._MatSnackBar.open("Nincs egy fájl vagy mappa sem kijelölve.", "Bezárás",{
        duration: 3000
      });
    } else {
      history.pushState(null, '', window.location.href);
      const dialogRef = this.dialog.open(CopyMoveDialogComponent, {data: {StartingData: JSON.parse(JSON.stringify(this.StartingData)), FileName: "", Title: "Kivágás", ActionName: "Kivág"}, closeOnNavigation: false});
      this.OpenedDialog = dialogRef;
      dialogRef.afterClosed().subscribe(async result => {
        this.OpenedDialog = undefined;
        if(result != undefined) {
          if (!(result as string).endsWith("/")) {
            result += "/";
          }

          const PregressDialogRef = this.dialog.open(PregressDialogComponent, {closeOnNavigation: false, disableClose: true});
          this.disableBackButton = true;
          const Files = await this.GetAllFiles(this.Path.Path, this.selection.selected);
          PregressDialogRef.componentInstance.Max = Files.length.toString();
          PregressDialogRef.componentInstance.Prep = false;
          const CopySucess = await this.Move(Files, result, this.Path.Path, PregressDialogRef);

          if(!CopySucess) {
            this._MatSnackBar.open("Hiba történt, mozgatás nem végrehajtható.", "Bezárás",{
              duration: 10000
            });
          } else {
            this._MatSnackBar.open("Kivágás sikeres volt!", "Bezárás",{
              duration: 2000
            });
          }

          PregressDialogRef.close();
          this.disableBackButton = false;
        }

        this.ReloadDataEmitter();
      });
    }
  }

  async Move(Files: DirNode[], Dest : string, Source : string, ProgressDialog : MatDialogRef<PregressDialogComponent>) : Promise<boolean> {
    ProgressDialog.componentInstance.Title = "Mozgatás...";
    for (const element of Files) {
      if (element.isFile) {
        if(element.path != undefined) {
          let relPath = element.path.replace(Source, "");

          const RespData = await this.apiConnectionService.MoveFile(Source + relPath + element.name, Dest + relPath + element.name);
          if (RespData.error) {
            return false;
          }
        }
      } else {
        if(element.path != undefined) {
          let relPath = element.path.replace(Source, "");

          const RespData = await this.apiConnectionService.CreateFolder(Dest + relPath + element.name);
          if (RespData.error) {
            return false;
          }
        }
      }
      ProgressDialog.componentInstance.OneDone();
    }

    for (let i = Files.length-1; i >= 0; i--) {
      const element = Files[i];
      if (!element.isFile) {
        const RespData = await this.apiConnectionService.DeleteFolder(element.path + element.name);
        if (RespData.error) {
          return false;
        }
      }
    }

    return true;
  }

  OnDeleteButtonPressed() {
    if (this.selection.selected.length == 0) {
      this._MatSnackBar.open("Nincs egy fájl vagy mappa sem kijelölve.", "Bezárás",{
        duration: 3000
      });
    } else {
      history.pushState(null, '', window.location.href);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {Title: "Biztosan törlöd?", ActionName: "Töröl", Description: "biztosan törlöd a kiválasztott " + this.selection.selected.length + " db elemet?"}, closeOnNavigation: false});
      this.OpenedDialog = dialogRef;
      dialogRef.afterClosed().subscribe(async result => {
        this.OpenedDialog = undefined;
        if(result != undefined && result) {

          const PregressDialogRef = this.dialog.open(PregressDialogComponent, {closeOnNavigation: false, disableClose: true});
          this.disableBackButton = true;
          const Files = await this.GetAllFiles(this.Path.Path, this.selection.selected);
          PregressDialogRef.componentInstance.Max = Files.length.toString();
          PregressDialogRef.componentInstance.Prep = false;
          const DeleteSucess = await this.Delete(Files, this.Path.Path, PregressDialogRef);

          if(!DeleteSucess) {
            this._MatSnackBar.open("Hiba történt, törlés nem végrehajtható.", "Bezárás",{
              duration: 10000
            });
          } else {
            this._MatSnackBar.open("Törlés sikeres volt!", "Bezárás",{
              duration: 2000
            });
          }

          PregressDialogRef.close();
          this.disableBackButton = false;
        }

        this.ReloadDataEmitter();
      });
    }
  }

  async Delete(Files: DirNode[], Source : string, ProgressDialog : MatDialogRef<PregressDialogComponent>) : Promise<boolean> {
    ProgressDialog.componentInstance.Title = "Mozgatás...";
    for (const element of Files) {
      if (element.isFile) {
        if(element.path != undefined) {
          const RespData = await this.apiConnectionService.DeleteFile(element.path + element.name);
          if (RespData.error) {
            return false;
          }
        }
        ProgressDialog.componentInstance.OneDone();
      }
      
    }

    for (let i = Files.length-1; i >= 0; i--) {
      const element = Files[i];
      if (!element.isFile) {
        const RespData = await this.apiConnectionService.DeleteFolder(element.path + element.name);
        if (RespData.error) {
          return false;
        }
        ProgressDialog.componentInstance.OneDone();
      }
    }

    return true;
  }

  OnNewFolderButtonPressed() {
    history.pushState(null, '', window.location.href);
      const dialogRef = this.dialog.open(NameSelectComponent, {data: {Title: "Új mappa létrehozása", ActionName: "Létrehoz",InputName: "Név"}, closeOnNavigation: false});
      this.OpenedDialog = dialogRef;
      dialogRef.afterClosed().subscribe(async result => {
        this.OpenedDialog = undefined;
        if(result != undefined) {
          const PregressDialogRef = this.dialog.open(PregressDialogComponent, {closeOnNavigation: false, disableClose: true});
          this.disableBackButton = true;
          PregressDialogRef.componentInstance.Max = "1";
          PregressDialogRef.componentInstance.Prep = false;


          const RespData = await this.apiConnectionService.CreateFolder(this.Path.Path + result);
          if (RespData.error) {
            this._MatSnackBar.open(this.apiConnectionService.ErrorCodesToString(RespData.data), "Bezárás",{
              duration: 10000
            });
          } else {
            this._MatSnackBar.open(this.apiConnectionService.ErrorCodesToString(RespData.data), "Bezárás",{
              duration: 2000
            });
          }
          PregressDialogRef.close();
          this.disableBackButton = false;
        }

        this.ReloadDataEmitter();
      });
  }

  OnUploadButtonPressed() {
    const dialogRef = this.dialog.open(UploadFileDialogComponent, {closeOnNavigation: false});
      this.OpenedDialog = dialogRef;
      dialogRef.afterClosed().subscribe(async result => {
        this.OpenedDialog = undefined;
        if(result != undefined) {
          const PregressDialogRef = this.dialog.open(PregressDialogComponent, {closeOnNavigation: false, disableClose: true});
          this.disableBackButton = true;
          PregressDialogRef.componentInstance.Max = result.length;
          PregressDialogRef.componentInstance.Prep = false;
          PregressDialogRef.componentInstance.Title = "Feltöltés...";

          const RespData = await this.apiConnectionService.UploadFile(this.Path.Path, result,PregressDialogRef);
          if (RespData.error) {
            this._MatSnackBar.open(this.apiConnectionService.ErrorCodesToString(RespData.data), "Bezárás",{
              duration: 10000
            });
          } else {
            this._MatSnackBar.open(this.apiConnectionService.ErrorCodesToString(RespData.data), "Bezárás",{
              duration: 2000
            });
          }
          
          PregressDialogRef.close();
          this.disableBackButton = false;
        }

        this.ReloadDataEmitter();
      });
  }

  async OnZipButtonPressed() {
    if (this.selection.selected.length == 0) {
      this._MatSnackBar.open("Nincs egy fájl vagy mappa sem kijelölve.", "Bezárás",{
        duration: 3000
      });
    } else {
      history.pushState(null, '', window.location.href);
  

      const PregressDialogRef = this.dialog.open(PregressDialogComponent, {closeOnNavigation: false, disableClose: true});
      PregressDialogRef.componentInstance.PercentDisplay = 0;
      this.disableBackButton = true;
      const Files = await this.GetAllFiles(this.Path.Path, this.selection.selected);

      let DownloadStatus : Observable<any> = this.apiConnectionService.DownloadZip(this.Path.Path ,Files, (Error : string) : ObservableInput<any> => {
        this._MatSnackBar.open("Hiba történt a zip elkészítése közben. (MAX 2GB/fájl)", "Bezárás");
        PregressDialogRef.close();
        this.disableBackButton = false;
        return new Observable();
      });

      DownloadStatus.subscribe(val =>{
        if(val.state == "IN_PROGRESS") {
          if (PregressDialogRef.componentInstance.Prep != false) {
            PregressDialogRef.componentInstance.Prep = false;
            PregressDialogRef.componentInstance.Title = "Letöltés...";
          }

          PregressDialogRef.componentInstance.PercentDisplay = val.progress;
          PregressDialogRef.componentInstance.Percent = val.progress;
        } else if (val.state == "DONE") {
          PregressDialogRef.close();
          this.disableBackButton = false;
        }
      });
    }
  }


  async GetAllFiles(Path : string, StartingData? : DirNode[]) : Promise<DirNode[]> {
    let Files : DirNode[] = [];

    if(StartingData != undefined) {
      for (const element of StartingData) {
        const clonedElement = Object.assign({}, element);
        if (clonedElement.isFile) {
          clonedElement.path = Path;
          Files.push(clonedElement);
        } else {
          const FilesInFolder = await this.GetAllFiles(Path + clonedElement.name + "/");
          clonedElement.path = Path;
          Files.push(clonedElement);
          Files.push(...FilesInFolder);
        }
      }
    }else {
      const DirData = await this.apiConnectionService.GetDirList(Path);
      if (!DirData.error) {
        for (const element of DirData.data as DirNode[]) {
          const clonedElement = Object.assign({}, element);
          if (clonedElement.isFile) {
            clonedElement.path = Path;
            Files.push(clonedElement);
          } else {
            const FilesInFolder = await this.GetAllFiles(Path + clonedElement.name + "/");
            clonedElement.path = Path;
            Files.push(clonedElement);
            Files.push(...FilesInFolder);
          }
        }
      } else {
        this._MatSnackBar.open("Hiba történt, előfordulhat, hogy egyes fájlok kimaradtak.", "Bezárás",{
          duration: 10000
        });
      }
    }

    return Files;
  }

  OnRenameButtonClick(evt : any, Element : DirNode) {
    evt.stopPropagation();

    history.pushState(null, '', window.location.href);
    const dialogRef = this.dialog.open(NameSelectComponent, {data: {Title: "Átnevezés", ActionName: "Mentés",InputName: "Név", DefaultString: Element.name}, closeOnNavigation: false});
    this.OpenedDialog = dialogRef;
    dialogRef.afterClosed().subscribe(async result => {
      this.OpenedDialog = undefined;
      if(result != undefined) {
        const PregressDialogRef = this.dialog.open(PregressDialogComponent, {closeOnNavigation: false, disableClose: true});
        this.disableBackButton = true;
        PregressDialogRef.componentInstance.Max = "1";
        PregressDialogRef.componentInstance.Prep = false;


        const RespData = await this.apiConnectionService.Rename(this.Path.Path, Element.name, result);
        if (RespData.error) {
          this._MatSnackBar.open(this.apiConnectionService.ErrorCodesToString(RespData.data), "Bezárás",{
            duration: 10000
          });
        } else {
          this._MatSnackBar.open(this.apiConnectionService.ErrorCodesToString(RespData.data), "Bezárás",{
            duration: 2000
          });
        }
        PregressDialogRef.close();
        this.disableBackButton = false;
      }

      this.ReloadDataEmitter();
    });
  }

  OnShareButtonClick(evt : any, Element : DirNode) {
    evt.stopPropagation();
  }
}
