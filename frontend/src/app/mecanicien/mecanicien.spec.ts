import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mecanicien } from './mecanicien';

describe('Mecanicien', () => {
  let component: Mecanicien;
  let fixture: ComponentFixture<Mecanicien>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mecanicien]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mecanicien);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
