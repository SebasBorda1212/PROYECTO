import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorUsuarios } from './gestor-usuarios';

describe('GestorUsuarios', () => {
  let component: GestorUsuarios;
  let fixture: ComponentFixture<GestorUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestorUsuarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestorUsuarios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
