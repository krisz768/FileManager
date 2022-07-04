import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '../ResponseModel';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiConnectionService {

  constructor(private http: HttpClient) { }

  private BaseUrl : string = "";

  IsLoggedIn() : Observable<ResponseModel> {
    return this.http.post<ResponseModel>(this.BaseUrl + "api/FileManager/IsLoggedIn", "");
  }

  Login(Username : string, Password: string) : Observable<ResponseModel> {
    const params = new HttpParams()
      .append('Username', Username)
      .append('Password', Password);

    return this.http.post<ResponseModel>(this.BaseUrl + "api/FileManager/Login", "", {params: params});
  }

  GetUsername() : Observable<ResponseModel> {
    return this.http.post<ResponseModel>(this.BaseUrl + "api/FileManager/GetUsername", "");
  }

  LogOut() : Observable<ResponseModel> {
    return this.http.post<ResponseModel>(this.BaseUrl + "api/FileManager/LogOut", "");
  }

  GetDirList(Path : string) : Observable<ResponseModel> {
    const params = new HttpParams()
      .append('subFolder', Path);
    return this.http.post<ResponseModel>(this.BaseUrl + "api/FileManager/ListFolder", "",{params: params});
  }


  ErrorCodesToString (ErrorCode : string) : string {
    let List : {[name : string]: string} = {"<DatabaseError>": "Adatbázis hiba történt. Próbálja újra később.", "<LoginError>": "Hibás felhasználónév vagy jelszó.", "<LoggedOut>": "Kijelentkeztél.", "<NotLoggedIn>": "Nem vagy bejelentkezve. Kérlek jelentkez be újra.", "<ListError>": "Szerver hiba: Az adott mappa nem listázható."};
   
    return List[ErrorCode];
  }
}
