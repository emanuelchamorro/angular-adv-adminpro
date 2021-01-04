import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  public hospitales:Hospital[] = [];
  public medicoForm:FormGroup;
  public hospitalSeleccionado:Hospital

  constructor(private fb:FormBuilder,
              private hospitalService: HospitalService) { }

  ngOnInit(): void {

    this.cargarHospitales()

    this.medicoForm = this.fb.group({
      nombre: ['Hernando', Validators.required],
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
    console.log(this.medicoForm.value)
  }

}
