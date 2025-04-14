import { Component, OnInit } from '@angular/core';
import { InscripcionesService } from 'src/app/services/inscripciones.service';
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

  constructor(private inscripcionesService: InscripcionesService) { }

  ngOnInit(): void {
    this.cargarInscriptos();
  }

  async cargarInscriptos() {
    try {
      const inscripciones = await this.inscripcionesService.obtenerInscripciones();
      this.inscriptos = inscripciones;
    } catch (error) {
      console.error('Error al cargar las convocatorias:', error);
    }
  }

  filtroAsignatura: string = '';

  get materias(): string[] {
    return [...new Set(this.inscriptos.map(i => i.asignatura))];
  }

  filtrarInscriptos() {
    if (!this.filtroAsignatura) return this.inscriptos;
    return this.inscriptos.filter(i => i.asignatura === this.filtroAsignatura);
  }

  generarPDF(inscripto: any) {
    const styles: { [key: string]: any } = {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 0]
      },
      title: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      table: {
        margin: [0, 5, 0, 15]
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
          text: 'Formulario de Inscripción Ayudante Alumno Ad Honorem',
          style: 'header',
        },
        { text: 'Asignatura: ' + inscripto.asignatura, style: 'title' },

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
              ['Carrera:', inscripto.carrera],
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

    console.log('Inscripto:', inscripto);
    console.log('PDF generado');
    pdfMake.createPdf(docDefinition).open();

    //pdfMake.createPdf(docDefinition).download(`inscripcion_${inscripto.apellido}_${inscripto.nombre}.pdf`);
  }


}
