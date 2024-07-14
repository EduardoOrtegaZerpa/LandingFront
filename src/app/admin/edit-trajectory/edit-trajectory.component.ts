import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditorComponent } from '../../editor/editor.component';
import { AdminComponent } from '../admin.component';
import { AdminService } from '../admin.service';
import { UserService } from '../../user.service';
import { Trajectory, TrajectoryResponse } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-edit-trajectory',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EditorComponent, AdminComponent, FormsModule],
  templateUrl: './edit-trajectory.component.html',
  styleUrls: ['./edit-trajectory.component.css', '../admin-child.css']
})
export class EditTrajectoryComponent implements AfterViewInit{

  trajectory: TrajectoryResponse | undefined;
  editForm: FormGroup;
  @ViewChild(EditorComponent) editor!: EditorComponent;

  constructor (
    private fb: FormBuilder, 
    private changeDetectorRef: ChangeDetectorRef, 
    private adminService: AdminService, 
    private userService: UserService
  ) {
    this.editForm = this.fb.group({
      content: [{ value: '', disabled: true }, Validators.required]
    });
  }

  ngAfterViewInit(): void {
    setTimeout(async () => {
      await this.getTrajectory();
      this.changeDetectorRef.detectChanges();
    }, 0);
  }

  getTrajectory() {
    this.userService.getTrajectory().subscribe({
      next: (response: TrajectoryResponse | undefined) => {
        if (response) {
          this.trajectory = response;
          this.patchFormValues();
          this.enableForm();
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  patchFormValues() {
    this.editForm.patchValue({
      content: this.trajectory?.content 
    });
    this.editor.writeValue(this.trajectory?.content || '');
  }

  enableForm() {
    this.editForm.controls['content'].enable();
    if (this.editor != undefined) {
      this.editor.setDisabledState(false);
    }
  }

  disableForm() {
    this.editForm.controls['content'].disable();
    if (this.editor != undefined) {
      this.editor.setDisabledState(true);
    }
  }

  onEditorContentChange(content: string) {
    this.editForm.patchValue({ content });
  }

  editTrajectory() {
    if (this.trajectory) {
      const trajectory: Trajectory = {
        content: this.editForm.value.content
      };
      this.adminService.editTrajectory(trajectory, this.trajectory.id).subscribe({
        next: (response: TrajectoryResponse | undefined) => {
          if (response) {
            console.log('Trajectory edited:', response);
            this.trajectory = response;
            this.patchFormValues();
            this.disableForm();
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }

  compareChanges(): Boolean {
    
    if (this.trajectory) {

      const trajectory: Trajectory = {
        content: this.editForm.value.content
      };

      if (this.trajectory.content !== trajectory.content) {
        return true;
      } else {
        return false;
      }
    }
      return false;
  }

}
