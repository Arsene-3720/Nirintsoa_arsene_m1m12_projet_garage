import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Postulation } from './postulation';

describe('Postulation', () => {
  let component: Postulation;
  let fixture: ComponentFixture<Postulation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Postulation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Postulation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
