import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerListViewComponent } from './file-manager-list-view.component';

describe('FileManagerListViewComponent', () => {
  let component: FileManagerListViewComponent;
  let fixture: ComponentFixture<FileManagerListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileManagerListViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileManagerListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
