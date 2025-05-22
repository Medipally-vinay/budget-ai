import { Routes } from '@angular/router';
import {FormComponentComponent} from "./form-component/form-component.component";
import { BudgetresultComponent } from './budgetresult/budgetresult.component';

export const routes: Routes = [
    { path : '',component : FormComponentComponent},
    {path:'budgetresult',component:BudgetresultComponent}
];
