import { Component } from '@angular/core';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css']
})
export class PruebaComponent {
  flujosDeCaja = [-160000, 153993.94, 147600.60, 140794.99, 133550.54,133550.53,124838.62,115564.94,105693.26,95185.03,83999.20,72092.07,59417.14,45924.89,31562.62,16274.23,0
  ];
  aproximacionInicial = 0.1;
  toleranciaError = 0.0001;
  tir: number;

  constructor() {
    this.tir = this.calcularTIR(this.flujosDeCaja, this.aproximacionInicial, this.toleranciaError);
    console.log(this.tir)
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
