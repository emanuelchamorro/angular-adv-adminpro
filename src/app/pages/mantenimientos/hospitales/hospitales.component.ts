import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit, OnDestroy {

   public hospitales:Hospital[] = []
   public hospitalesTemp:Hospital[]=[];
   public cargando: boolean = true


  constructor(private hospitalService:HospitalService, 
              private modalService:ModalImagenService,
              private busqueda:BusquedasService) { }
 
  ngOnDestroy(): void {
    this.modalService.nuevaImagen.unsubscribe();
  }

  ngOnInit(): void {
   this.cargarHospitales();
    
   //Para refrescar la vista una vez cambiada la imagen del hospital
     this.modalService.nuevaImagen
     .pipe(
       //Para que no recarge antes de que el servidor haya terminado de subir la imagen
       delay(1000)
      )
     .subscribe(img => this.cargarHospitales())
  }


cargarHospitales() {
  this.cargando = true
  this.hospitalService.cargarHospitales().subscribe(hospitales => {
    this.cargando = false;
    this.hospitales = hospitales
  })


}


guardarCambios(hospital:Hospital) {
  this.hospitalService.actualizarHospitales(hospital.nombre, hospital._id)
                      .subscribe(resp => {
                        Swal.fire('Actualizado', hospital.nombre, 'success');
                      });
}


eliminarHospital(hospital:Hospital) {
  this.hospitalService.borrarHospitales(hospital._id)
                      .subscribe(resp => {
                        this.cargarHospitales();
                        Swal.fire('Borrado', hospital.nombre, 'success');
                      });
}


async abrirSweetAlert(){
  const {value= ''} = await Swal.fire<string>({
    title: 'Crea un nuevo hospital',
    input: 'text',
    inputLabel: 'Tu nuevo hospital',
    showCancelButton: true,
    inputPlaceholder: ''
  })
  
 if(value.trim().length > 0 ) {
   this.hospitalService.crearHospitales(value)
                       .subscribe((resp:any) =>
                         this.hospitales.push(resp.hospital)
                        )
 }
}

buscar(termino:string) {
  
  if(termino.length === 0) {
    return this.cargarHospitales();
  }
  
  this.busqueda.buscar('hospitales', termino)
     .subscribe((resp:Hospital[]) => {
       this.hospitales = resp
     })
}



abrirModal(hospital: Hospital) {
  this.modalService.abrirModal('hospitales', hospital._id, hospital.img); 
}

}
