import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  ViewportScroller } from '@angular/common';
import { Run } from 'src/app/models/run';
import { RunService } from 'src/app/services/run.service';
import { Finance } from 'financejs';
import { number } from 'mathjs';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html',
  styleUrls: ['./engine.component.css']
})
export class EngineComponent {
  val_ini:FormGroup;
  moneda!:string;
  valor_inmueble!:number;
  cuota_inicial!:number;
  monto_financiar!:number;
  tipo_tasa!:string;
  tiempo_tasa!:string;
  valor_tasa!:number;
  cantidad_anios!:number;
  num_periodos!:number;
  aparicion_tiempo_cap=false;
  aparcion_tiem_plazo=false;
  tiempo_cap!:string;
  frecuencia_pago!:string;
  plazo!:string;
  tiempo_plazo!:number;
  realizar=true;
  anios_meses=0;
  frec_pago=0;
  dias_tasa=0;
  dias_conv=0;
  nueva_tasa=0;
  ape_tasa='-';
  saldo_iniciales:number[]=[];
  intereses:number[]=[];
  cuota=0;
  amortizaciones:number[]=[];
  iniciarCorrida=false;
  aviso=false;
  simbolo="";
  ncap=0;
  mcap=0;
  periodos_completos:number[]=[];
  supuesto:number[]=[];
  saldosfinales:number[]=[];
  interesfinales:number[]=[];
  amortizacionfinales:number[]=[];
  supuestofinal:number[]=[];
  nuevacuota!:number;
  tasa!:number;
  aproximacionInicial = 0.1;
  toleranciaError = 0.0001;
  tir!: number;
  cok!:number;
  van!:number;
  periodos:number[]=[];
  errorPeriodo=false;
  customerChoose!:Customer;
  constructor(private fb:FormBuilder,private viewPortScroller:ViewportScroller,private runService:RunService,private customerService:CustomerService){
    this.customerService.getCustomer().then((data:any)=>{
      this.customerChoose=data;
      this.customerChoose.id=localStorage.getItem("idCustomer")?.toString()!;
      console.log()
    });
    this.moneda="-";
    this.valor_inmueble=0;
    this.cuota_inicial=0;
    this.monto_financiar=0;
    this.tipo_tasa="-";
    this.tiempo_tasa="-";
    this.valor_tasa=0;
    this.cantidad_anios=0;
    this.num_periodos=0;
    this.tiempo_cap="-";
    this.frecuencia_pago="-";
    this.val_ini=this.fb.group({
      mon:["",[Validators.required]],
      inm:["",[Validators.required,Validators.min(0)]],
      cuo_i:["",[Validators.required,Validators.min(0),Validators.max(99)]],
      tip_t:["",[Validators.required]],
      tie_t:["",[Validators.required]],
      tie_c:["Diaria",[Validators.required]],
      frec_p:["",[Validators.required]],
      val_t:["",[Validators.required,Validators.min(0)]],
      tie_p:["",[Validators.required,Validators.min(1)]],
      plazo:["Ninguno",[Validators.required]],
      plazo_p:[""],
      cok:["",[Validators.required,Validators.min(0)]]
    }
    )
  }
  pasarDatos(){
    this.anios_meses=this.val_ini.get("tie_p")?.value*12;
    this.hallarPeriodos();
    if(this.num_periodos >this.val_ini.get("plazo_p")?.value){
    this.moneda=this.val_ini.get("mon")?.value;
    this.valor_inmueble=this.val_ini.get("inm")?.value;
    this.cuota_inicial=this.val_ini.get("cuo_i")?.value;
    this.monto_financiar=this.val_ini.get("inm")?.value-(this.val_ini.get("inm")?.value*(this.val_ini.get("cuo_i")?.value/100))
    this.tipo_tasa=this.val_ini.get("tip_t")?.value;
    this.tiempo_tasa=this.val_ini.get("tie_t")?.value;
    this.valor_tasa=this.val_ini.get("val_t")?.value;
    this.cantidad_anios=this.val_ini.get("tie_p")?.value;
    this.frecuencia_pago=this.val_ini.get("frec_p")?.value;
    if(this.aparicion_tiempo_cap){
      this.tiempo_cap=this.val_ini.get("tie_c")?.value;
    }
    this.plazo=this.val_ini.get("plazo")?.value
    if(this.aparcion_tiem_plazo){
      this.tiempo_plazo=this.val_ini.get("plazo_p")?.value;
    }
    this.cok=this.val_ini.get("cok")?.value;
    

    this.conversionTasa();
    
    this.realizar=false;
    } 
    else{
     this.errorPeriodo=true;
    }
  }
  validarAparicion(e:any){
    if(e=="TN"){   
      this.aparicion_tiempo_cap=true
      this.val_ini.get("tie_c")?.addValidators([Validators.required]);
    }
    else{
      this.aparicion_tiempo_cap=false;
      this.val_ini.get("tie_c")?.removeValidators([Validators.required]);
    }
  }
  validarAparicionPlazo(e:any){
    if(e=="Parcial" || e=="Total"){   
      this.aparcion_tiem_plazo=true
      this.val_ini.get("plazo_p")?.addValidators([Validators.required,Validators.min(1)]);
    }
    else{
      this.aparcion_tiem_plazo=false
      this.val_ini.get("plazo_p")?.removeValidators([Validators.required,Validators.min(1)]);
    }
  }
 
  hallarPeriodos(){
    if(this.val_ini.get("frec_p")?.value=='Mensual'){
      this.frec_pago=1;
    }
    else if(this.val_ini.get("frec_p")?.value=='Bimestral'){
      this.frec_pago=2;
    }
    else if(this.val_ini.get("frec_p")?.value=='Trimestral'){
      this.frec_pago=3;
    }
    else if(this.val_ini.get("frec_p")?.value=='Semestral'){
      this.frec_pago=6;
    }
    else if(this.val_ini.get("frec_p")?.value=='Anual'){
      this.frec_pago=12;
    }

    this.num_periodos=this.anios_meses/this.frec_pago;
  }
  conversionTasa(){
    if(this.frecuencia_pago=='Mensual'){
      this.dias_conv=30;
      this.ape_tasa='TEM'
      
    }
    else if(this.frecuencia_pago=='Bimestral'){
      this.dias_conv=60;
      this.ape_tasa='TEB'
     
    }
    else if(this.frecuencia_pago=='Trimestral'){
      this.dias_conv=90;
      this.ape_tasa='TET'
    
    }
    else if(this.frecuencia_pago=='Semestral'){
      this.dias_conv=180;
      this.ape_tasa='TES'
   
    }
    else if(this.frecuencia_pago=='Anual'){
      this.dias_conv=360;
      this.ape_tasa='TEA'
    
    }

    if(this.tiempo_tasa=='M'){
      this.dias_tasa=30;
    }
    else if(this.tiempo_tasa=='B'){
      this.dias_tasa=60;
    }
    else if(this.tiempo_tasa=='T'){
      this.dias_tasa=90;
    }
    else if(this.tiempo_tasa=='S'){
      this.dias_tasa=180;
    }
    else if(this.tiempo_tasa=='A'){
      this.dias_tasa=360;
    }

    if(this.tiempo_cap=='Diaria'){
      this.mcap=this.dias_tasa*1;
      this.ncap=this.dias_conv*1;
    }
    else if(this.tiempo_cap=='Mensual'){
      this.mcap=this.dias_tasa/30;
      this.ncap=this.dias_conv/30;
    }
    else if(this.tiempo_cap=='Bimestral'){
      this.mcap=this.dias_tasa/60;
      this.ncap=this.dias_conv/60;
    }
    else if(this.tiempo_cap=='Trimestral'){
      this.mcap=this.dias_tasa/90;
      this.ncap=this.dias_conv/90;
    }
    else if(this.tiempo_cap=='Semestral'){
      this.mcap=this.dias_tasa/180;
      this.ncap=this.dias_conv/180;
    }
    else if(this.tiempo_cap=='Anual'){
      this.mcap=this.dias_tasa/360;
      this.ncap=this.dias_conv/360;
    }
    if(this.tipo_tasa=='TE'){
      this.nueva_tasa=Number((((Math.pow(1+(this.valor_tasa/100),this.dias_conv/this.dias_tasa))-1)*100));
    }
    else if(this.tipo_tasa=='TN'){
      this.nueva_tasa=Number(((Math.pow(1+((this.valor_tasa/100)/this.mcap),this.ncap))-1))*100
           
    }
    
  }
  corrida(){
    if(this.plazo=="Ninguno"){
      this.tiempo_plazo=this.num_periodos + 1;
    }
    this.supuesto=Array(this.tiempo_plazo).fill(0)
    this.periodos_completos=Array(this.num_periodos).fill(0)
    if(this.moneda=='Dólares'){
      this.simbolo='US$'
    }
    else if(this.moneda=='Soles'){
      this.simbolo='S/'
    }
    this.iniciarCorrida=true;
    this.tasa=this.nueva_tasa/100;
    this.cuota=Number((this.monto_financiar*((this.tasa*(Math.pow(1+this.tasa,this.num_periodos)))/((Math.pow(1+this.tasa,this.num_periodos))-1))))
    this.saldo_iniciales.push(Number(this.monto_financiar));
    let i:number;
    
    for(i=0;i<this.tiempo_plazo - 1;i++){
     let interes=Number((this.saldo_iniciales[i]*this.tasa));
     let amortizaciones=Number((this.cuota-interes));
     this.intereses.push(interes);
     this.amortizaciones.push(amortizaciones);
     let saldo_final=Number((this.saldo_iniciales[i]-amortizaciones));
     this.saldo_iniciales.push(saldo_final);
      
    }
    if(this.plazo=="Total"){
    this.intereses[this.tiempo_plazo-1]=this.saldo_iniciales[this.tiempo_plazo-1]*this.tasa;
    this.amortizaciones[this.tiempo_plazo - 1]= 0;
    this.saldo_iniciales[this.tiempo_plazo]= this.saldo_iniciales[this.tiempo_plazo - 1] + this.intereses[this.tiempo_plazo - 1]
    this.corridaContinua()
    }
    else if(this.plazo=="Parcial"){
      this.intereses[this.tiempo_plazo-1]=this.saldo_iniciales[this.tiempo_plazo-1]*this.tasa;
      this.amortizaciones[this.tiempo_plazo - 1]= 0;
      this.saldo_iniciales[this.tiempo_plazo]= this.saldo_iniciales[this.tiempo_plazo - 1];
      this.corridaContinua()
    }
    else{
      let saldos=this.saldo_iniciales;
      saldos[saldos.length - 1]=0;
      this.calcularVan(saldos);
      this.tir=this.calcularTIR(saldos,this.aproximacionInicial, this.toleranciaError)
    
    }
  }
  corridaContinua(){
    this.supuestofinal=Array(this.num_periodos-this.tiempo_plazo).fill(0)
    this.saldosfinales.push(this.saldo_iniciales[this.tiempo_plazo]);
    let tasa=Number(this.nueva_tasa)/100;
    this.nuevacuota=Number((this.saldosfinales[0]*((tasa*(Math.pow(1+tasa,this.num_periodos-this.tiempo_plazo)))/((Math.pow(1+tasa,this.num_periodos-this.tiempo_plazo))-1))));
    let i:number;
    for(i=0;i<this.num_periodos-this.tiempo_plazo;i++){
      let interes=Number((this.saldosfinales[i]*tasa));
      let amortizaciones=Number((this.nuevacuota-interes));
      this.interesfinales.push(interes);
      this.amortizacionfinales.push(amortizaciones);
      let saldo_final=Number((this.saldosfinales[i]-amortizaciones));
      this.saldosfinales.push(saldo_final);
    }
    let saldosi=this.saldo_iniciales;
    let saldosf=this.saldosfinales;
    let saldos=saldosi.concat(saldosf);
    saldos.splice(this.tiempo_plazo-1,1);
    saldos[saldos.length - 1]=0;
    this.calcularVan(saldos);
    this.tir=this.calcularTIR(saldos,this.aproximacionInicial, this.toleranciaError);
    
  }
  reiniciar(){
    window.location.reload();
  }
  guardarCorrida(){
    if(this.plazo=="Ninguno"){
      this.tiempo_plazo=0;
    }
   
    const run:Run={
      typeMoney:this.moneda,
      priceProperty:this.valor_inmueble,
      firstFee:this.valor_inmueble*this.cuota_inicial/100,
      amountFinance:this.monto_financiar,
      nameRate:this.tipo_tasa,
      timeRate:this.tiempo_tasa,
      rate:this.valor_tasa,
      frequencyPay:this.frecuencia_pago,
      convertRate:this.nueva_tasa,
      nameConvertRate:this.ape_tasa,
      numberYear:Number(this.cantidad_anios),
      numberPeriods:this.num_periodos,
      gracePeriod:this.plazo,
      numberGracePeriod:this.tiempo_plazo,
      cok:this.cok,
      van:this.van,
      tir:this.tir,
      customer:this.customerChoose,
      dateSave:Date(),
    }
  
    this.runService.addRun(run).then(
      ()=>{
        this.aviso=true;
      }
    )
   
  } 
  calcularVan(flujosDeCaja: number[]){
    flujosDeCaja[0]=flujosDeCaja[0]*-1;
    let cok=this.cok/100;
    let suma_total=0;
    for(let i=0;i<flujosDeCaja.length;i++){
      suma_total+=flujosDeCaja[i] / Math.pow(1 + cok, i);
      console.log(flujosDeCaja[i] / Math.pow(1 + cok, i))
      console.log(suma_total);
    }
    this.van=suma_total;
  }
  calcularTIR(flujosDeCaja: number[], aproximacionInicial: number, toleranciaError: number): number {
    
    let tir = aproximacionInicial;
    let nuevoTir = aproximacionInicial + 1;
    let valorActualNeto: number;
    let derivadaValorActualNeto: number;
    let error = 1;

    while (error > toleranciaError) {
      valorActualNeto = 0;
      derivadaValorActualNeto = 0;

      for (let i = 0; i < flujosDeCaja.length; i++) {
        valorActualNeto += flujosDeCaja[i] / Math.pow(1 + tir, i);
        derivadaValorActualNeto -= (i * flujosDeCaja[i]) / Math.pow(1 + tir, i + 1);
      }

      nuevoTir = tir - (valorActualNeto / derivadaValorActualNeto);
      error = Math.abs((nuevoTir - tir) / nuevoTir);
      tir = nuevoTir;
    }

    return tir;
  }
}


