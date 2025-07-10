import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataUploadService {
  private baseUrl=environment.apiUrl;
  // private baseUrl2='http://10.11.105.149:8081';
    private baseUrl2='http://10.11.105.149:8081/contractextraction';

page: number = -1;
  constructor(private http:HttpClient) { }
//   filters(visitname?:string,entname?:string):Observable<any>{
//     this.page=0;
//     let params= new HttpParams().set('page', this.page.toString());
//     if (!visitname && !entname) {
//   console.log('No filters entered, skipping API call.');
//   return new Observable<any>((observer) => {
//     observer.complete();
//   });
// }
//     if(visitname)
//     {
//       params=params.set('apecsVisitName',visitname);
//     }
//     if(entname)
//     {
//       params=params.set('entitlementName',entname);
//     }
//     return this.http.get<any>(`${this.baseUrl2}/api/filteredData`,{params})
//   }

  getstudydropdown():Observable<any>{
     return this.http.get<any>(`${this.baseUrl2}/api/study`);
  }

  getsitedropdown(study: string): Observable<any> {
  const params = new HttpParams().set('studyId', study);
  return this.http.get<any>(`${this.baseUrl2}/api/site`, { params });
}

  getpayeedropdown(site:string):Observable<any>
  { const params=new HttpParams().set('siteId',site);
    return this.http.get<any>(`${this.baseUrl2}/api/payee/`,{params});
  }
   getscheduledropdown(payee:string):Observable<any>
  {
    return this.http.get<any>(`${this.baseUrl2}/api/schedule/${payee}`);
  }
    getpricelistdropdown(schedule:string):Observable<any>
  {
    return this.http.get<any>(`${this.baseUrl2}/api/pricelist/${schedule}`);
  }
     getentitlementsetdropdown(pricelist:string):Observable<any>
  {
    return this.http.get<any>(`${this.baseUrl2}/api/entitlementset/${pricelist}`);
  }
  uploadData(file: File, pageNumber: string, version: string):Observable<any>{
    const formData=new FormData();
    formData.append('file',file);
    formData.append('pages', pageNumber);
    formData.append('prompt_key',version);

    return this.http.post<any>(`${this.baseUrl}/ask`, formData);
  }
  budgetdata(tabledata:any,overhead:string,retention:string,entitlementSetId:string,visitname?:string,entname?:string,page?:number)
  {
     let params= new HttpParams()
    const body:any = {}
     if(page !== undefined && page >= 0){
      this.page=page;
          params=params.set('page', this.page.toString());
      }
  
//     if (!visitname && !entname) {
//   console.log('No filters entered, skipping API call.');
//   return new Observable<any>((observer) => {
//     observer.complete();
//   });
// }
    if(visitname)
    {
      params=params.set('apecsVisitName',visitname);
    }
    if(entname)
    {
      params=params.set('entitlementName',entname);
    }
    // const formData=new FormData();
    body["retention_percentage"] = retention
    
    body["overhead_percentage"] = overhead
    body["table_data"] = tabledata
    return this.http.post<any>(`${this.baseUrl2}/api/avisits/${entitlementSetId}`,body,{params});
  }


  audit(data:string,rating:string,percentage:string,studyId:any,comments:string,auditId:number)
  {
    const body:any={}
   
  body["finalisedData"] = data
  body["rating"]=rating
  body["accuracyPercentage"] = percentage
  body["studyId"]=studyId
  body["comments"]=comments
  body["auditId"]=auditId
  return this.http.post<any>(`${this.baseUrl}/audit`,body);
  }
}
