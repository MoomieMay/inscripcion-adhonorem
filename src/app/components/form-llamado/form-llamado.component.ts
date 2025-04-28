import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LlamadosService } from 'src/app/services/llamados/llamados.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-llamado',
  templateUrl: './form-llamado.component.html',
  styleUrls: ['./form-llamado.component.css']
})
export class FormLlamadoComponent implements OnInit {
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
    // Inicializa el formulario vacío
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/)]],
      apellido: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/)]],
      nro_legajo: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      periodo: ['', Validators.required],
      escuela: ['', Validators.required],
      carrera: [{ value: '', disabled: true }, Validators.required],
      codigo: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^\d+$/)]],
      asignatura: [{ value: '', disabled: true }],
      porcentaje: ['', [Validators.required, Validators.min(20), Validators.max(100), Validators.pattern(/^\d+$/)]],
      fecha_cierre: ['', Validators.required],
    });

    this.cargarLlamado();
    this.cargarDatos();
    this.escucharCambios();
  }

  //Carga el llamado según el ID
  async cargarLlamado() {
    try {
      const llamados = await this.llamadosService.obtenerTodosLosLlamados();
      const llamado = llamados.find((c: any) => c.id === this.id);
      if (llamados) {
        this.form.patchValue(llamado);
      } else {
        this.toastr.error('Llamados no encontrado', 'Error');
        this.router.navigate(['/gestion-llamados']);
      }
    } catch (error) {
      console.error(error);
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
    this.form.get('escuela')?.valueChanges.subscribe(id => {
      this.filtrarCarreras(id);
    });

    this.form.get('carrera')?.valueChanges.subscribe(() => {
      this.form.get('codigo')?.enable();
    });

    this.form.get('codigo')?.valueChanges.subscribe(codigo => {
      this.buscarMateria(codigo);
    });
  }

  //Filtra las carreras según la escuela seleccionada
  async filtrarCarreras(idEscuela: string) {
    const idEscuelaNumber = Number(idEscuela);
    this.carrerasFiltradas = this.carreras.filter(carrera => carrera.escuela_carrera === idEscuelaNumber);

    console.log("Carreras filtradas en filtrar Carrera:", this.carrerasFiltradas);

    // Reset y deshabilitar el resto de los campos
    this.form.get('carrera')?.enable();
    this.form.get('carrera')?.reset('');
    this.form.get('codigo')?.disable();
    this.form.get('codigo')?.reset('');
    this.form.get('asignatura')?.disable();
    this.form.get('asignatura')?.reset('');
  }

  //Busca la materia según el código ingresado
  buscarMateria(codigo: string) {
    const carreraSeleccionada = Number(this.form.get('carrera')?.value);
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
    const carreraSeleccionada = Number(this.form.get('carrera')?.value);
    const codigoIngresado = Number(this.form.get('codigo')?.value);

    const materia = this.materias.find(m =>
      m.codigo_materia === codigoIngresado &&
      m.carrera_materia === carreraSeleccionada
    );

    return materia ? materia.id : null;
  }

  //Método para cargar el formulario
  async onSubmit() {
    console.log('Entro onSubmit');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.error('❌ Revise su formulario.', 'Error de validación');
      return;
    }

    const formValues = this.form.value;

    const llamadoData = {
      nombre_responsable: formValues.nombre,
      apellido_responsable: formValues.apellido,
      legajo_responsable: formValues.nro_legajo,
      periodo: formValues.periodo,
      porcentaje: formValues.porcentaje,
      cierre_llamado: formValues.fecha_cierre,
      materia_llamado: Number(this.obtenerIdMateria()),
    };

    console.log('Llamado Data:', llamadoData);

    try {
      console.log('Entro onSubmit - try');
      if (llamadoData) {
        await this.llamadosService.crearLlamado(llamadoData);
        this.toastr.success('✅ Llamado creado exitosamente', '¡Éxito!');
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

