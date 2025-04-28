import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InscripcionesService } from 'src/app/services/inscripciones/inscripciones.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'FormInscripcionComponent',
  templateUrl: './form-inscripcion.component.html',
  styleUrls: ['./form-inscripcion.component.css']
})
export class FormInscripcionComponent implements OnInit {
  form!: FormGroup;
  asignaturaSeleccionada: string = '';
  idLlamado: number | null = null;
  carreras: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private inscripcionesService: InscripcionesService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Recibe la asignatura desde la URL
    this.route.queryParams.subscribe(params => {
      this.asignaturaSeleccionada = params['asignatura'] || '';
      this.idLlamado = params['id'] ? Number(params['id']) : null;
    });

    this.obtenerCarreras();

    // Inicializa el formulario
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/)]],
      apellido: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/)]],
      tipo_documento: ['', Validators.required],
      documento: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      telefono: ['', Validators.required],
      correo_electronico: ['', [
        Validators.required, Validators.email, 
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],      
      nro_legajo: ['', [Validators.required]],
      carrera: ['', Validators.required],
      porcentaje: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      conectividad: ['', Validators.required],
      dispositivos: ['', Validators.required],
      beca: ['', Validators.required]
    });
  }

  // Carga las carreras desde el servicio
  async obtenerCarreras() {
    try {
      const carrerasObtenidas = await this.inscripcionesService.obtenerCarreras();
      console.log('Carreras obtenidas:', carrerasObtenidas);

      // Como es un array directamente, asignamos directo:
      this.carreras = carrerasObtenidas || [];
    } catch (error) {
      console.error('Error al cargar carreras:', error);
      this.carreras = [];
    }
  }

  // Acción al enviar el formulario
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.error('❌ Revise su formulario.', 'Error de validación');
      return;
    }

    if (this.form.valid) {
      const inscripcion = {
        ...this.form.value,
        documento: Number(this.form.value.documento),
        telefono: Number(this.form.value.telefono),
        carrera: Number(this.form.value.carrera),
      };

      this.inscripcionesService.crearInscripcion(inscripcion, this.idLlamado)
        .then(respuesta => {
          this.toastr.success(`✅ Inscripción exitosa. Nº Transacción: ${respuesta.id}`, '¡Éxito!');
          this.form.reset();

          // Redirige luego de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/llamados']);
          }, 2000);
        })
        .catch(error => {
          console.error(error);
          this.toastr.error('❌ Error al enviar el formulario. Intente nuevamente.', 'Error');
        });

    } else {
      this.form.markAllAsTouched();
    }
  }

  soloNumeros(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onInputChange() {
    const porcentajeControl = this.form.get('porcentaje');
    if (porcentajeControl) {
      // Esto asegurará que Angular valide correctamente el campo.
      porcentajeControl.updateValueAndValidity();
    }
  }
}
