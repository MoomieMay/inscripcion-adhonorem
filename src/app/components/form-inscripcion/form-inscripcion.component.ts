import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InscripcionesService } from 'src/app/services/inscripciones.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'FormInscripcionComponent',
  templateUrl: './form-inscripcion.component.html',
  styleUrls: ['./form-inscripcion.component.css']
})
export class FormInscripcionComponent implements OnInit {
  form!: FormGroup;
  asignaturaSeleccionada: string = '';

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
    });
    // Inicializa el formulario
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      tipo_documento: ['', Validators.required],
      documento: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      telefono: ['', Validators.required],
      correo_electronico: ['', [Validators.required, Validators.email]],
      nro_legajo: ['', Validators.required],
      carrera: ['', Validators.required],
      porcentaje: ['', Validators.required],
      conectividad: ['', Validators.required],
      dispositivos: ['', Validators.required],
      beca: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const inscripcion = {
        ...this.form.value,
        asignatura: this.route.snapshot.queryParamMap.get('asignatura') || 'Sin asignatura'
      };

      this.inscripcionesService.crearInscripcion(inscripcion, this.asignaturaSeleccionada)
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
}
