import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicoComponent } from './mantenimientos/medico.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { AdminGuard } from '../guards/admin.guard';
import { PerfilComponent } from './perfil/perfil.component';
import { ProgressComponent } from './progress/progress.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';


const childRoutes: Routes = [
  {path: '', component: DashboardComponent, data: {titulo: 'Dashboard'}},
  {path: 'progress', component: ProgressComponent, data: {titulo: 'Progress'}},
  {path: 'grafica1', component: Grafica1Component, data: {titulo: 'Grafica'}},
  {path: 'account-settings', component: AccountSettingsComponent, data: {titulo: 'Account Settings'}},
  {path: 'promesas', component: PromesasComponent, data: {titulo: 'Promesas'}},
  {path: 'rxjs', component: RxjsComponent, data: {titulo: 'Rxjs'}},
  {path: 'perfil', component: PerfilComponent, data: {titulo: 'Perfil de usuario'}},
  {path: 'buscar/:termino', component: BusquedaComponent, data: {titulo: 'Busquedas'}},

  //Mantenimientos
  
  {path: 'usuarios', canActivate: [AdminGuard], component: UsuariosComponent, data: {titulo: 'Usuario de app'}},
  {path: 'hospitales', component: HospitalesComponent, data: {titulo: 'Hospitales de app'}},
  {path: 'medicos', component: MedicosComponent, data: {titulo: 'Medicos de app'}},
  {path: 'medico/:id', component: MedicoComponent, data: {titulo: 'Medico de app'}},

]

@NgModule({
  imports: [ RouterModule.forChild(childRoutes)],
  exports:[RouterModule]
})
export class ChildRoutesModule { }
