import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  public tipo: 'usuarios'| 'hospitales'| 'medicos';
  public id: string;
  public img :string
  private _ocultarModal: boolean = true
  
  //Para actualizar la imagen en la tabla sin refrescar la web
  public nuevaImagen:EventEmitter<string> = new EventEmitter<string>()

  get ocultarModal() {
    return this._ocultarModal
  }

  abrirModal(
    tipo: 'usuarios'| 'hospitales'| 'medicos',
    id: string,
    img: string = 'no-img'
  ) {
    this._ocultarModal = false;
  // las propiedades de la clase van a ser las recibidas como argumento
    this.tipo = tipo;
    this.id = id;
    //includes es para incluir imagenes de google
    if(img.includes('https')) {
      this.img = img
    } else {
      this.img = `${base_url}/upload/${tipo}/${img}`;
    }
   

  }
  cerrarModal() {
    this._ocultarModal = true
  }
  constructor() { }
}
