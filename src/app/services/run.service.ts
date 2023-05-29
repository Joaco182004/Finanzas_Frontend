import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Run } from '../models/run';
import { Firestore, addDoc, collectionData,collection,doc,getDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RunService {
  runs:Run[]=[];
  constructor(private firestore:Firestore) { }
  addRun(run:Run){
    const runRef=collection(this.firestore,'runs');
    return addDoc(runRef,run);
  }
  getRuns():Observable<Run[]>{
    const runRef=collection(this.firestore,'runs');
    return collectionData(runRef,{idField:'id'},) as Observable<Run[]>;
  }
  async getRun(id:string):Promise<Observable<Run>>{
    const runRef = doc(this.firestore, "runs", id);
    const docSnap = await getDoc(runRef);
    return docSnap.data() as Observable<Run>
  }
}
