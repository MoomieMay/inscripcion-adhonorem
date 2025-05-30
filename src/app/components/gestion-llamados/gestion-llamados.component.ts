import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LlamadosService } from 'src/app/services/llamados/llamados.service';
import { InscripcionesService } from 'src/app/services/inscripciones/inscripciones.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-gestion-llamados',
  templateUrl: './gestion-llamados.component.html',
  styleUrls: ['./gestion-llamados.component.css']
})
export class GestionLlamadosComponent implements OnInit {
  id!: string;
  llamadosVigentes: any[] = [];
  llamadosVencidos: any[] = [];

  constructor(
    private llamadosService: LlamadosService,
    private inscripcionesService: InscripcionesService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.cargarLlamados();
  }

  async cargarLlamados() {
    try {
      const todos = await this.llamadosService.obtenerTodosLosLlamados();
      console.log('Todos los llamados:', todos);
      const hoy = new Date();

      this.llamadosVigentes = todos.filter(c => new Date(c.cierre_llamado) >= hoy);
      this.llamadosVencidos = todos.filter(c => new Date(c.cierre_llamado) < hoy);

      // Llamados vigentes
      this.llamadosVigentes = this.llamadosVigentes.map((llamado: any) => ({
        ...llamado,
        cierre_llamado: this.formatearFecha(llamado.cierre_llamado),
      }));


      // Llamados vencidos
      this.llamadosVencidos = await Promise.all(
        this.llamadosVencidos.map(async (llamado: any) => ({
          ...llamado,
          cierre_llamado: this.formatearFecha(llamado.cierre_llamado),
          inscriptos: await this.inscripcionesService.obtenerInscriptosYResultadosPorLlamado(llamado.id),
        }))
      );

    } catch (error) {
      console.error('Error al cargar los llamados:', error);
    }
  }

  // Método para devolver si hay inscriptos sin puntaje 
  tieneInscriptosSinPuntaje(llamado: any): boolean {
    if (!llamado.inscriptos || llamado.inscriptos.length === 0) {
      console.log('No hay inscriptos para llamado:', llamado);
      return false;
    }
    console.log('Inscriptos para llamado:', llamado.inscriptos);
    return llamado.inscriptos.some((inscripto: any) => inscripto.puntaje === null || inscripto.puntaje === undefined);
  }

  tieneResultadosCargados(llamado: any): boolean {
    if (!llamado.inscriptos || llamado.inscriptos.length === 0) {
      console.log('No hay inscriptos para llamado:', llamado);
      return false;
    }
  
    // Verificamos si al menos uno tiene puntaje diferente de null o undefined
    console.log('Inscriptos para llamado:', llamado.inscriptos);
    return llamado.inscriptos.some((inscripto: any) => inscripto.puntaje !== null && inscripto.puntaje !== undefined);
  }
  

  // Ordenar inscriptos de mayor a menor puntaje
  ordenarPorPuntaje(inscriptos: any[]): any[] {
    return inscriptos
      .filter(inscripto => inscripto.puntaje !== null && inscripto.puntaje !== undefined)
      .sort((a, b) => b.puntaje - a.puntaje); // De mayor a menor
  }


  // Método para formatear la fecha en formato DD-MM-AAAA
  private formatearFecha(fecha: string): string {
    const date = new Date(fecha + "T00:00:00");
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }

  // Método para eliminar el llamado
  async eliminarLlamado(id: string) {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',  
      cancelButtonColor: '#d33',      
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      try {
        await this.llamadosService.eliminarLlamado(id);
        this.toastr.success('✅ Llamado eliminado exitosamente', '¡Éxito!');
        await this.cargarLlamados();
      } catch (error) {
        console.error(error);
        this.toastr.error('❌ Error al eliminar el llamado', 'Error');
      }
    }
  }

}
