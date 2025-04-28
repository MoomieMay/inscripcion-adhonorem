import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard'; 
import { MainContentComponent } from './components/main-content/main-content.component';
import { TableLlamadosComponent } from './components/table-llamados/table-llamados.component';
import { TableResultadosComponent } from './components/table-resultados/table-resultados.component';
import { FormInscripcionComponent } from './components/form-inscripcion/form-inscripcion.component';
import { TableInscriptosComponent } from './components/table-inscriptos/table-inscriptos.component';
import { GestionLlamadosComponent } from './components/gestion-llamados/gestion-llamados.component';
import { FormResultadosComponent } from './components/form-resultados/form-resultados.component';
import { FormLlamadoComponent } from './components/form-llamado/form-llamado.component';
import { FormLlamadoEditComponent } from './components/form-llamado-edit/form-llamado-edit.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';

const routes: Routes = [
  { path: '', component: MainContentComponent }, 
  { path: 'llamados', component: TableLlamadosComponent },
  { path: 'resultados', component: TableResultadosComponent },
  { path: 'form-inscripcion',component: FormInscripcionComponent },
  { path: 'acceso-denegado', component: AccessDeniedComponent },
  { path: 'lista-inscriptos', component: TableInscriptosComponent, canActivate: [authGuard] }, // Protegida
  { path: 'gestion-llamados', component: GestionLlamadosComponent, canActivate: [authGuard] }, // Protegida 
  { path: 'form-llamado', component: FormLlamadoComponent, canActivate: [authGuard] }, // Protegida 
  { path: 'form-llamado-edit/:id', component: FormLlamadoEditComponent, canActivate: [authGuard] }, // Protegida 
  { path: 'form-resultados', component: FormResultadosComponent, canActivate: [authGuard] }, // Protegida 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
