import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StadiumMapComponent } from './stadium-map.component';

describe('StadiumMapComponent', () => {
  let component: StadiumMapComponent;
  let fixture: ComponentFixture<StadiumMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StadiumMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StadiumMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
