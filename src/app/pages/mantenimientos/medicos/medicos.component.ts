import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit, OnDestroy {

   public medicos: Medico[] = [];
   public cargando: boolean = true;
   public medicosTemp:Medico[]=[];


  constructor(private medicoService:MedicoService, 
              private modalService:ModalImagenService,
              private busqueda:BusquedasService) { }

  ngOnDestroy(): void {
    this.modalService.nuevaImagen.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    //Para refrescar la vista una vez cambiada la imagen del hospital
    this.modalService.nuevaImagen
    .pipe(
      //Para que no recarge antes de que el servidor haya terminado de subir la imagen
      delay(1000)
     )
    .subscribe(img => this.cargarMedicos())

  }

cargarMedicos() {
  this.cargando = true
  this.medicoService.cargarMedicos().subscribe(medicos => {
  this.medicos = medicos;
  console.log(medicos)
})
}
 
abrirModal(medico: Medico) {
  this.modalService.abrirModal('medicos', medico._id, medico.img); 
}

buscar(termino:string) {
  
  if(termino.length === 0) {
    return this.cargarMedicos();
   
  }
  
  this.busqueda.buscar('medicos', termino)
     .subscribe((resp:Medico[]) => {
       this.medicos = resp
     })
}

borrarMedico(medico:Medico) {
  this.medicoService.borrarMedicos(medico._id)
                      .subscribe(resp => {
                        this.cargarMedicos();
                        Swal.fire('Borrado', medico.nombre, 'success');
                      });
}




}
