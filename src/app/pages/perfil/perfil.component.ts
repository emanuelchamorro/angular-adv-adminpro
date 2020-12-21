import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: []
})
export class PerfilComponent implements OnInit {

  public perfilForm:FormGroup;
  public usuario:Usuario;
  public imagenSubir:File;
  public imgTemp:any = null

  constructor(private fb:FormBuilder, 
    private us:UsuarioService, 
    private fileUpload:FileUploadService) {
   
      this.usuario = us.usuario;
   }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre:[this.usuario.nombre, Validators.required],
      email:[this.usuario.email, [Validators.required, Validators.email]]
    })

  }

  actualizarPerfil() {
    console.log(this.perfilForm.value);
    this.us.actualizarUsuario(this.perfilForm.value).subscribe(resp=>{
      const { nombre, email} = this.perfilForm.value;
      this.usuario.nombre = nombre;
      this.usuario.email = email;

      Swal.fire('Guardado','Cambios fueron guardados', 'success')
    }, (err) =>{
      Swal.fire('Error', err.error.msg, 'error')
    })
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

  // subir imagen automaticamente cuando se elige
 
  this.fileUpload.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario._id)
  .then(img=> {this.usuario.img = img;
    // Msg de exito(opcional)
    Swal.fire('Imagen actualizada','Tu imagen de perfil se ha actualizado', 'success');
   });

}
  
// subir imagen solo cuando se toca boton guardar cambios

/*subirImagen() {
  this.fileUpload.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario._id)
  .then(img=> this.usuario.img = img);
}*/

}
