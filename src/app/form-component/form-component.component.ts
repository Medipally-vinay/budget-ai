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
  isExcel:boolean=false;
  selectedFileName: string = '';
  onFileSelected(event: any): void {
  const file: File = event.target.files[0];
  const input = event.target as HTMLInputElement;

  if (file) {
    const excelTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (file.type === 'application/pdf') {
      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.isExcel = false;
    } else if (excelTypes.includes(file.type)) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.isExcel = true; 
      this.pageNumber = '';
    } else {
      alert('Please upload a valid PDF or Excel file.');
      this.selectedFile = null;
      this.selectedFileName = '';
      this.isExcel = false; 
    }
    console.log("file name",this.selectedFileName);
  }
}


  onSubmit(): void {

    if (!this.selectedFile  || !this.version) {
      alert('Please fill in all required fields.');
      return;
    }
    this.loadinData  =true;
    
    const formData = new FormData();
    formData.append('pdfFile', this.selectedFile);
    formData.append('pageNumbers', this.pageNumber);
    formData.append('version', this.version);

   
     this.dataUploadService.uploadData(this.selectedFile, this.pageNumber, this.version)
      .subscribe({
        next: (response: any) => {
          this.loadinData=false;
          console.log('Upload successful:', response);
          this.sharedService.setData(response);
          this.sharedService.setStudy(this.studynum);
          this.sharedService.setfile(this.selectedFileName);
          
          this.router.navigate(['/budgetresult']);
        },
        error: (error: any) => {
          this.loadinData = false;
          console.error('Upload failed:', error);
          alert('Upload failed. Please try again.');
        }
      });
    this.sharedService.setfile(this.selectedFileName);
    // Navigate to result page
    // this.router.navigate(['/budgetresult']);
  }
}


