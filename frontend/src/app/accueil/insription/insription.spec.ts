import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Insription } from './insription';

describe('Insription', () => {
  let component: Insription;
  let fixture: ComponentFixture<Insription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Insription]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Insription);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
