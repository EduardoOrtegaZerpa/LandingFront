import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTrajectoryComponent } from './edit-trajectory.component';

describe('EditTrajectoryComponent', () => {
  let component: EditTrajectoryComponent;
  let fixture: ComponentFixture<EditTrajectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTrajectoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditTrajectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
