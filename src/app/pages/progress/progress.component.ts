import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent{
 
progreso1:number = 25;
progreso2:number = 40;

get getProgreso1() {
  return `${this.progreso1}%`;
}
get getProgreso2() {
  return `${this.progreso2}%`;
}
//"valor" es el nombre del argumento del metodo, puede ser cualquier otro nombre
cambioValorHijo(valor: number) {
this.progreso1 = valor;
}
cambioValorHijo2(valor: number) {
  this.progreso2 = valor;
  }
}
