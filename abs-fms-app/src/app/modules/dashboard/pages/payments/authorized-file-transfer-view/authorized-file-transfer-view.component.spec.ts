import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizedFileTransferViewComponent } from './authorized-file-transfer-view.component';

describe('AuthorizedFileTransferViewComponent', () => {
  let component: AuthorizedFileTransferViewComponent;
  let fixture: ComponentFixture<AuthorizedFileTransferViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorizedFileTransferViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthorizedFileTransferViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
