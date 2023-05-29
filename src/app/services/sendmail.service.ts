import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class SendmailService {

  resourcePath:string = environment.serverJSON+environment.resourceEmail;
  constructor(private http:HttpClient) { }
  sendMail(body:any){
    return this.http.post<any>(this.resourcePath,body)
  }
  validateCustomer(email:string,psw:string){
    return this.http.get<Customer>(this.resourcePath+"/email/"+email+"/password/"+psw);
   }
}
