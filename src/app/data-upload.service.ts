import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataUploadService {
  private baseUrl=environment.apiUrl;
  private baseUrl2='http://10.11.105.149:9091';

  constructor(private http:HttpClient) { }

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
  budgetdata(tabledata:any,overhead:string,retention:string,entitlementSetId:string)
  {

    const body:any = {}
    // const formData=new FormData();
    body["retention_percentage"] = retention
    
    body["overhead_percentage"] = overhead
    body["table_data"] = tabledata
    return this.http.post<any>(`${this.baseUrl2}/avisits${entitlementSetId}`,body);
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
