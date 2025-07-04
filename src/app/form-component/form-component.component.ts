import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataUploadService } from '../data-upload.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-form-component',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './form-component.component.html',
  styleUrl: './form-component.component.css'
})
export class FormComponentComponent {

  selectedFile: File | null = null;
  pageNumber: string = '';
  version: string = '';
  loadinData :boolean = false;
  studynum:any='';
  constructor(private router: Router,private dataUploadService: DataUploadService,private sharedService:SharedService) {}
  

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      alert('Please upload a valid PDF file.');
      this.selectedFile = null;
    }
  }

  onSubmit(): void {

    if (!this.selectedFile || !this.pageNumber || !this.version) {
      alert('Please fill in all required fields.');
      return;
    }
    this.loadinData  =true;
    // You can send this data to your backend API here, 
    const formData = new FormData();
    formData.append('pdfFile', this.selectedFile);
    formData.append('pageNumbers', this.pageNumber);
    formData.append('version', this.version);

    //For now, simulate extraction and navigate
     this.dataUploadService.uploadData(this.selectedFile, this.pageNumber, this.version)
      .subscribe({
        next: (response: any) => {
          this.loadinData=false;
          console.log('Upload successful:', response);
          this.sharedService.setData(response);
          this.sharedService.setStudy(this.studynum);
          
          this.router.navigate(['/budgetresult']);
        },
        error: (error: any) => {
          this.loadinData = false;
          console.error('Upload failed:', error);
          alert('Upload failed. Please try again.');
        }
      });

    // Navigate to result page
    this.router.navigate(['/budgetresult']);
  }
}


