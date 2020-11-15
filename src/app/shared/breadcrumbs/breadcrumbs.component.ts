import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnDestroy {

  public titulo: string;
  public tituloSubs$: Subscription;

constructor(private router:Router) { 
 // igualo el metodo de subscripcion a la propiedad public de tipo Subscription para poder
 // desinscribirme en el caso de que se cierre sesión

  this.tituloSubs$ = this.getRouterArguments().subscribe(data => {
    console.log(data);
    this.titulo = data.titulo; // almaceno el titulo en en la propiedad publica "titulo"
    document.title = `AdminPro - ${data.titulo}`; // este es para que se muestre el titulo de pagina en la pestaña
  
  });
  }
 
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

getRouterArguments() {
  //filtrar la info de los routes para quedarme con el titulo puesto en el routing como data
  return this.router.events
  .pipe(
    filter(event => event instanceof ActivationEnd),
    filter((event:ActivationEnd) => event.snapshot.firstChild === null),
    map((event:ActivationEnd) => event.snapshot.data)
  )
 
}

}
