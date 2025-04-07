import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InscripcionesService } from 'src/app/services/inscripciones.service';
import { supabase } from 'src/app/services/supabase.service';


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
    private inscripcionesService: InscripcionesService,
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
          alert(`✅ Inscripción exitosa. Nº Transacción: ${respuesta.id}`);
          this.form.reset();
        })
        .catch(error => {
          console.error(error);
          alert('❌ Error al enviar el formulario');
        });

    } else {
      this.form.markAllAsTouched();
    }
  }
}
