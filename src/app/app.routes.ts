import { Routes } from '@angular/router';
import {FormComponentComponent} from "./form-component/form-component.component";
import { BudgetresultComponent } from './budgetresult/budgetresult.component';
// import { LoginPageComponent } from './login-page/login-page.component';

export const routes: Routes = [
    // { path : '',component : LoginPageComponent},
    { path : '',component : FormComponentComponent},
    {path:'budgetresult',component:BudgetresultComponent}
];
