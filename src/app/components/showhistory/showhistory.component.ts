import { Component,EventEmitter,Input, Output} from '@angular/core';
import { Run } from 'src/app/models/run';
import { RunService } from 'src/app/services/run.service';

@Component({
  selector: 'app-showhistory',
  templateUrl: './showhistory.component.html',
  styleUrls: ['./showhistory.component.css']
})
export class ShowhistoryComponent {
  @Input() show!:boolean;
  @Output() cambio=new EventEmitter<number>()
  typeMoney!:string;
  priceProperty!:number;
  firstFee!:number;
  amountFinance!:number;
  nameRate!:string;
  rate!:number;
  nameConvertRate!:string;
  newRate!:number;
  frecuencyPay!:string;
  numberPeriods!:number;
  numberYear!:number;
  //corrida
  saldos_iniciales:number[]=[];
  tasa:number=0;
  cuota:number=0;
  intereses:number[]=[];
  amortizaciones:number[]=[];
  plazo_gracia=""
  simbolo=""
  supuesto:number[]=[];
  saldosfinales:number[]=[];
  interesfinales:number[]=[];
  amortizacionfinales:number[]=[];
  supuestofinal:number[]=[];
  nuevacuota!:number;
  gracePeriod!:string;
  numbergracePeriod!:number;
  cok!:number;
  van!:number;
  tir!:number;
  date!:Date;
  data!:Run;
  constructor(private runService:RunService){
    this.runService.getRun(localStorage.getItem("idRun")?.toString()!).then(
      (data:any)=>{
        this.data=data;
        console.log(this.data);
        this.typeMoney=data.typeMoney;
        this.priceProperty=data.priceProperty;
        this.firstFee=data.firstFee;
        this.amountFinance=data.amountFinance;
        this.rate=data.rate;
        this.nameRate=data.nameRate+data.timeRate;
        this.newRate=data.convertRate;
        this.nameConvertRate=data.nameConvertRate;
        this.frecuencyPay=data.frequencyPay;
        this.numberPeriods=data.numberPeriods;
        this.numberYear=data.numberYear;
        this.gracePeriod=data.gracePeriod;
        this.numbergracePeriod=data.numberGracePeriod;
        this.van=data.van;
        this.tir=data.tir;
        this.cok=data.cok;
        this.date=data.dateSave!;
        this.corrida()
      }
    )
    
  }
  regresarAtras(){
    this.cambio.emit(1)
  }
  faltantes(){
    if(this.frecuencyPay=="Mensual"){
      this.plazo_gracia='M'
    }
    else if(this.frecuencyPay=="Bimestral"){
      this.plazo_gracia='B'
    }
    else if(this.frecuencyPay=="Trimestral"){
      this.plazo_gracia='T'
    }
    else if(this.frecuencyPay=="Semestral"){
      this.plazo_gracia='S'
    }
    else if(this.frecuencyPay=="Anual"){
      this.plazo_gracia='A'
    }
    if(this.typeMoney=="Dólares"){
      this.simbolo="US$"
    }
    else if(this.typeMoney=="Soles"){
      this.simbolo="S/"
    }
  }
  seguirCorrida(){

  }
  corrida(){
    if(this.gracePeriod=="Ninguno"){
      this.numbergracePeriod=this.numberPeriods + 1;
    }
    this.supuesto=Array(this.numbergracePeriod).fill(0)
    this.faltantes()

    this.saldos_iniciales.push(this.amountFinance);
    this.tasa=Number(this.newRate)/100;
    this.cuota=Number((this.amountFinance*((this.tasa*(Math.pow(1+this.tasa,this.numberPeriods)))/((Math.pow(1+this.tasa,this.numberPeriods))-1))));
    let i:number;
    for(i=0;i<this.numbergracePeriod-1;i++){
      let interes=Number((this.saldos_iniciales[i]*this.tasa));
      let amortizaciones=Number((this.cuota-interes));
      this.intereses.push(interes);
      this.amortizaciones.push(amortizaciones);
      let saldo_final=Number((this.saldos_iniciales[i]-amortizaciones));
      this.saldos_iniciales.push(saldo_final);
    }
    if(this.gracePeriod=="Total"){
      this.intereses[this.numbergracePeriod-1]=this.saldos_iniciales[this.numbergracePeriod-1]*this.tasa;
      this.amortizaciones[this.numbergracePeriod - 1]= 0;
      this.saldos_iniciales[this.numbergracePeriod]= this.saldos_iniciales[this.numbergracePeriod - 1] + this.intereses[this.numbergracePeriod - 1]
      this.corridaContinua()
      }
    else if(this.gracePeriod=="Parcial"){
        this.intereses[this.numbergracePeriod-1]=this.saldos_iniciales[this.numbergracePeriod-1]*this.tasa;
        this.amortizaciones[this.numbergracePeriod - 1]= 0;
        this.saldos_iniciales[this.numbergracePeriod]= this.saldos_iniciales[this.numbergracePeriod - 1];
        this.corridaContinua()
    }

  }
  corridaContinua(){
    this.supuestofinal=Array(this.numberPeriods-this.numbergracePeriod).fill(0)
    this.saldosfinales.push(this.saldos_iniciales[this.numbergracePeriod]);
    this.tasa=Number(this.newRate)/100;
    this.nuevacuota=Number((this.saldosfinales[0]*((this.tasa*(Math.pow(1+this.tasa,this.numberPeriods-this.numbergracePeriod)))/((Math.pow(1+this.tasa,this.numberPeriods-this.numbergracePeriod))-1))));
    let i:number;
    for(i=0;i<this.numberPeriods-this.numbergracePeriod;i++){
      let interes=Number((this.saldosfinales[i]*this.tasa));
      let amortizaciones=Number((this.nuevacuota-interes));
      this.interesfinales.push(interes);
      this.amortizacionfinales.push(amortizaciones);
      let saldo_final=Number((this.saldosfinales[i]-amortizaciones));
      this.saldosfinales.push(saldo_final);
    }
  }
}
