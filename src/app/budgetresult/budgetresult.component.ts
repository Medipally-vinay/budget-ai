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
  Overheadval:number=0;
  Entitlement:string="";
  data:any[]=[ 
      ]
//       data:any[]=[
//   {
//     "baiExtractedVisitName": "VD1",
//     "apecsVisitName": "V01",
//     "entitlementName": "001 - V01",
//     "Confidence": "99%",
//     "Final Visit Rate": "2,972.00",
//     "Retention": "0%",
//     "Visit Cost": "2972.00",
//     "Oldvalue":"1432",
//     "overhead": "0.00"
//   },
//   {
//     "baiExtractedVisitName": "TC1",
//     "apecsVisitName": "TC1",
//     "entitlementName": "001.2 - TC1",
//     "Confidence": "99%",
//     "Final Visit Rate": "3,154.00",
//     "Retention": "0%",
//      "Oldvalue":"1432",
//     "Visit Cost": "3154.00",
//     "overhead": "0.00"
//   },
//   {
//     "baiExtractedVisitName": "FD2",
//     "apecsVisitName": "F02",
//     "entitlementName": "002 - F02",
//     "Confidence": "98%",
//     "Final Visit Rate": "3,850.00",
//     "Retention": "1%",
//     "Visit Cost": "3850.00",
//     "overhead": "0.00"
//   },
//   {
//     "baiExtractedVisitName": "SD3",
//     "apecsVisitName": "S03",
//     "entitlementName": "003 - S03",
//     "Confidence": "97%",
//     "Final Visit Rate": "4,200.00",
//     "Retention": "2%",
//     "Visit Cost": "4200.00",
//     "overhead": "0.00"
//   },
//   {
//     "baiExtractedVisitName": "MD4",
//     "apecsVisitName": "M04",
//     "entitlementName": "004 - M04",
//     "Confidence": "99%",
//     "Final Visit Rate": "2,500.00",
//     "Retention": "0%",
//      "Oldvalue":"1432",
//     "Visit Cost": "2500.00",
//     "overhead": "0.00"
//   }
// ]


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
  response:any=0;
ngOnInit(){
  this.sharedService.data$.subscribe(value=>{
    // this.audit=value.find((obj: any)=>Object.keys(obj).length==1 && obj.hasOwnProperty("id"));
   this.response = value.find(
  (obj: any) => Object.keys(obj).length === 1 && obj.hasOwnProperty("response_time")
)?.response_time;

    this.tablesData=value;
    console.log(this.tablesData);
      this.calculateTotalVisitCosts();
   
  })
  this.sharedService.study$.subscribe(value=>{
    this.studynum=value;
  })

}

resetRetention(index:number)
{
  this.data[index]["Final Visit Rate"]=this.data[index].Oldvalue;
}
  // Function to remove currency symbols and parse number
  parseCost(costStr: string): number {
    return parseFloat(costStr.replace(/[€,]/g, '').replace(/\s/g, ''));
  }

  // Add total_visit_cost (as number) to each object
  calculateTotalVisitCosts(): void {
   
    this.tablesData.forEach(item => {
      if (Array.isArray(item.table)) {
        const total = item.table.reduce((sum:number, row:any) => {
          const cost = this.parseCost(row['VISIT COST']);
          return sum + (isNaN(cost) ? 0 : cost);
        }, 0);
        console.log("total sum",total);
        item.total_visit_cost = total.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
      }
    });
  }
  onTableToggle(index: number,Overhead:number) {
    this.selectedIndex = this.selectedIndex === index ? null : index;
    this.Overheadval=this.Overhead;
  }

   onGenerateBudget() {
    if (this.selectedIndex === null) {
      alert('Please select a table.');
      return;
    }
    
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
