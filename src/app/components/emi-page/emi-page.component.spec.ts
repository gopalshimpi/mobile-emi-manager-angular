import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmiPageComponent } from './emi-page.component';

describe('EmiPageComponent', () => {
  let component: EmiPageComponent;
  let fixture: ComponentFixture<EmiPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmiPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
