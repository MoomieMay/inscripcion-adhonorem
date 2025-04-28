import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InscripcionesService } from 'src/app/services/inscripciones/inscripciones.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-resultados',
  templateUrl: './form-resultados.component.html',
  styleUrls: ['./form-resultados.component.css']
})

export class FormResultadosComponent implements OnInit {
  form: FormGroup;
  inscripciones: any[] = [];
  idLlamado: number = 0;
  nombreMateria: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private inscripcionesService: InscripcionesService,
    private toastr: ToastrService,
  ) {
    this.form = this.fb.group({});
  }

  async ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.idLlamado = Number(params.get('idLlamado'));

      if (this.idLlamado) {
        this.cargarInscripciones(this.idLlamado);
        this.obtenerNombreMateria();
      } else {
        console.error('No se recibió id en queryParams');
      }
    });
  }

  // Método para obtener el nombre de la materia a partir del idLlamado
  async obtenerNombreMateria() {
    try {
      this.nombreMateria = await this.inscripcionesService.obtenerNombreMateria(this.idLlamado);
      console.log('Nombre de la materia:', this.nombreMateria);
    } catch (error) {
      console.error('Error al obtener nombre de materia:', error);
    }
  }
  
  // Método para cargar las inscripciones
  async cargarInscripciones(idLlamado: Number) {
    try {
      console.log('ID llamado:', idLlamado);
      this.inscripciones = await this.inscripcionesService.obtenerInscripcionesPorLlamado(idLlamado);

      // Crear controles de puntaje con validaciones
      this.inscripciones.forEach((inscripcion, index) => {
        this.form.addControl(
          'puntaje_' + index,
          this.fb.control('', [
            Validators.required,
            Validators.min(0),
            Validators.max(100)
          ])
        );
      });

    } catch (error) {
      console.error('Error al cargar inscripciones:', error);
    }
  }

  // Método para cargar el puntaje
  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.toastr.error('❌ Campos incompletos o con error.', 'Error de validación');
      this.form.markAllAsTouched(); 
      return; 
    }

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
        console.log('Resultado guardado:', response);
      }

      this.toastr.success('✅ Resultados guardados exitosamente', '¡Éxito!');
      this.form.reset();
      setTimeout(() => {
        this.router.navigate(['/gestion-llamados']);
      }, 2000);
    } catch (error) {
      console.error('Error al guardar los resultados:', error);
      this.toastr.error('❌ Error al guardar los resultados.', 'Error');
    }
  }
}
