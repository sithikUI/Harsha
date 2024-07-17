import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemitterRequestComponent } from './remitter-request.component';

describe('RemitterRequestComponent', () => {
  let component: RemitterRequestComponent;
  let fixture: ComponentFixture<RemitterRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemitterRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemitterRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
