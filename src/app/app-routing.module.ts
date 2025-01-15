import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContentComponent } from './components/main-content/main-content.component';
import { TableVigentesComponent } from './components/table-vigentes/table-vigentes.component';
import { TableVencidasComponent } from './components/table-vencidas/table-vencidas.component';
import { TableResultadosComponent } from './components/table-resultados/table-resultados.component';

const routes: Routes = [
  { path: '', component: MainContentComponent }, 
  { path: 'vigentes', component: TableVigentesComponent },
  { path: 'resultados', component: TableResultadosComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
