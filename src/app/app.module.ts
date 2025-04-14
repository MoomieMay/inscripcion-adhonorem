import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
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
import { TableInscriptosComponent } from './components/table-inscriptos/table-inscriptos.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainContentComponent,
    TableLlamadosComponent,
    FormInscripcionComponent,
    FormLlamadoComponent,
    TableResultadosComponent,
    TableInscriptosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right', // o 'toast-top-right', etc.
      timeOut: 3000,
      closeButton: true,
      progressBar: true
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
