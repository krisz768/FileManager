import { NgModule } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './main/main.component';
import { LoadingScreenComponent } from './SubComponents/loading-screen/loading-screen.component';
import { LoginFormComponent } from './SubComponents/login-form/login-form.component';
import { FileManagerComponent } from './SubComponents/file-manager/file-manager.component';
import { FileManagerTreeViewComponent } from './SubComponents/file-manager-tree-view/file-manager-tree-view.component';
import { FileManagerListViewComponent } from './SubComponents/file-manager-list-view/file-manager-list-view.component';
import { FileManagerUrlViewComponent } from './SubComponents/file-manager-url-view/file-manager-url-view.component';
import { CopyMoveDialogComponent } from './Dialogs/copy-move-dialog/copy-move-dialog.component';

import { HttpClientModule } from '@angular/common/http';
import {ApiConnectionService} from './Services/api-connection.service';

import {SAVER, getSaver} from './Services/saver.provider';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBar} from '@angular/material/snack-bar';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatTreeModule} from '@angular/material/tree';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDividerModule} from '@angular/material/divider';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSortModule} from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';
import { LoginDialogComponent } from './Dialogs/login-dialog/login-dialog.component';
import { PregressDialogComponent } from './Dialogs/pregress-dialog/pregress-dialog.component';
import { ConfirmDialogComponent } from './Dialogs/confirm-dialog/confirm-dialog.component';
import { NameSelectComponent } from './Dialogs/name-select/name-select.component';
import { UploadFileDialogComponent } from './Dialogs/upload-file-dialog/upload-file-dialog.component';
import { UploadFileDirectiveDirective } from './Directives/upload-file-directive.directive';
import { FileManagerFileViewComponent } from './SubComponents/file-manager-file-view/file-manager-file-view.component';
import { SafePipe } from './safe.pipe';
import {ClipboardModule} from '@angular/cdk/clipboard';

import { ShareDialogComponent } from './Dialogs/share-dialog/share-dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoadingScreenComponent,
    LoginFormComponent,
    FileManagerComponent,
    FileManagerTreeViewComponent,
    FileManagerListViewComponent,
    FileManagerUrlViewComponent,
    CopyMoveDialogComponent,
    LoginDialogComponent,
    PregressDialogComponent,
    ConfirmDialogComponent,
    NameSelectComponent,
    UploadFileDialogComponent,
    UploadFileDirectiveDirective,
    FileManagerFileViewComponent,
    SafePipe,
    ShareDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    OverlayModule,
    FormsModule,
    MatProgressBarModule,
    MatIconModule,
    MatMenuModule,
    MatTreeModule,
    MatGridListModule,
    MatDividerModule,
    MatTableModule,
    MatCheckboxModule,
    MatSortModule,
    MatDialogModule,
    ClipboardModule
  ],
  providers: [ApiConnectionService,MatSnackBar, {provide: SAVER, useFactory: getSaver}],
  bootstrap: [AppComponent]
})
export class AppModule { }
