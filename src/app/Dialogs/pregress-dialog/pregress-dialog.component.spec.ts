import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PregressDialogComponent } from './pregress-dialog.component';

describe('PregressDialogComponent', () => {
  let component: PregressDialogComponent;
  let fixture: ComponentFixture<PregressDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PregressDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PregressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
