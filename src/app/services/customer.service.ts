import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Customer } from '../models/customer';
import { Firestore, addDoc, collectionData,collection,doc,getDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private firestore:Firestore) { }
  addCustomer(customer:Customer){
    const customerRef=collection(this.firestore,'customers');
    return addDoc(customerRef,customer);
  }
  async validateUser(email:string){
    const q = query(collection(this.firestore, "customers"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.length==0;
  }
  async inicioDeSesion(email:string,psw:string){
    const q = query(collection(this.firestore, "customers"), where("email", "==",email ),where("password","==",psw));
    const querySnapshot = await getDocs(q);
    if(querySnapshot.docs.length!=0){
      localStorage.setItem("idCustomer",querySnapshot.docs[0].id);
      return true;
    }
    else{
      return false;
    }
  }
  async getCustomer():Promise<Observable<Customer>>{
    const docRef = doc(this.firestore, "customers", localStorage.getItem("idCustomer")?.toString()!);
    const docSnap = await getDoc(docRef);
    return docSnap.data() as Observable<Customer>
  }
}
