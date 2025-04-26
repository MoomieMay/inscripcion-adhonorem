import { Component, OnInit } from '@angular/core';
import { InscripcionesService } from 'src/app/services/inscripciones/inscripciones.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = pdfFonts.vfs;

@Component({
  selector: 'app-table-inscriptos',
  templateUrl: './table-inscriptos.component.html',
  styleUrls: ['./table-inscriptos.component.css']
})

export class TableInscriptosComponent implements OnInit {
  inscriptos: any[] = [];
  filtroAsignatura: number | null = null; // para la tabla de gestión de inscriptos
  materiasDisponibles: any[] = []; // para cargar en el select del filtro
  materiasLista: { id: number, nombre_materia: string }[] = []; // para cargar el nombre de la materia en el PDF
  carreras: any[] = []; // para cargar el nombre de la carrera en el PDF

  constructor(
    private inscripcionesService: InscripcionesService
  ) { }

  ngOnInit(): void {
    //Al iniciar carga todos los inscriptos en table-inscriptos, las materias en el select y las carreras para el PDF
    this.cargarInscriptos();
    this.cargarMaterias();
    this.inscripcionesService.obtenerCarreras()
      .then(carreras => {
        this.carreras = carreras; // Asigna los datos al array
      })
      .catch(error => console.error('Error al cargar las carreras:', error));
  }

  // Método para cargar los inscriptos en la tabla de gestión de inscriptos
  async cargarInscriptos() {
    try {
      const inscripciones = await this.inscripcionesService.obtenerInscripciones();
      this.inscriptos = inscripciones;
    } catch (error) {
      console.error('Error al cargar las convocatorias:', error);
    }
  }

  // Método para cargar las materias en el select del filtro
  async cargarMaterias() {
    try {
      const materiasDisponibles = await this.inscripcionesService.obtenerMaterias();
      this.materiasLista = materiasDisponibles;
    } catch (error) {
      console.error('Error al cargar materias:', error);
    }
  }

  // Método para obtener el nombre de la materia desde una inscripción
  obtenerNombreMateria(inscripcion: any): string {
    return inscripcion?.llamado?.materia_llamado?.nombre_materia || 'Desconocido';
  }


  // Obtiene la lista de materias 
  get materias(): string[] {
    return [...new Set(this.inscriptos.map(i => i.asignatura))];
  }

  // Método para filtrar los inscriptos por asignatura
  filtrarInscriptos() {
    if (!this.filtroAsignatura) return this.inscriptos;

    const filtroId = Number(this.filtroAsignatura);

    return this.inscriptos.filter(inscripto => {

      return inscripto.llamado?.materia_llamado?.id === filtroId;
    });
  }


  // Método para cargar el nombre de la carrera en el PDF
  obtenerNombreCarrera(id: number | null): string {
    if (!id) return '';
    console.log("Carreras", this.carreras);
    const carrera = this.carreras.find(m => Number(m.id) === id);
    return carrera ? carrera.nombre_carrera : 'Desconocido';
  }

  // Generación de imagen en base64 para PDF
  getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        let dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }

  // Método para generar el PDF
  // Se utiliza la librería pdfMake para generar el PDF
  async generarPDF(inscripto: any) {
    const base64Logo = await this.getBase64ImageFromURL('assets/logo.png');

    const styles: { [key: string]: any } = {
      header: {
        fontSize: 18,
        bold: true,
        margin: [10, 0, 0, 0]
      },
      title: {
        fontSize: 14,
        bold: false,
        margin: [10, 10, 0, 5]
      },
      table: {
        margin: [10, 5, 0, 15]
      },
      logo: {
        alignment: 'right',
        margin: [10, 0, 0, 20]
      }
    };

    const sinBordes = {
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0
      }
    };

    const docDefinition = {
      content: [
        {
          image: base64Logo,
          width: 50,
          style: 'logo',
        },
        {
          text: 'Formulario de Inscripción Ayudante Alumno Ad Honorem',
          style: 'header',
        },
        { text: 'Asignatura: ' + this.obtenerNombreMateria(inscripto), style: 'title' },

        { text: 'Datos Personales', style: 'title' },
        {
          style: 'table',
          ...sinBordes,
          table: {
            widths: ['auto', '*'],
            body: [
              ['Nombre:', inscripto.nombre],
              ['Apellido:', inscripto.apellido],
              ['Tipo de Documento:', inscripto.tipo_documento],
              ['DNI:', inscripto.documento],
              ['Teléfono:', inscripto.telefono],
              ['Correo Electrónico:', inscripto.correo_electronico]
            ]
          }
        },

        { text: 'Datos Académicos', style: 'title' },
        {
          style: 'table',
          ...sinBordes,
          table: {
            widths: ['auto', '*'],
            body: [
              ['Legajo:', inscripto.nro_legajo],
              ['Carrera:', this.obtenerNombreCarrera(inscripto.carrera)],
              ['Porcentaje de Aprobación:', `${inscripto.porcentaje} %`],
              ['Conectividad:', inscripto.conectividad],
              ['Dispositivo Principal:', inscripto.dispositivos],
              ['Beca:', inscripto.beca ? 'Posee' : 'No posee']
            ]
          }
        }
      ],
      styles: styles,
    };
    pdfMake.createPdf(docDefinition).open();
    //pdfMake.createPdf(docDefinition).download(`inscripcion_${inscripto.apellido}_${inscripto.nombre}.pdf`);
  }


}
