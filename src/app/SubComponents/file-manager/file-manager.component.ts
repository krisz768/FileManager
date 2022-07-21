import { Component, OnInit, Input , OnDestroy, ViewChild} from '@angular/core';
import { DirNode } from "../../DirDataModel";
import { LocationStrategy } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { ApiConnectionService } from 'src/app/Services/api-connection.service';
import { ResponseModel } from 'src/app/ResponseModel';
import { FileManagerListViewComponent } from '../file-manager-list-view/file-manager-list-view.component';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})
export class FileManagerComponent implements OnInit, OnDestroy {

  BackButtonPress: Subject<void> = new Subject<void>();

  DisableBackButton : boolean = false;

  private BackButtonDisableSubscription: Subscription = new Subscription();
  private BackButtonEnableSubscription: Subscription = new Subscription();

  constructor(private location: LocationStrategy, private apiConnectionService: ApiConnectionService) {
    this.location.onPopState((event) => {
      return this.OnBackButtonPressed();
    }); 
  }

  MobileView : boolean = false;

  @Input() StartingData : DirNode[] = [];

  ActualPath : {Path : string, IsFile : boolean} = {Path : "/", IsFile : false};
  PrevPeth : {Path : string, IsFile : boolean}[] = [];
  IsFile : boolean = false;

  @ViewChild(FileManagerListViewComponent, { static: false }) ListView!: FileManagerListViewComponent;

  ngOnInit(): void {
    window.onresize = () => {if (this.MobileView != window.innerWidth < 1000) {this.MobileView = window.innerWidth < 1000}};

    this.MobileView = window.innerWidth < 1000;

    this.BackButtonDisableSubscription = this.apiConnectionService.LockBackButton.subscribe(() => {this.DisableBackButton = true;});
    this.BackButtonEnableSubscription = this.apiConnectionService.UnlockBackButton.subscribe(() => {this.DisableBackButton = false;});
  }

  ngOnDestroy() {
    this.BackButtonDisableSubscription.unsubscribe();
    this.BackButtonEnableSubscription.unsubscribe();
  }

  OnBackButtonPressed() {
    if (!this.DisableBackButton) {
      if (this.ActualPath.IsFile) {
        let PrevPeth = this.PrevPeth.pop();
        this.ActualPath = {Path: PrevPeth!.Path, IsFile: PrevPeth!.IsFile};
      } else {
        this.BackButtonPress.next();
      }
    } else {
      history.pushState(null, '', window.location.href);
    }
  }

  SetNewStartData(StartData : ResponseModel) {
    if (!StartData.error) {
      this.StartingData = StartData.data;
    }
  }
}
