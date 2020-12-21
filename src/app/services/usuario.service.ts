import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import {catchError, map, tap} from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import Swal from 'sweetalert2';

declare const gapi:any

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2:any;
  public usuario:Usuario;

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
      map((resp:any) => {
       
       
        const { email, google, nombre, password, role, _id, img=''} = resp.usuario;
        
        // Crear nueava instancia del usuario

        this.usuario = new Usuario(google, nombre, email, img, '', role, _id);
           
        localStorage.setItem('token', resp.token);
       
        return  true;
       }),
        /*transformar la respuesta en un booleano para poder usarlo en
     el authGuard*/
     
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

actualizarUsuario(data: {nombre:string, email:string, role:string}) {

  const token = localStorage.getItem('token');

  return this.http.put(`${base_url}/usuarios/${this.usuario._id}`, data, {
       headers: {
         'x-token': token
       }
     });
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


 cargarUsuarios(desde:number=0) {
  
  const token = localStorage.getItem('token');
  const url= `${base_url}/usuarios?desde=${desde}`;

  return this.http.get<any>(url, {
    headers: {
      'x-token': token
    }

  })
  //Para obtener avatar de cada usuario del arreglo de usuarios
  .pipe(
    map(resp=>{
      const usuarios= resp.usuarios.map(
        user => new Usuario(user.google, user.nombre, user.email, user.img, '', user.role, user._id)
      );

      return {
        total: resp.total,
        usuarios
      };
    })
  )
  
  ;
 }

//getters para no repetir codigo en cada metodo
 
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


eliminarUsuario(usuario:Usuario) {
 
  
 const url= `${base_url}/usuarios/${usuario._id}`;
  
  return this.http.delete(url,this.headers);



 
}

cambiarUsuario( usuario: Usuario ) {

  const token = localStorage.getItem('token');

  return this.http.put(`${base_url}/usuarios/${usuario._id}`, usuario, {
       headers: {
         'x-token': token
       }
     });
}

}
