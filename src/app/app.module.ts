import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
//Firebase
import { AngularFireModule } from '@angular/fire/compat';

//Componentes
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { TableLlamadosComponent } from './components/table-llamados/table-llamados.component';
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
    TableLlamadosComponent,
    FormInscripcionComponent,
    FormLlamadoComponent,
    TableResultadosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
