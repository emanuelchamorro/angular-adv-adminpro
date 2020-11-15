import { Component, OnDestroy } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnDestroy{

 public intervalSubs: Subscription;

  constructor() {
  
  /*  this.retornaObservable().subscribe(
      valor => console.log('subs:', valor),
      error => console.log('error', error),
      () => console.log('Obs completado')
    );
  */

this.intervalSubs = this.returnInterval().subscribe(console.log)

  }

  // si el metodo returnInterval() no tuviera el operator take y contara infinitamente, con
  //el unsubscribe puedo hacer que cuando cambio de pagina deje de contar (evitar fuga de memoria)
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

retornaObservable() {
  let i = 0
  
  const obs$ = new Observable<number>( observer => {

   
   const intervalo = setInterval(() => {
      i++;
      observer.next(i)

     if(i === 4) {
     //clearInterval es nativa de js
      clearInterval(intervalo);
      observer.complete();

     }

    }, 1000)
  });
  return obs$;
}

returnInterval() {

  return interval(500)
  .pipe(
      map(valor => valor + 1), // Empieza a contar desde 1 en vez de 0
     
      filter(valor => (valor % 2 === 0) ? true : false ),
       // se utiliza % 2 para saber si el numero es par (0) o impar (1), 
       //y se utiliza un condicional ternario para mostrarlo si da 0(par) y filtrarlo si da 1(impar)
      take(10) //para que en lugar de contar infinitamente pinte 10 numeros consecutivos 
  
       );
 
}


}
