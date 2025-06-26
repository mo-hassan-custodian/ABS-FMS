import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizedFileTransferComponent } from './authorized-file-transfer.component';

describe('AuthorizedFileTransferComponent', () => {
  let component: AuthorizedFileTransferComponent;
  let fixture: ComponentFixture<AuthorizedFileTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorizedFileTransferComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthorizedFileTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
