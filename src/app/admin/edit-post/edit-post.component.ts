import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditorComponent } from '../../editor/editor.component';
import { AdminComponent } from '../admin.component';
import { AdminService } from '../admin.service';
import { Post, PostResponse } from '../../../interfaces/interfaces';
import { lastValueFrom } from 'rxjs';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EditorComponent, AdminComponent, FormsModule],
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css', '../admin-child.css']
})
export class EditPostComponent implements AfterViewInit {

  posts: PostResponse[] = [];
  selectedPost: PostResponse | undefined;
  createForm: FormGroup;
  @ViewChild(EditorComponent) editor!: EditorComponent;
  imageSelected: File | undefined;
  errorMessage: string | null = null;
  tags: string[] = [];
  originalTags: string[] = [];

  constructor(
    private fb: FormBuilder, 
    private changeDetectorRef: ChangeDetectorRef, 
    private adminService: AdminService,
    private userService: UserService
  ) {
    this.createForm = this.fb.group({
      title: [{ value: '', disabled: true }, Validators.required],
      description: [{ value: '', disabled: true }, Validators.required],
      content: [{ value: '', disabled: true }, Validators.required],
      image: [{ value: '', disabled: true }],
      minutesToRead: [{ value: '', disabled: true }, Validators.required],
      newTag: ['']
    });
  }

  ngAfterViewInit(): void {
    setTimeout(async () => {
      await this.initPosts();
      this.changeDetectorRef.detectChanges();
    }, 0);
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

  onPostSelected(event: Event) {
    const selectedPost = (event.target as HTMLSelectElement).value;
    this.selectedPost = this.posts.find((post) => post.title === selectedPost);

    if (this.selectedPost) {
      this.patchFormValues(this.selectedPost);
      this.enableForm();
    } else {
      this.createForm.reset();
      this.disableForm();
    }
  }

  async initPosts() {
    await this.getPosts();
    if (this.posts.length > 0) {
      this.selectedPost = this.posts[0];
      this.patchFormValues(this.selectedPost);
      this.enableForm();
    } else {
      this.disableForm();
    }
  }

  patchFormValues(post: PostResponse | Post) {
    this.createForm.patchValue({
      title: post.title,
      description: post.description,
      content: post.content,
      minutesToRead: post.minutesToRead
    });
    this.editor.writeValue(post.content);
    this.tags = [...post.tags];  // Crear una copia de las etiquetas
    this.originalTags = [...post.tags];  // Guardar una copia de las etiquetas originales
  }

  addTag() {
    const newTag = this.createForm.value.newTag;
    if (newTag.trim() !== '') {
      if (!this.tags.includes(newTag) && !/\s/.test(newTag)) {
        this.tags.push(newTag);
      }
      this.createForm.patchValue({ newTag: '' });
    }
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

  enableForm() {
    this.createForm.controls['title'].enable();
    this.createForm.controls['description'].enable();
    this.createForm.controls['content'].enable();
    this.createForm.controls['image'].enable();
    this.createForm.controls['minutesToRead'].enable();
    this.createForm.controls['newTag'].enable();
    if (this.editor !== undefined) {
      this.editor.setDisabledState(false);
    }
  }

  disableForm() {
    this.createForm.controls['title'].disable();
    this.createForm.controls['description'].disable();
    this.createForm.controls['content'].disable();
    this.createForm.controls['image'].disable();
    this.createForm.controls['minutesToRead'].disable();
    this.createForm.controls['newTag'].disable();
    if (this.editor !== undefined) {
      this.editor.setDisabledState(true);
    }
  }

  onEditorContentChange(content: string): void {
    this.createForm.patchValue({ content });
  }

  editPost() {

    const hasItChanged = this.compareChanges();

    if (!hasItChanged || this.selectedPost === undefined) {
      console.error('No changes detected');
      return;
    }

    const editorContent = this.editor.editorInstance?.getData();

    if (editorContent === undefined) {
      console.error('No content in editor');
      return;
    }

    const id = this.selectedPost.id;
    const post: Post = {
      title: this.createForm.value.title,
      description: this.createForm.value.description,
      content: editorContent,
      image: this.imageSelected ? this.imageSelected : undefined,
      minutesToRead: this.createForm.value.minutesToRead,
      tags: this.tags || []
    };

    this.adminService.editPost(post, id).subscribe(async (response) => {
      if (response) {
        this.tags = [];
        this.originalTags = [];
        this.imageSelected = undefined;
        this.errorMessage = null;
        this.selectedPost = undefined;
        await this.initPosts();
      } else {
        console.error('Error creating post');
      }
    });
  }

  async getPosts(): Promise<void> {
    try {
      const response = await lastValueFrom(this.userService.getPosts());
      if (response) {
        this.posts = response;
        this.tags = this.posts.map((post) => post.tags).flat();
      } else {
        console.error('Error getting posts');
      }
    } catch (error) {
      console.error('Error getting posts', error);
    }
  }

  compareChanges(): Boolean {

    if (this.selectedPost) {
      const post: Post = {
        title: this.createForm.value.title,
        description: this.createForm.value.description,
        content: this.createForm.value.content,
        minutesToRead: this.createForm.value.minutesToRead,
        tags: this.tags
      };

      console.log('post', post);
      console.log('selectedPost', this.selectedPost);

      if (post.title !== this.selectedPost.title ||
          post.description !== this.selectedPost.description ||
          post.content !== this.selectedPost.content ||
          this.imageSelected !== undefined ||
          post.minutesToRead !== this.selectedPost.minutesToRead ||
          JSON.stringify(post.tags) !== JSON.stringify(this.originalTags)) {
        return true;
      }

      return false;

    }

    return false;
  }
}
