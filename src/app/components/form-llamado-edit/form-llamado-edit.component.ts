import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LlamadosService } from 'src/app/services/llamados/llamados.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-llamado-edit',
  templateUrl: './form-llamado-edit.component.html',
  styleUrls: ['./form-llamado-edit.component.css']
})
export class FormLlamadoEditComponent implements OnInit {
  form!: FormGroup;
  id!: string; // ID del llamado que viene de la URL
  llamado: any;
  escuelas: any[] = [];
  carreras: any[] = [];
  materias: any[] = [];

  carrerasFiltradas: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private llamadosService: LlamadosService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      nro_legajo: ['', Validators.required],
      periodo: ['', Validators.required],
      escuela: ['', Validators.required],
      carrera: [{ value: '', disabled: true }, Validators.required],
      codigo: [{ value: '', disabled: true }, Validators.required],
      asignatura: [{ value: '', disabled: true }],
      porcentaje: ['', Validators.required],
      fecha_cierre: ['', Validators.required],
    });

    this.id = this.route.snapshot.paramMap.get('id')!; 
    this.cargarLlamado(this.id);
    this.cargarDatos();
    this.escucharCambios();
  }

  //Carga el llamado según el ID
  async cargarLlamado(id: string) {
    try {
      this.llamado = await this.llamadosService.obtenerLlamadoPorId(id);
  
      if (this.llamado) {
        this.form.patchValue({
          nombre: this.llamado.nombre_responsable,
          apellido: this.llamado.apellido_responsable,
          nro_legajo: this.llamado.legajo_responsable,
          periodo: this.llamado.periodo,
          porcentaje: this.llamado.porcentaje,
          fecha_cierre: this.llamado.cierre_llamado,
          codigo: this.llamado.materia_llamado.codigo_materia,
          asignatura: this.llamado.materia_llamado.nombre_materia
        });
  
        // Setear y deshabilitar los campos escuela y carrera
        this.form.get('escuela')?.setValue(this.llamado.materia_llamado.carrera_materia.escuela_carrera.nombre_escuela);
        this.form.get('escuela')?.disable();
  
        this.form.get('carrera')?.setValue(this.llamado.materia_llamado.carrera_materia.nombre_carrera);
        this.form.get('carrera')?.disable();
        console.log('Carrera:', this.llamado.materia_llamado.carrera_materia.id);

        this.form.get('codigo')?.setValue(this.llamado.materia_llamado.codigo_materia);
        this.form.get('codigo')?.enable();
        this.form.get('asignatura')?.setValue(this.llamado.materia_llamado.nombre_materia);


      }
    } catch (error) {
      console.error('Error al cargar el llamado:', error);
      this.toastr.error('Error al cargar el llamado', 'Error');
    }
  }
  
  //Carga los datos de las tablas escuelas, carreras y materias en los selects
  async cargarDatos() {
    try {
      this.escuelas = await this.llamadosService.obtenerEscuelas();
      this.carreras = await this.llamadosService.obtenerCarreras();
      this.materias = await this.llamadosService.obtenerMaterias();
    } catch (error) {
      console.error(error);
    }
  }

  //Escucha los cambios en los selects y habilita o deshabilita los campos correspondientes
  escucharCambios() {
    this.form.get('codigo')?.valueChanges.subscribe(codigo => {
      this.buscarMateria(codigo);
    });
  }


  //Busca la materia según el código ingresado
  buscarMateria(codigo: string) {
    const carreraSeleccionada = Number(this.llamado.materia_llamado.carrera_materia.id);
    console.log('Carrera seleccionada:', carreraSeleccionada);
    const codigoNumber = Number(codigo);
    const materia = this.materias.find(m => m.codigo_materia === codigoNumber && m.carrera_materia === carreraSeleccionada);

    if (materia) {
      this.form.get('asignatura')?.setValue(materia.nombre_materia);
      //this.form.get('asignatura')?.enable();
    } else {
      this.form.get('asignatura')?.setValue('');
      this.form.get('asignatura')?.disable();
    }
  }

  //Obtiene el ID de la materia seleccionada
  obtenerIdMateria() {
    const carreraSeleccionada = Number(this.llamado.materia_llamado.carrera_materia.id);
    const codigoIngresado = Number(this.form.get('codigo')?.value);

    const materia = this.materias.find(m =>
      m.codigo_materia === codigoIngresado &&
      m.carrera_materia === carreraSeleccionada
    );

    return materia ? materia.id : null;
  }

  //Método para validar los campos del formulario
  async onSubmit() {
    //console.log('Datos a enviar:', this.form.value);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValues = this.form.value;

    const llamadoData = {
      cierre_llamado: formValues.fecha_cierre,
      nombre_responsable: formValues.nombre,
      apellido_responsable: formValues.apellido,
      legajo_responsable: formValues.nro_legajo,
      periodo: formValues.periodo,
      materia_llamado: Number(this.obtenerIdMateria()),
      porcentaje: formValues.porcentaje,
    };

    try {
      console.log('Llamado a enviar:', llamadoData.materia_llamado);
      if (this.id) {
        // Actualizar llamado existente
        await this.llamadosService.actualizarLlamado(this.id, llamadoData);
        this.toastr.success('✅ Llamado actualizado exitosamente', '¡Éxito!');
      } 
      this.form.reset();
      setTimeout(() => {
        this.router.navigate(['/gestion-llamados']);
      }, 2000);
    } catch (error) {
      console.error(error);
      if (error) {
        console.error('Detalles del error:', error);
      }
      this.toastr.error('❌ Error al guardar el llamado', 'Error');
    }
  }
}

