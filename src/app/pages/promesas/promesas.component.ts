import { Component, OnInit } from '@angular/core';
import { rejects } from 'assert';
import { timingSafeEqual } from 'crypto';
import { promise } from 'protractor';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  
    this.getUsers().then(usuarios =>{
      console.log(usuarios)
    })

/* const promesa = new Promise((resolve, reject)=>{

  if (false) {
    resolve('Hola Mundo')
  } else {
    reject('hubo un error')};
  
    promesa.then((mensaje)=>{
      console.log(mensaje)
    })
.catch(error =>
  console.log('error en mi promesa', error)
)
   })

console.log('Fin del init')*/
 


}

getUsers(){
  const promesa = new Promise( resolve => {

  fetch('https://reqres.in/api/users' )
  .then(resp => resp.json())
  .then(body => resolve(body.data))
});

return  promesa;
}

}