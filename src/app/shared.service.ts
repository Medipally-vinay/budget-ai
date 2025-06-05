import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }
  private datasubject=new BehaviorSubject<any>('');
  data$=this.datasubject.asObservable();
  setData(data:any)
  {
    this.datasubject.next(data);
  }
  private studynum=new BehaviorSubject<any>('');
  study$=this.studynum.asObservable();
  setStudy(data:any)
  {
    this.studynum.next(data);
  }
}
