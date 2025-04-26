import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContentComponent } from './components/main-content/main-content.component';
import { TableLlamadosComponent } from './components/table-llamados/table-llamados.component';
import { TableResultadosComponent } from './components/table-resultados/table-resultados.component';
import { FormInscripcionComponent } from './components/form-inscripcion/form-inscripcion.component';
import { TableInscriptosComponent } from './components/table-inscriptos/table-inscriptos.component';
import { GestionLlamadosComponent } from './components/gestion-llamados/gestion-llamados.component';
import { FormResultadosComponent } from './components/form-resultados/form-resultados.component';
import { FormLlamadoComponent } from './components/form-llamado/form-llamado.component';
import { FormLlamadoEditComponent } from './components/form-llamado-edit/form-llamado-edit.component';

const routes: Routes = [
  { path: '', component: MainContentComponent }, 
  { path: 'llamados', component: TableLlamadosComponent },
  { path: 'resultados', component: TableResultadosComponent },
  {path: 'form-inscripcion',component: FormInscripcionComponent},
  { path: 'lista-inscriptos', component: TableInscriptosComponent }, // Protegida más adelante
  { path: 'gestion-llamados', component: GestionLlamadosComponent }, // Protegida más adelante
  { path: 'form-llamado', component: FormLlamadoComponent }, // Protegida más adelante
  { path: 'form-llamado-edit/:id', component: FormLlamadoEditComponent }, // Protegida más adelante
  { path: 'form-resultados', component: FormResultadosComponent }, // Protegida más adelante
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
