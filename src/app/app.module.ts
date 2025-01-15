import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { TableVigentesComponent } from './components/table-vigentes/table-vigentes.component';
import { TableVencidasComponent } from './components/table-vencidas/table-vencidas.component';
import { FormInscripcionComponent } from './components/form-inscripcion/form-inscripcion.component';
import { FormLlamadoComponent } from './components/form-llamado/form-llamado.component';
import { AppRoutingModule } from './app-routing.module';
import { TableResultadosComponent } from './components/table-resultados/table-resultados.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainContentComponent,
    TableVigentesComponent,
    TableVencidasComponent,
    FormInscripcionComponent,
    FormLlamadoComponent,
    TableResultadosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
