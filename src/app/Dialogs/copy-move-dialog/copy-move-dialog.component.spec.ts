import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyMoveDialogComponent } from './copy-move-dialog.component';

describe('CopyMoveDialogComponent', () => {
  let component: CopyMoveDialogComponent;
  let fixture: ComponentFixture<CopyMoveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyMoveDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyMoveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
