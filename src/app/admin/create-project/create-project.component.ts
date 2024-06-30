import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditorComponent } from '../../editor/editor.component';
import { CommonModule } from '@angular/common';
import { AdminComponent } from '../admin.component';
import { Project } from '../../../interfaces/interfaces';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EditorComponent],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css', '../admin-child.css']
})
export class CreateProjectComponent {

  createForm: FormGroup;
  @ViewChild(EditorComponent) editor!: EditorComponent;
  imageSelected: File | undefined;
  errorMessage: string | null = null;

  constructor (private fb: FormBuilder, private changeDetectorRef: ChangeDetectorRef, private adminService: AdminService) {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      content: ['', Validators.required],
      image: ['', Validators.required],
      githubUrl: ['', Validators.required]
    });
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    if (AdminComponent.imageChecker(file)) {
      this.imageSelected = file;
      this.errorMessage = null;
    } else {
      this.imageSelected = undefined;
      this.createForm.patchValue({ image: '' });
      this.errorMessage = 'Please select an image file';
    } 
  }

  onEditorContentChange(content: string): void {
    this.createForm.patchValue({ content });
  }

  createProject() {
    const editorContent = this.editor.editorInstance?.getData();

    if (!editorContent) {
      this.errorMessage = 'Please enter some content';
      return;
    }

    if (this.imageSelected === undefined) {
      this.errorMessage = 'Please select an image file';
      return;
    }

    const project: Project = {
      title: this.createForm.value.title,
      description: this.createForm.value.description,
      content: editorContent,
      image: this.imageSelected,
      githubUrl: this.createForm.value.githubUrl
    };

    this.adminService.createProject(project).subscribe((response) => {
      if (!response) {
        console.error('Error creating project');
      }else{
        this.createForm.reset();
        this.imageSelected = undefined;
        this.errorMessage = null;
      }
    });
  }
}
