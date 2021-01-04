import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
              private router:Router) { }

  ngOnInit(): void {

    this.cargarHospitales()

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


  }




  cargarHospitales(){
    this.hospitalService.cargarHospitales().subscribe((hospital:Hospital[]) => {
      this.hospitales = hospital;
 
    })
  }



  guardarMedico(){
    console.log(this.medicoForm.value);

    this.medicoService.crearMedicos(this.medicoForm.value)
                      .subscribe((resp:any) => {
                        console.log(resp);
                        Swal.fire('Creado',`${this.medicoForm.value} creado correctamente`, 'success');
                        this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`)
                      })
  }

}
