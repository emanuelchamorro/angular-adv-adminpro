import { Component, OnDestroy, OnInit } from '@angular/core';
import { stringify } from 'querystring';
import { delay } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit, OnDestroy {


  public totalUsuarios:number=0;
  public usuarios:Usuario[]=[];
  public usuariosTemp:Usuario[]=[];
  public desde:number=0;
  public cargando:boolean=true

  constructor(private us:UsuarioService, private busqueda:BusquedasService, 
              private modalService:ModalImagenService) { }
  
  ngOnDestroy(): void {
    this.modalService.nuevaImagen.unsubscribe();
  }

  ngOnInit(): void {
   this.cargarUsuarios();
  //Para refrescar la vista una vez cambiada la imagen de los usuarios
   this.modalService.nuevaImagen
   .pipe(
     //Para que no recarge antes de que el servidor haya terminado de subir la imagen
     delay(1000)
    )
   .subscribe(img => this.cargarUsuarios())
  }

cargarUsuarios() {
  this.cargando = true
  this.us.cargarUsuarios(this.desde).subscribe(({total, usuarios})=>{
    this.totalUsuarios = total;
    this.usuarios = usuarios;
    this.usuariosTemp = usuarios;
    this.cargando = false
  })
}


cambiarPagina(valor:number) {

  //si viene 5 le sumo 5 al desde
  this.desde += valor;

  if(this.desde < 0 ) {
    this.desde = 0
  } else if(this.desde > this.totalUsuarios) {
    this.desde -= valor;
  }
 
  this.cargarUsuarios();

}



buscar(termino:string) {
  
  if(termino.length === 0) {
    return this.usuarios = this.usuariosTemp;
  }
  
  this.busqueda.buscar('usuarios', termino)
     .subscribe((resp:Usuario[]) => {
       this.usuarios = resp
     })
}

borrarUsuario(usuario:Usuario) {
 
  if(usuario._id === this.us.usuario._id) {
    return Swal.fire('Error', 'No puede borrar su propio usuario', 'error');
  }

  

  Swal.fire({
    title: '¿Borrar usuario?',
    text: `Está a punto de borrar ${usuario.nombre}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
     this.us.eliminarUsuario(usuario)
        .subscribe(resp => {
          this.cargarUsuarios();
          Swal.fire('Usuario borrado',`${usuario.nombre}`, 'success')
        });
  
    }
  })

}

cambiarRole(usuario:Usuario) {
 this.us.cambiarUsuario(usuario)
     .subscribe(resp=>{
       console.log(resp)
     })
}


abrirModal(usuario:Usuario) {
  this.modalService.abrirModal('usuarios', usuario._id, usuario.img);
}

}
