import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerUrlViewComponent } from './file-manager-url-view.component';

describe('FileManagerUrlViewComponent', () => {
  let component: FileManagerUrlViewComponent;
  let fixture: ComponentFixture<FileManagerUrlViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileManagerUrlViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileManagerUrlViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
