import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';
import { Usuario } from '../models/usuario.model';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http:HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
  
get headers() {
  return {
    headers: {
      'x-token': this.token
    }
  }

}


private transformarEnUsuarios(resultados:any[]):Usuario[] {
  return resultados.map(
    user => new Usuario(user.google, user.nombre, user.email, user.img, '')
  )
  }

private transformarEnHospitales(resultados:any[]):Hospital[] {
   //No hace falta instanciar el hospital porque la imagen ya la muestro con un pipe
    return resultados;
    }
  

buscar(tipo: 'usuarios'|'medicos'|'hospitales', termino:string ) {

  const url= `${base_url}/todo/coleccion/${tipo}/${termino}`;
  return this.http.get<any[]>(url,this.headers)
         .pipe(
           map((resp:any) =>{

            switch (tipo) {
              case 'usuarios':
              return this.transformarEnUsuarios(resp.resultados);
            
              case 'hospitales':
              return this.transformarEnHospitales(resp.resultados)

              default:
                return [];

            }

            
           }))

  }
}

