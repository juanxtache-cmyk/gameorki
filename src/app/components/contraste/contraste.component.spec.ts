import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContrasteComponent } from './contraste.component';

describe('ContrasteComponent', () => {
  let component: ContrasteComponent;
  let fixture: ComponentFixture<ContrasteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContrasteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContrasteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
