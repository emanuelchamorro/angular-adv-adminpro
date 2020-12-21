import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async actualizarFoto(
    archivo:File,
    tipo: 'usuarios' | 'hospitales' | 'medicos',
    id:string
  ) {

    try{

    const url= `${base_url}/upload/${tipo}/${id}`;
    const formData= new FormData;
    formData.append('imagen', archivo)

    //peticion fetch Api
    const resp= await fetch(url,{
      method:'PUT',
      headers: {
        'x-token': localStorage.getItem('token') || ''
      },
      body:formData
    });
    
    // para devolver el contenido del body de el metodo put "subir archivo" actualizado
    const data = await resp.json();
 

    //Retornar imagen actualizada para que pueda refrescarse automáticamente al tocar guardar

    if(data.ok){
      return data.nombreArchivo
    }else{
      console.log(data.msg)
      return false
    }

    return 'nombre de la imagen'
     
    }catch(error){
     console.log(error);
    }
  }
}
