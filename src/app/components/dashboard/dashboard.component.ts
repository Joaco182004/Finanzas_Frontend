import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  cerrar=false
  constructor(private router:Router,private customerService:CustomerService){
    if(this.router.url=='/dashboard/home'){
      this.colorSelect1='rgb(47, 15, 55)'
      this.name1='home-sharp'
    }
    else if(this.router.url=='/dashboard/engine'){
      this.colorSelect2='rgb(47, 15, 55)'
      this.name2='calculator'
    }
    else if(this.router.url=='/dashboard/historial'){
      this.colorSelect3='rgb(47, 15, 55)'
      this.name3='cash'
    }
 
  }
  colorSelect1='rgb(173, 168, 174)'
  colorSelect2='rgb(173, 168, 174)'
  colorSelect3='rgb(173, 168, 174)'
  colorSelect4='rgb(173, 168, 174)'
  name1='home-outline'
  name2='calculator-outline'
  name3='cash-outline'
  name4='log-out-outline'
  colorSeleccion(n:number){
    this.name1='home-outline'
    this.name2='calculator-outline'
    this.name3='cash-outline'
    this.name4='log-out-outline'
    this.colorSelect1='rgb(173, 168, 174)'
    this.colorSelect2='rgb(173, 168, 174)'
    this.colorSelect3='rgb(173, 168, 174)'
    this.colorSelect4='rgb(173, 168, 174)'
    if(n==1){
      this.colorSelect1='rgb(47, 15, 55)'
      this.name1='home'
    }
    else if(n==2){
      this.colorSelect2='rgb(47, 15, 55)'
      this.name2='calculator'
    }
    else if(n==3){
      this.colorSelect3='rgb(47, 15, 55)'
      this.name3='cash'
    }
    else if(n==4){
      this.colorSelect4='rgb(47, 15, 55)'
      this.name4='log-out'
      this.cerrar=true
    }
  }
  cerrarSesion(){
    localStorage.clear();
    this.router.navigate(["/"])
  }
}
