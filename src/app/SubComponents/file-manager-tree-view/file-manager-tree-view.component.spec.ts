import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerTreeViewComponent } from './file-manager-tree-view.component';

describe('FileManagerTreeViewComponent', () => {
  let component: FileManagerTreeViewComponent;
  let fixture: ComponentFixture<FileManagerTreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileManagerTreeViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileManagerTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
