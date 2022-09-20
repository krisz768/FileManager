import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ApiConnectionService} from '../../Services/api-connection.service';

@Component({
  selector: 'app-file-manager-file-view',
  templateUrl: './file-manager-file-view.component.html',
  styleUrls: ['./file-manager-file-view.component.css']
})
export class FileManagerFileViewComponent implements OnInit {

  FileType: String = "application/octet-stream";
  IsLoading : boolean = true;

  @Input() Path : {Path : string, IsFile : boolean} = {Path : "/", IsFile : false};

  constructor(private apiConnectionService: ApiConnectionService,  private _MatSnackBar : MatSnackBar) { }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["Path"] != undefined) {
      this.LoadFile();
    }
  }

  async LoadFile() {
    this.IsLoading = true;
    const FileData = await this.apiConnectionService.GetFileType(this.Path.Path);

    if (FileData.error) {
      this._MatSnackBar.open(this.apiConnectionService.ErrorCodesToString(FileData.data), "Bezárás",{
        duration: 10000
      });
    } else {
      this.FileType = FileData.data;
      this.IsLoading = false;
    }
  }

  GetFileUrl() : String {
    return this.apiConnectionService.BaseUrl + "api/FileManager/DownloadFile?FilePath=" + encodeURIComponent(this.Path.Path);
  }


}
