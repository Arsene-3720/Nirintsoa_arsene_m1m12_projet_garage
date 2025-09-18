import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionRendezVous } from './gestion-rendez-vous';

describe('GestionRendezVous', () => {
  let component: GestionRendezVous;
  let fixture: ComponentFixture<GestionRendezVous>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionRendezVous]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionRendezVous);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
