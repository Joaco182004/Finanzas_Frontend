import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowhistoryComponent } from './showhistory.component';

describe('ShowhistoryComponent', () => {
  let component: ShowhistoryComponent;
  let fixture: ComponentFixture<ShowhistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowhistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
