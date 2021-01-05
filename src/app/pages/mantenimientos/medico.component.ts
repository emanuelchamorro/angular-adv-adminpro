import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  public hospitales:Hospital[] = [];
  public medicoForm:FormGroup;
  public hospitalSeleccionado:Hospital;
  public medicoSeleccionado: Medico;

  constructor(private fb:FormBuilder,
              private hospitalService: HospitalService,
              private medicoService: MedicoService,
              private router:Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {



    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    })

 //Para lograr que traiga la info del hospital cuando lo selecciono en el select
    this.medicoForm.get('hospital').valueChanges.subscribe(
         hospitalId=> {
           this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId );
           console.log(this.hospitalSeleccionado)
         }
    )

    //Para obtener id de los params
    this.activatedRoute.params.subscribe(({id}) => {
      this.cargarMedico(id)
    })

    this.cargarHospitales()
  }




  cargarHospitales(){
    this.hospitalService.cargarHospitales().subscribe((hospital:Hospital[]) => {
      this.hospitales = hospital;
 
    })
  }



  guardarMedico(){
    console.log(this.medicoForm.value);

    const {nombre}= this.medicoForm.value

if( this.medicoSeleccionado) {
  //actualizar

   const data = {
     ...this.medicoForm.value,
     _id:this.medicoSeleccionado._id
   }

  this.medicoService.actualizarMedicos(data).subscribe(resp =>{
    Swal.fire('Actualizado',`${nombre} modificado correctamente`, 'success');
   
  })

} else {
  //crear
  this.medicoService.crearMedicos(this.medicoForm.value)
  .subscribe((resp:any) => {
    console.log(resp);
    Swal.fire('Creado',`${nombre} creado correctamente`, 'success');
    this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`)
  })
}
}




  cargarMedico(id:string) {

    if( id === 'nuevo') {
      return; 
    }


    this.medicoService.getMedicoById(id).subscribe(medico => {
      
      if (!medico) {
        return this.router.navigateByUrl(`/dashboard/medicos`);
      }
     
      const {nombre, hospital:{_id}} = medico;
      console.log(nombre, _id)
      this.medicoSeleccionado = medico;
      this.medicoForm.setValue({nombre, hospital: _id});
    })
  }

}
