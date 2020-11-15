import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import {catchError, map, tap} from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

declare const gapi:any

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2:any;

  constructor(private http:HttpClient, private router:Router, private ngZone: NgZone) { 
  //llamado antes de ngOnInit()
    this.googleInit();
   }

   googleInit() {
    gapi.load('auth2', () => {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({
        client_id: '325818138019-s4vbbuug9qemvafotvgh3un9qp29imeo.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        // Request scopes in addition to 'profile' and 'email'
        //scope: 'additional_scope'
      });
      
    });
   }


   logout() {
     localStorage.removeItem('token');
     
     this.auth2.signOut().then(()=> {
       this.ngZone.run(()=>{
        this.router.navigateByUrl('/login');
       })
       
      });
   
   }


   validarToken():Observable<boolean> {
     const token = localStorage.getItem('token');

     /* Se manda el token alojado en el local storage al header del renew token
      del backend para que duevelva uno nuevo */

     return this.http.get(`${base_url}/login/renew`, {
       headers: {
         'x-token': token
       }
     })
     /* Reemplazar el token del local storage por el que duevelve renew token */
     .pipe(
       tap((resp:any) => {
        localStorage.setItem('token', resp.token)
       }),
        /*transformar la respuesta en un booleano para poder usarlo en
     el authGuard*/
     map( resp => true),
     /*Cuando no hay respuesta hay que retornar un false que le sirva al authGuard para
     navegar al login, para retornar un observable booleano*/
     catchError(error => of(false))
     
       )   
    
   }


   crearUsuario(formData: any) {
    //el primer argumento que recibe es el url y el segundo lo que se manda al body (el formulario)
    // el return es para poder subscribirse en el .ts de register, 
    //ya que post regresa un observable con lo que responde el backend
    return this.http.post(`${base_url}/usuarios`, formData )
                    .pipe(
                      tap( (resp:any) => {
                        localStorage.setItem('token', resp.token)
                      })
                      
                    );
    

  }

  login(formData: any) {
    return this.http.post(`${base_url}/login`, formData )
                    .pipe(
                      tap( (resp:any) => {
                        localStorage.setItem('token', resp.token)
                      })
                    );
  }

  loginGoogle(token) {
    return this.http.post(`${base_url}/login/google`, {token} )
                    .pipe(
                      tap( (resp:any) => {
                        localStorage.setItem('token', resp.token)
                      })
                    );
  }
}
