import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { Customer } from 'src/app/models/customer';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})

export class StartComponent {
  register:FormGroup;
  login:FormGroup;
  msgError=false;
  loginErrorPsw=false;
  loginErrorEmail=false;
  msg_error!:string;
  repetido_email:boolean=false;
  constructor(private router:Router, private customerService:CustomerService,private fb:FormBuilder){
    this.register=this.fb.group({
      name:["",[Validators.required]],
      email:["",[Validators.required,Validators.email]],
      psw:["",[Validators.required]],
      date:["",[Validators.required]]
    }
    )
    this.login=this.fb.group(
      {
        email:["",[Validators.required]],
        psw:["",[Validators.required]]
      }
    )
  }
  cambiarSlide(){
    const container = document.getElementById('container');
    container?.classList.add("right-panel-active")
  }
  invertirSlide(){
    const container = document.getElementById('container');
    container?.classList.remove("right-panel-active")
  }

  async inicioSesion(){ 
    if(this.login.get('email')!.value!="" && this.login.get('psw')!.value!=""){
      if(!await this.customerService.validateUser(this.login.get('email')!.value)){
        if(await this.customerService.inicioDeSesion(this.login.get('email')!.value, this.login.get('psw')!.value)){
          this.router.navigate(["/dashboard/home"])
        }
        else{
          this.loginErrorPsw=true;
        }
      }
      else{
        this.loginErrorEmail=true;
      }
      
    }
  }
  imprimirFecha(){
    var hoy = new Date();
    var cumpleanos = new Date(this.register.get('date')!.value);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }
    return edad>=18
  }
  async registro(){
    const customer:Customer={
      name:this.register.get('name')!.value,
      email:this.register.get('email')!.value,
      password:this.register.get('psw')!.value,
      birthday:this.register.get('date')!.value
    }
    if(this.imprimirFecha()){
      if(await this.customerService.validateUser(customer.email)){
        this.addCustomer(customer)
      }
      else{
        this.msgError=true;
        this.msg_error="Ha ingresado un correo que ya estan en el sistema."
        this.register.reset();
      }
    }
    else{
      this.msgError=true;
          this.msg_error="Usted aún es menor de edad, no puede registrarse."
          this.register.reset();
    }
  }
  addCustomer(customer:Customer){
      this.customerService.addCustomer(customer).then(
        ()=>{
          this.register.reset();
          const container = document.getElementById('container');
          container?.classList.remove("right-panel-active")
        }
      )
    }
}
