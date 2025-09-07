import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionService } from './gestion-service';

describe('GestionService', () => {
  let component: GestionService;
  let fixture: ComponentFixture<GestionService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
