import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../shared.service';
import { DataUploadService } from '../data-upload.service';
@Component({
  selector: 'app-budgetresult',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './budgetresult.component.html',
  styleUrl: './budgetresult.component.css'
})
export class BudgetresultComponent {
  constructor(private dataUploadService:DataUploadService,private sharedService:SharedService){

  }
  Retention:any='';
  Overhead:any="";
  data:any[]=[ 
      ]

//       data: any[] = [
//   {
//     "Visit Def Desc": "Screening Visit",
//     "Entitlement Name": "Consultation",
//     "Rate": 1500,
//     "Overhead Value": "10%",
//     "Final Rate": 1650,
//     "Retention %": "95%"
//   },
//   {
//     "Visit Def Desc": "Baseline Visit",
//     "Entitlement Name": "Blood Test",
//     "Rate": 800,
//     "Overhead Value": "8%",
//     "Final Rate": 864,
//     "Retention %": "90%"
//   },
//   {
//     "Visit Def Desc": "Week 4 Follow-up",
//     "Entitlement Name": "MRI Scan",
//     "Rate": 2500,
//     "Overhead Value": "12%",
//     "Final Rate": 2800,
//     "Retention %": "92%"
//   },
//   {
//     "Visit Def Desc": "Week 8 Assessment",
//     "Entitlement Name": "Physical Exam",
//     "Rate": 1000,
//     "Overhead Value": "7%",
//     "Final Rate": 1070,
//     "Retention %": "93%"
//   },
//   {
//     "Visit Def Desc": "End of Study Visit",
//     "Entitlement Name": "Final Review",
//     "Rate": 1200,
//     "Overhead Value": "9%",
//     "Final Rate": 1308,
//     "Retention %": "96%"
//   }
// ];

 tablesData: any[] = [
  
];

 selectedStudy!: string;
 selectedSite!: string;
  selectedPayee!: string;

  selectedIndex: number | null = null;
 
ngOnInit(){
  this.sharedService.data$.subscribe(value=>{
    this.tablesData=value;
   
  })
}


  onTableToggle(index: number) {
    this.selectedIndex = this.selectedIndex === index ? null : index;
  }

   onGenerateBudget() {
    if (this.selectedIndex === null) {
      alert('Please select a table.');
      return;
    }
    // if (!this.payeePricelistField?.value) {
    //   alert('Please select a Payee Pricelist.');
    //   return;
    // }
    const selectedTable = this.tablesData[this.selectedIndex].table;
    debugger
    console.log(selectedTable);
    this.dataUploadService.budgetdata(selectedTable,this.Overhead,this.Retention).subscribe({
        next: (response: any) => {
          console.log('generated budget data:', response);
          for(let i=0;i< response.updated_table.length;i++){
            response.updated_table[i]["cycle"] =Object.keys(response.updated_table[i])[0]
            response.updated_table[i]["cycleValue"] =Object.values(response.updated_table[i])[0]
            response.updated_table[i]["index"] =i
          }
           this.data=response.updated_table;
         debugger

         
        },
        error: (error: any) => {
          console.error('Failed to genereate budget data', error);
          alert('Failed to genereate budget data');
        }
      });
    // this.generateBudgetTableData(selectedTable);
  }

  generateBudgetTableData(table: any[]) {
    // Implement this function or emit an event to parent
    console.log('Generating budget for:', table);
   }


   showFeedbackModal = false;      // Set to true to show modal by default
  showThankYouModal = false;

  // Star rating logic
  starsArray = [1, 2, 3, 4, 5];
  selectedRating = 0;

  // Form fields
  accuracy: number | null = null;
  feedback: string = '';

  // Called when a star is clicked
  selectRating(rating: number): void {
    this.selectedRating = rating;
  }

  // Close the feedback modal
  closeModal(): void {
    this.showFeedbackModal = false;
  }

  // Submit feedback and show thank you modal
  submitFeedback(): void {
    // You can add validation here if needed
    // Example: if (!this.selectedRating || !this.accuracy) { return; }

    // Optionally send feedback to backend here
    // Example:
    // this.feedbackService.sendFeedback({
    //   rating: this.selectedRating,
    //   accuracy: this.accuracy,
    //   feedback: this.feedback
    // }).subscribe();

    this.showFeedbackModal = false;
    this.showThankYouModal = true;
  }

  // Close the thank you modal
  closeThankYouModal(): void {
    this.showThankYouModal = false;
  }
  openModel(){
    this.showFeedbackModal=true;
  }
}
