import { environment } from 'src/environments/environment'

/* base_url: 'http://localhost:3000/api'*/

const base_url = environment.base_url

export class Usuario {

    constructor
    (
     public google: boolean,
     public nombre: string,
     public email: string,
     public img: string,
     public password?: string,
     public role?: string,
     public _id?: string,
    )
    {}


   get imgUrl() {
     
     if(!this.img){
      return `${base_url}/upload/usuarios/no-image`
     }

     //Para img de google el link es distinto
 
     if (this.img.includes('https')){
        return this.img;
    }
     //Para avatar img del servidor

      if(this.img) {
          return `${base_url}/upload/usuarios/${this.img}`
      } else {
          
        return `${base_url}/upload/usuarios/no-image`
      }
 
    }
}