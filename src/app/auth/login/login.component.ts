import { Component, NgZone, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
declare const gapi:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formSubmitted = false
  public auth2:any
 

  public loginForm = this.fb.group({
            //para que ponga el mail recordado y si es nulo un string vacio
    email:[ localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password:[ '', Validators.required ],
    remember:[false]
  
  })

  constructor(private router: Router, 
              private fb: FormBuilder,
              private us: UsuarioService,
              private ngZone: NgZone) { }

  ngOnInit(): void{
    this.renderButton();
  }

login(){
this.us.login(this.loginForm.value)
       .subscribe(resp => {

         if(this.loginForm.get('remember').value) {
           localStorage.setItem('email', this.loginForm.get('email').value);
         } else {
           localStorage.removeItem('email');
         }
        
         //Redirigir al usuario autenticado al dashboard

          this.router.navigateByUrl('/');

       }, (err)=>{
        Swal.fire('Error', err.error.msg, 'error');
       })
}
 
//GOOGLE SING IN


renderButton() {
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
  });
  this.startApp();
}
startApp() {
  gapi.load('auth2', () => {
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    this.auth2 = gapi.auth2.init({
      client_id: '325818138019-s4vbbuug9qemvafotvgh3un9qp29imeo.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      // Request scopes in addition to 'profile' and 'email'
      //scope: 'additional_scope'
    });
    this.attachSignin(document.getElementById('my-signin2'));
  });
};
attachSignin(element) {
  console.log(element.id);
  this.auth2.attachClickHandler(element, {},
     (googleUser)=> {
        var id_token = googleUser.getAuthResponse().id_token;
       // console.log(id_token);
       this.us.loginGoogle(id_token).subscribe(resp=> {
  
       this.ngZone.run(()=> {
         //Redirigir al usuario autenticado al dashboard
        this.router.navigateByUrl('/');
       })
    
       });

      },(error)=> {
        alert(JSON.stringify(error, undefined, 2));
      });
}

}
