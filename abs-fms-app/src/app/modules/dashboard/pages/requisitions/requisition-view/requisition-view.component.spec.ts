import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionViewComponent } from './requisition-view.component';

describe('RequisitionViewComponent', () => {
  let component: RequisitionViewComponent;
  let fixture: ComponentFixture<RequisitionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequisitionViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequisitionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
