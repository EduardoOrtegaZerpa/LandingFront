import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Project, ProjectResponse } from '../../../interfaces/interfaces';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditorComponent } from '../../editor/editor.component';
import { AdminService } from '../admin.service';
import { CommonModule } from '@angular/common';
import { AdminComponent } from '../admin.component';
import { lastValueFrom } from 'rxjs';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EditorComponent, AdminComponent, FormsModule],
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css', '../admin-child.css']
})
export class EditProjectComponent implements AfterViewInit{

  projects: ProjectResponse[] = [];
  selectedProject: ProjectResponse | undefined;
  createForm: FormGroup;
  @ViewChild(EditorComponent) editor!: EditorComponent;
  imageSelected: File | undefined;
  errorMessage: string | null = null;

  constructor (
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
      githubUrl: [{ value: '', disabled: true }, Validators.required],
    });
  }

  ngAfterViewInit(): void {
    setTimeout(async () => {
      await this.initProjects();
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

  onProjectSelected(event: Event) {
    const selectedProject = (event.target as HTMLSelectElement).value;
    this.selectedProject = this.projects.find((project) => project.title === selectedProject);

    if (this.selectedProject) {
      this.patchFormValues(this.selectedProject);
      this.enableForm();
    } else {
      this.createForm.reset();
      this.disableForm();
    }
  }

  async initProjects() {
    await this.getProjects();
    if (this.projects.length > 0) {
      this.selectedProject = this.projects[0];
      this.patchFormValues(this.selectedProject);
      this.enableForm();
    } else {
      this.disableForm();
    }
  }

  patchFormValues(project: ProjectResponse | Project) {
    this.createForm.patchValue({
      title: project.title,
      description: project.description,
      content: project.content,
      githubUrl: project.githubUrl
    });
    this.editor.writeValue(project.content);
  }

  enableForm() {
    this.createForm.controls['title'].enable();
    this.createForm.controls['description'].enable();
    this.createForm.controls['content'].enable();
    this.createForm.controls['image'].enable();
    this.createForm.controls['githubUrl'].enable();
    if (this.editor !== undefined) {
      this.editor.setDisabledState(false);
    }
  }

  disableForm() {
    this.createForm.controls['title'].disable();
    this.createForm.controls['description'].disable();
    this.createForm.controls['content'].disable();
    this.createForm.controls['image'].disable();
    this.createForm.controls['githubUrl'].disable();
    if (this.editor !== undefined) {
      this.editor.setDisabledState(true);
    }
  }

  onEditorContentChange(content: string): void {
    this.createForm.patchValue({ content });
  }

  async editProject() {

    const hasItChanged = this.compareChanges();

    if (!hasItChanged || this.selectedProject === undefined) {
      console.error('No changes detected');
      return;
    }

    const editorContent = this.editor.editorInstance?.getData();

    if (editorContent === undefined) {
      console.error('No content in editor');
      return;
    }

    const id = this.selectedProject.id;

    const project: Project = {
      title: this.createForm.value.title,
      description: this.createForm.value.description,
      content: editorContent,
      image: this.imageSelected ? this.imageSelected : undefined,
      githubUrl: this.createForm.value.githubUrl
    };

    this.adminService.editProject(project, id).subscribe(async (response) => {
      if (response) {
        this.restartValues();
        await this.initProjects();
      } else {
        console.error('Error creating post');
      }
    });
  }

  async deleteProject() {
    if (this.selectedProject) {
      this.adminService.deleteProject(this.selectedProject.id).subscribe(async (response) => {
        if (response) {
          this.restartAll();
          await this.initProjects();
        } else {
          console.error('Error deleting project');
        }
      });
    }
  }

  async getProjects(): Promise<void> {
    try {
      const response = await lastValueFrom(this.userService.getProjects());
      if (response) {
        this.projects = response;
      } else {
        console.error('Error getting posts');
      }
    } catch (error) {
      console.error('Error getting posts', error);
    }
  }

  restartValues() {
    this.imageSelected = undefined;
    this.errorMessage = null;
    this.selectedProject = undefined;
  }

  restartAll() {
    this.createForm.reset();
    this.createForm.patchValue({ newTag: '' });
    this.editor.writeValue('');
    this.restartValues();
  }

  compareChanges(): Boolean {

    if (this.selectedProject) {

      const project: Project = {
        title: this.createForm.value.title,
        description: this.createForm.value.description,
        content: this.createForm.value.content,
        githubUrl: this.createForm.value.githubUrl
      };

      if (project.title !== this.selectedProject.title ||
          project.description !== this.selectedProject.description ||
          project.content !== this.selectedProject.content ||
          this.imageSelected !== undefined || 
          project.githubUrl !== this.selectedProject.githubUrl) {
        return true;
      }

      return false;

    }

    return false;
  }


}

