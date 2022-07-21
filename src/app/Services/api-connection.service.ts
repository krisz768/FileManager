import { Injectable, Inject } from '@angular/core';

import { HttpClient, HttpEventType } from '@angular/common/http';
import { ResponseModel } from '../ResponseModel';
import { Observable, take,lastValueFrom, catchError, ObservableInput, takeLast, BehaviorSubject, Subject, finalize, last} from 'rxjs';
import { HttpParams } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { LoginDialogComponent } from '../Dialogs/login-dialog/login-dialog.component';
import { PregressDialogComponent } from '../Dialogs/pregress-dialog/pregress-dialog.component';
import { DirNode } from '../DirDataModel';
import { download, Download } from './download';
import {Saver, SAVER} from './saver.provider';

@Injectable({
  providedIn: 'root'
})
export class ApiConnectionService {

  constructor(private http: HttpClient,private _MatSnackBar : MatSnackBar, private dialog: MatDialog,@Inject(SAVER) private save: Saver) { }

  private BaseUrl : string = "";
  private Username : string = "";

  OnNewLogin = new BehaviorSubject<string>("");
  LockBackButton = new Subject();
  UnlockBackButton = new Subject();

  async IsLoggedIn() : Promise<ResponseModel> {
    const RespObservable = this.http.post<ResponseModel>(this.BaseUrl + "api/FileManager/IsLoggedIn", "").pipe(take(1),catchError(val => this.OnError(val)));
    return await lastValueFrom(RespObservable);
  }

  async Login(Username : string, Password: string) : Promise<ResponseModel> {
    const params = new HttpParams()
      .append('Username', Username)
      .append('Password', Password);

    const RespObservable = this.http.post<ResponseModel>(this.BaseUrl + "api/FileManager/Login", "", {params: params}).pipe(take(1),catchError(val => this.OnError(val)));
    const LoginData = await lastValueFrom(RespObservable);
    if (!LoginData.error) {
      this.Username = LoginData.data;
    }
    return LoginData;
  }

  async GetUsername() : Promise<ResponseModel> {
    const RespObservable = this.http.post<ResponseModel>(this.BaseUrl + "api/FileManager/GetUsername", "").pipe(take(1),catchError(val => this.OnError(val)));
    const UsernameData = await lastValueFrom(RespObservable);
    if (!UsernameData.error) {
      this.Username = UsernameData.data;
    }
    return UsernameData;
  }

  async LogOut() : Promise<ResponseModel> {
    const RespObservable = this.http.post<ResponseModel>(this.BaseUrl + "api/FileManager/LogOut", "").pipe(take(1),catchError(val => this.OnError(val)));
    return await lastValueFrom(RespObservable);

  }

  async GetDirList(Path : string) : Promise<ResponseModel> {
    const params = new HttpParams()
      .append('subFolder', Path);
      const RespObservable = this.http.post<ResponseModel>(this.BaseUrl + "api/FileManager/ListFolder", "",{params: params}).pipe(take(1),catchError(val => this.OnError(val)));
      const Data : ResponseModel = await lastValueFrom(RespObservable);
      if (Data.error && Data.data == "<NotLoggedIn>") {
        const Login = await this.ShowLoginScreen();
        if (Login) {
          return this.GetDirList(Path);
        } else {
          return {error : true, data : "<UserMismatch>"};
        }
      }
      return Data;
  }

  async CopyFile(Path : string, DestPath : string) : Promise<ResponseModel> {
    const params = new HttpParams()
    .append('FilePath', Path)
    .append('DestinationPath', DestPath);
    const RespObservable = this.http.post<ResponseModel>(this.BaseUrl + "api/FileManager/CopyFile", "",{params: params}).pipe(take(1),catchError(val => this.OnError(val)));
    const Data : ResponseModel = await lastValueFrom(RespObservable);
    if (Data.error && Data.data == "<NotLoggedIn>") {
      const Login = await this.ShowLoginScreen();
      if (Login) {
        return this.CopyFile(Path, DestPath);
      } else {
        return {error : true, data : "<UserMismatch>"};
      }
    }
    return Data;
  }

  async MoveFile(Path : string, DestPath : string) : Promise<ResponseModel> {
    const params = new HttpParams()
    .append('FilePath', Path)
    .append('DestinationPath', DestPath);
    const RespObservable = this.http.post<ResponseModel>(this.BaseUrl + "api/FileManager/MoveFile", "",{params: params}).pipe(take(1),catchError(val => this.OnError(val)));
    const Data : ResponseModel = await lastValueFrom(RespObservable);
    if (Data.error && Data.data == "<NotLoggedIn>") {
      const Login = await this.ShowLoginScreen();
      if (Login) {
        return this.MoveFile(Path, DestPath);
      } else {
        return {error : true, data : "<UserMismatch>"};
      }
    }
    return Data;
  }

  async CreateFolder(Path : string) : Promise<ResponseModel> {
    const params = new HttpParams()
    .append('FolderPath', Path);
    const RespObservable = this.http.post<ResponseModel>(this.BaseUrl + "api/FileManager/CreateFolder", "",{params: params}).pipe(take(1),catchError(val => this.OnError(val)));
    const Data : ResponseModel = await lastValueFrom(RespObservable);
    if (Data.error && Data.data == "<NotLoggedIn>") {
      const Login = await this.ShowLoginScreen();
      if (Login) {
        return this.CreateFolder(Path);
      } else {
        return {error : true, data : "<UserMismatch>"};
      }
    }
    return Data;
  }

  async DeleteFolder(Path : string) : Promise<ResponseModel> {
    const params = new HttpParams()
    .append('FolderPath', Path);
    const RespObservable = this.http.post<ResponseModel>(this.BaseUrl + "api/FileManager/DeleteFolder", "",{params: params}).pipe(take(1),catchError(val => this.OnError(val)));
    const Data : ResponseModel = await lastValueFrom(RespObservable);
    if (Data.error && Data.data == "<NotLoggedIn>") {
      const Login = await this.ShowLoginScreen();
      if (Login) {
        return this.DeleteFolder(Path);
      } else {
        return {error : true, data : "<UserMismatch>"};
      }
    }
    return Data;
  }

  async DeleteFile(Path : string) : Promise<ResponseModel> {
    const params = new HttpParams()
    .append('FilePath', Path);
    const RespObservable = this.http.post<ResponseModel>(this.BaseUrl + "api/FileManager/DeleteFile", "",{params: params}).pipe(take(1),catchError(val => this.OnError(val)));
    const Data : ResponseModel = await lastValueFrom(RespObservable);
    if (Data.error && Data.data == "<NotLoggedIn>") {
      const Login = await this.ShowLoginScreen();
      if (Login) {
        return this.DeleteFile(Path);
      } else {
        return {error : true, data : "<UserMismatch>"};
      }
    }
    return Data;
  }

  async UploadFile(Path : string, files : File[], dialog: MatDialogRef<PregressDialogComponent, any>) : Promise<ResponseModel> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) { 
      formData.append("Files", files[i]);
    }
    formData.append("FolderPath", Path);
    dialog.componentInstance.Prep = false;
    const RespObservable = this.http.post<ResponseModel>(this.BaseUrl + "api/FileManager/UploadFile", formData,{reportProgress: true,observe: 'events'}).pipe(catchError(val => this.OnError(val)));
    RespObservable.subscribe(event => {
      if (event.type == HttpEventType.UploadProgress) {
        const uploadProgress = Math.round(100 * (event.loaded / event.total));
        dialog.componentInstance.PercentDisplay = uploadProgress;
        dialog.componentInstance.Percent = uploadProgress;
        if (uploadProgress == 100) {
          dialog.componentInstance.Prep = true;
          dialog.componentInstance.Title = "Feldolgozás, kérlek várj....";
        }
      }
    })
    const Data : ResponseModel = (await lastValueFrom(RespObservable)).body;
    if (Data.error && Data.data == "<NotLoggedIn>") {
      const Login = await this.ShowLoginScreen();
      
      if (Login) {
        return this.UploadFile(Path,files,dialog);
      } else {
        return {error : true, data : "<UserMismatch>"};
      }
    }
    return Data;
  }

  DownloadZip (BasePath : string, Files : DirNode[], ErrorCallback : Function) {
    let DownlaodLink = this.BaseUrl + "api/FileManager/DownloadZip?BasePath=" + encodeURIComponent(BasePath) + "&"; 

    for (const File of Files) {
      if (File.isFile) {
        let spaceFix = "FilePaths=" + encodeURIComponent(File.path + File.name)+ "&";
        DownlaodLink += spaceFix; 
      }
    }

    let date = new Date();
    let dateString = date.getFullYear() + "-" + (date.getMonth()+1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + "_" + date.getHours().toString().padStart(2, '0') + "-" + date.getMinutes().toString().padStart(2, '0');
    
    return this.http.get(DownlaodLink, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    }).pipe(download(blob => this.save(blob, dateString)),catchError(val => {return ErrorCallback(val)}));
  }

  






  

  OnError(Error : string) : ObservableInput<any> {
    this._MatSnackBar.open("Szerver kapcsolati hiba (nincs internet?), kérlek töltsd újra az oldalt.");
    console.log(Error);
    return new Observable();
  }

  async ShowLoginScreen() : Promise<boolean> {
    this.LockBackButton.next(null);
    const dialogRef = this.dialog.open(LoginDialogComponent,{ disableClose: true, closeOnNavigation: false});
    const PrevUser = this.Username;
    const dialogCloseRef = dialogRef.afterClosed().pipe(take(1));
    this._MatSnackBar.open("Inaktivitás miatt ki lettél jelentkeztetve.", "Rendben", {duration: 5000});
    const IsLogedIn = await lastValueFrom(dialogCloseRef);
    this.OnNewLogin.next(IsLogedIn);
    this.UnlockBackButton.next(null)
    if (PrevUser != IsLogedIn) {
      return false;
    }
    return true;
  }


  ErrorCodesToString (ErrorCode : string) : string {
    let List : {[name : string]: string} = {
      "<DatabaseError>": "Adatbázis hiba történt. Próbálja újra később.",
       "<LoginError>": "Hibás felhasználónév vagy jelszó.", 
       "<LoggedOut>": "Kijelentkeztél.", 
       "<NotLoggedIn>": "Nem vagy bejelentkezve. Kérlek jelentkezz be újra.", 
       "<ListError>": "Szerver hiba: Az adott mappa nem listázható.", 
       "<DeleteError>" : "Hiba történt a törlés közben.", 
       "<CopyError>" : "Hiba történt a fájl másolása közben.", 
       "<CopySuccessful>" : "Sikeres másolás.", 
       "<DeleteSuccessful>": "Sikeres törlés.",
       "<UserMismatch>": "A művelet nem volt végrehajtható, mert másik felhasználóval lett belépve.",
       "<FolderCreateSucessful>": "Mappa sikeresen létrehozva.",
       "<FolderCreateError>": "Hiba történt a mappa létrehozásakor.",
       "<FolderDeleteError>": "Hiba történt a mappa törlésekor.",
       "<FolderDeleteSucessful>": "Mappa sikeresen törölve.",
       "<UploadError>": "Hiba történt a feltöltés során.",
       "<UploadSucessful>": "A feltöltés sikeresen befejeződött."
      };
   
    return List[ErrorCode];
  }
}
