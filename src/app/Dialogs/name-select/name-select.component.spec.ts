import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameSelectComponent } from './name-select.component';

describe('NameSelectComponent', () => {
  let component: NameSelectComponent;
  let fixture: ComponentFixture<NameSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NameSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NameSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
