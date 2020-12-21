import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: []
})
export class ModalImagenComponent implements OnInit {


  public imagenSubir:File;
  public imgTemp:any = null

  constructor(public modalService: ModalImagenService, public fileUpload:FileUploadService ) { 
   
  }

  ngOnInit(): void {}

  cerrarModal(){
  this.imgTemp = null
  this.modalService.cerrarModal()
 }


 cambiarImagen(file:File) {
  this.imagenSubir = file;
 
   //mostrar imagen seleccionada antes de tocar boton guardar
 
   if(!file){
     //si toco cancelar en explorador de windows, me devuelve la img original
     return this.imgTemp = null; 
   }
 
   const reader = new FileReader;
   const url64 = reader.readAsDataURL(file);
   
   reader.onloadend = ()=> {
    this.imgTemp = reader.result;
   }
 

 }
   
subirImagen() {

  const tipo = this.modalService.tipo;
  const id = this.modalService.id;

    this.fileUpload.actualizarFoto(this.imagenSubir, tipo, id)
     .then(img=> {
       // Msg de exito(opcional)
       Swal.fire('Imagen actualizada','Tu imagen de perfil se ha actualizado', 'success');
       this.modalService.nuevaImagen.emit(img);
       this.cerrarModal();
      });
      
}


}
