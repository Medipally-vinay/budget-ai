import { HttpClient,HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataUploadService {
private apiurl='http://192.168.1.52:5000/ask';
private apiurl2='http://192.168.1.52:5000/calculate';
  constructor(private http:HttpClient) { }
  uploadData(file: File, pageNumber: string, version: string):Observable<any>{
    const formData=new FormData();
    formData.append('file',file);
    formData.append('pages', pageNumber);
    formData.append('prompt_key',version);

    return this.http.post<any>(this.apiurl, formData);
  }
  budgetdata(tabledata:any,overhead:string,retention:string)
  {
    debugger
    const body:any = {}
    // const formData=new FormData();
    body["retention_percentage"] = retention
    body["overhead_percentage"] = overhead
    body["table_data"] = tabledata
    return this.http.post<any>(this.apiurl2,body);
  }
}
