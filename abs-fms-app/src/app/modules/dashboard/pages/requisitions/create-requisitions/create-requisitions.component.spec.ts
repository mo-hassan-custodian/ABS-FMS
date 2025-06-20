import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRequisitionsComponent } from './create-requisitions.component';

describe('CreateRequisitionsComponent', () => {
  let component: CreateRequisitionsComponent;
  let fixture: ComponentFixture<CreateRequisitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRequisitionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateRequisitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
