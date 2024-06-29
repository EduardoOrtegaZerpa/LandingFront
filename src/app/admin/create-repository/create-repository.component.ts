import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditorComponent } from '../../editor/editor.component';
import { CommonModule } from '@angular/common';
import { AdminComponent } from '../admin.component';

@Component({
  selector: 'app-create-repository',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EditorComponent],
  templateUrl: './create-repository.component.html',
  styleUrl: './create-repository.component.css'
})
export class CreateRepositoryComponent {

  createForm: FormGroup;
  @ViewChild(EditorComponent) editor!: EditorComponent;
  imageSelected: File | undefined;
  errorMessage: string | null = null;

  constructor (private fb: FormBuilder, private changeDetectorRef: ChangeDetectorRef) {
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

  createRepo() {
    const editorContent = this.editor.editorInstance.getData();
    console.log(editorContent);
  }
}
