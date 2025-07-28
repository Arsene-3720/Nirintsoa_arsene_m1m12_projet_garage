import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMecanicien } from './gestion-mecanicien';

describe('GestionMecanicien', () => {
  let component: GestionMecanicien;
  let fixture: ComponentFixture<GestionMecanicien>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionMecanicien]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionMecanicien);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
