import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InscripcionesService } from 'src/app/services/inscripciones/inscripciones.service';
import { LlamadosService } from 'src/app/services/llamados/llamados.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-resultados',
  templateUrl: './form-resultados.component.html',
  styleUrls: ['./form-resultados.component.css']
})

export class FormResultadosComponent implements OnInit {
  form: FormGroup;
  inscripciones: any[] = [];
  idLlamado: Number = 0;
  nombreMateria: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private inscripcionesService: InscripcionesService,
    private llamadosService: LlamadosService,
    private toastr: ToastrService,
  ) {
    this.form = this.fb.group({});
  }

  async ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.idLlamado = Number(params.get('idLlamado'));
      console.log('ID recibido por queryParams:', this.idLlamado);

      if (this.idLlamado) {
        this.cargarInscripciones(this.idLlamado);
      } else {
        console.error('No se recibió id en queryParams');
      }
    });
    //await this.obtenerNombreMateria();

  }

  /*async obtenerNombreMateria() {
    try {
      this.nombreMateria = await this.llamadosService.obtenerNombreMateria(idLlamado);
    } catch (error) {
      console.error(error);
    }
  }*/

  async cargarInscripciones(idLlamado: Number) {
    try {
      console.log('ID llamado:', idLlamado);
      this.inscripciones = await this.inscripcionesService.obtenerInscripcionesPorLlamado(idLlamado);

      // Crear controles de puntaje
      this.inscripciones.forEach((inscripcion, index) => {
        this.form.addControl('puntaje_' + index, this.fb.control(''));
      });

    } catch (error) {
      console.error('Error al cargar inscripciones:', error);
    }
  }

  async onSubmit(): Promise<void> {
    const resultados: any[] = [];

    this.inscripciones.forEach((inscripcion, index) => {
      const puntaje = this.form.get('puntaje_' + index)?.value;
      resultados.push({
        id_llamado: this.idLlamado,
        id_inscripcion: inscripcion.id,
        puntaje: puntaje
      });
    });

    console.log('Resultados a enviar:', resultados);

    try {
      for (const resultado of resultados) {
        console.log('Guardando resultado:', resultado);
        const response = await this.inscripcionesService.guardarResultado(resultado.puntaje, resultado.id_inscripcion);
        console.log('Resultados guardados correctamente:', response);
      }

      this.toastr.success('✅ Resultados guardados exitosamente', '¡Éxito!');
      this.form.reset();
      setTimeout(() => {
        this.router.navigate(['/gestion-llamados']);
      }, 2000);
    } catch (error) {
      console.error('Error al guardar los resultados:', error);
      this.toastr.error('❌ Error al guardar el llamado', 'Error');
    }

  }
}
