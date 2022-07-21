import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileDialogComponent } from './upload-file-dialog.component';

describe('UploadFileDialogComponent', () => {
  let component: UploadFileDialogComponent;
  let fixture: ComponentFixture<UploadFileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadFileDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
