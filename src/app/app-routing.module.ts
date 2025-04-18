import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContentComponent } from './components/main-content/main-content.component';
import { TableLlamadosComponent } from './components/table-llamados/table-llamados.component';
import { TableResultadosComponent } from './components/table-resultados/table-resultados.component';
import { FormInscripcionComponent } from './components/form-inscripcion/form-inscripcion.component';

const routes: Routes = [
  { path: '', component: MainContentComponent }, 
  { path: 'llamados', component: TableLlamadosComponent },
  { path: 'resultados', component: TableResultadosComponent },
  {path: 'form-inscripcion',component: FormInscripcionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
