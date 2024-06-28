import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditorComponent } from '../../editor/editor.component';




@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EditorComponent],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent{

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
      minutesToRead: ['', Validators.required]
    });
  }

  // ngAfterViewInit(): void {
  //   setTimeout(() => {
  //     this.setInitialContent();
  //     this.changeDetectorRef.detectChanges();
  //   }, 0);
  // }

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

  // setInitialContent(): void {
  //   const initialContent = '<p>Contenido inicial</p>';
  //   this.createForm.patchValue({ content: initialContent });
  //   if (this.editor) {
  //     this.editor.writeValue(initialContent); // Actualiza el contenido del editor
  //   }
  // }

  isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  getImageUrl(): string | undefined {
    if (this.imageSelected) {
        return URL.createObjectURL(this.imageSelected);
    }
    return undefined;
  }

  onEditorContentChange(content: string): void {
    this.createForm.patchValue({ content });
  }


  createPost() {
    const editorContent = this.editor.editorInstance.getData();
    console.log(editorContent);
  }

}
