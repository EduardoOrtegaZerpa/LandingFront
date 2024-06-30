import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditorComponent } from '../../editor/editor.component';
import { AdminComponent } from '../admin.component';
import { AdminService } from '../admin.service';
import { Post } from '../../../interfaces/interfaces';



@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EditorComponent, AdminComponent],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css', '../admin-child.css'] 
})
export class CreatePostComponent{

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
      minutesToRead: ['', Validators.required]
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

  createPost() {
    const editorContent = this.editor.editorInstance?.getData();

    if (!editorContent) {
      this.errorMessage = 'Please enter some content';
      return;
    }

    if (this.imageSelected === undefined) {
      this.errorMessage = 'Please select an image file';
      return;
    }

    const post: Post = {
      title: this.createForm.value.title,
      description: this.createForm.value.description,
      content: editorContent,
      image: this.imageSelected,
      minutesToRead: this.createForm.value.minutesToRead,
      tags: []
    };

    this.adminService.createPost(post).subscribe((response) => {
      if (!response) {
        console.error('Error creating post');
      }else{
        this.createForm.reset();
        this.imageSelected = undefined;
        this.errorMessage = null;
      }
    });
  }

}
