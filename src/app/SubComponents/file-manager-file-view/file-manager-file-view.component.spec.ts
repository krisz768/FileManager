import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerFileViewComponent } from './file-manager-file-view.component';

describe('FileManagerFileViewComponent', () => {
  let component: FileManagerFileViewComponent;
  let fixture: ComponentFixture<FileManagerFileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileManagerFileViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileManagerFileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
