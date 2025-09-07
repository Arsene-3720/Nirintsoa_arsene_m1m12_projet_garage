import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Creneaux } from './creneaux';

describe('Creneaux', () => {
  let component: Creneaux;
  let fixture: ComponentFixture<Creneaux>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Creneaux]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Creneaux);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
