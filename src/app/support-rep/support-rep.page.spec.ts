import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportRepPage } from './support-rep.page';

describe('SupportRepPage', () => {
  let component: SupportRepPage;
  let fixture: ComponentFixture<SupportRepPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportRepPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportRepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
