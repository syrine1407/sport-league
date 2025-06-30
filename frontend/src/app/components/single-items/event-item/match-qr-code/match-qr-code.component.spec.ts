import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchQrCodeComponent } from './match-qr-code.component';

describe('MatchQrCodeComponent', () => {
  let component: MatchQrCodeComponent;
  let fixture: ComponentFixture<MatchQrCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchQrCodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatchQrCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
