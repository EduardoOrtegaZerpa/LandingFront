import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, viewChild} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EditorModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent{

  createForm: FormGroup;
  @ViewChild('tinyMCE') tinyMCE: any;
  imageSelected: File | undefined;
  errorMessage: string | null = null;

  constructor (private fb: FormBuilder) {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      content: ['', Validators.required],
      image: ['', Validators.required],
      minutesToRead: ['', Validators.required]
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && this.isImageFile(file)) {
      this.imageSelected = file;
      this.errorMessage = null;
    } else {
      this.imageSelected = undefined;
      this.createForm.patchValue({ image: '' });
      this.errorMessage = 'Por favor, seleccione un archivo de imagen válido.';
    }
  }

  isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  getImageUrl(): string | undefined {
    if (this.imageSelected) {
        return URL.createObjectURL(this.imageSelected);
    }
    return undefined;
  }


  createPost() {
    const editorContent = this.tinyMCE.editor.getContent();
    console.log(editorContent);
  }





}
