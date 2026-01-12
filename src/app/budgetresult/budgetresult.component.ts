import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../shared.service';
import { DataUploadService } from '../data-upload.service';
import { audit } from 'rxjs';
import { response } from 'express';
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
  Entitlement:string="";
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

 tablesData: any[] = [];

 selectedStudy!: string;
 selectedSite!: string;
  selectedPayee!: string;
  studynum:any='';
  selectedIndex: number | null = null;
  audit:any=0;
ngOnInit(){
  this.sharedService.data$.subscribe(value=>{
    // Extract data from response if it's wrapped in 'data' property
    const dataArray = value?.data || value;
    
    // Find audit object
    this.audit = Array.isArray(dataArray) 
      ? dataArray.find((obj: any) => Object.keys(obj).length == 1 && obj.hasOwnProperty("id"))
      : null;

    // Set tablesData, excluding audit object and normalize table* to table
    this.tablesData = Array.isArray(dataArray)
      ? dataArray
          .filter((obj: any) => !(Object.keys(obj).length == 1 && obj.hasOwnProperty("id")))
          .map((obj: any) => {
            // Normalize table* property to table
            if (obj.hasOwnProperty('table*')) {
              obj.table = obj['table*'];
              delete obj['table*'];
            }
            return obj;
          })
      : [];
    
    console.log('Processed tablesData:', this.tablesData);
    this.calculateTotalVisitCosts();
   
  })
  this.sharedService.study$.subscribe(value=>{
    this.studynum=value;
  })

}
  // Function to remove currency symbols and parse number
  parseCost(costStr: string): number {
    if (!costStr) return 0;
    return parseFloat(costStr.replace(/[€,]/g, '').replace(/\s/g, ''));
  }

  // Add total_visit_cost (as number) to each object
  calculateTotalVisitCosts(): void {
   
    this.tablesData.forEach(item => {
      if (Array.isArray(item.table)) {
        const total = item.table.reduce((sum:number, row:any) => {
          // Use VISIT_COST (with underscore) as per API response
          const costStr = row['VISIT_COST'] || row['VISIT COST'] || '';
          const cost = this.parseCost(costStr);
          return sum + (isNaN(cost) ? 0 : cost);
        }, 0);
        console.log("total sum",total);
        item.total_visit_cost = total.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
      }
    });
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
    

         
        },
        error: (error: any) => {
          console.error('Failed to genereate budget data', error);
          alert('Failed to genereate budget data');
        }
      });
    // this.generateBudgetTableData(selectedTable);
  }
  onok(){
    this.dataUploadService.audit(
      
      JSON.stringify(this.data),
      JSON.stringify(this.selectedRating),
      JSON.stringify(this.accuracy),
      JSON.stringify(this.studynum),
      // String(this.selectedRating),
      // String(this.accuracy),
      this.feedback,
      this.audit.id
    ).subscribe({
      next:(response:any)=>
      {
        console.log(response);
      },
      error:(error:any)=>
      {
        console.error('failed to upload total data',error);
      }
    })
  }
   editingCell: { row: number; column: string } | null = null;

editCell(rowIndex: number, column: string) {
  this.editingCell = { row: rowIndex, column };
}

isEditing(rowIndex: number, column: string): boolean {
  return this.editingCell?.row === rowIndex && this.editingCell?.column === column;
}

stopEditing() {
  this.editingCell = null;
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
//   onNumberInput(event: any): void {
//   const value = event.target.value;
//   if (value < 0) {
//     event.target.value = '';
//     this.Retention = null;
//   }
// }
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
    this.onok();
  }

  // Close the thank you modal
  closeThankYouModal(): void {
    this.showThankYouModal = false;
  }
  openModel(){
    this.showFeedbackModal=true;
  }
}
