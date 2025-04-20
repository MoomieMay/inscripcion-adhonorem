import { Component, OnInit } from '@angular/core';
import { InscripcionesService } from 'src/app/services/inscripciones/inscripciones.service';
import { LlamadosService } from 'src/app/services/llamados/llamados.service';

@Component({
  selector: 'app-table-resultados',
  templateUrl: './table-resultados.component.html',
  styleUrls: ['./table-resultados.component.css']
})
export class TableResultadosComponent implements OnInit {
  resultados: any[] = [];
  llamadosVencidos: any[] = [];
  llamadosVencidosFiltrados: any[] = [];

  constructor(
    private inscripcionesService: InscripcionesService,
    private llamadosService: LlamadosService
  ) { }

  ngOnInit(): void {
    this.cargarLlamados();
  }

  async cargarLlamados() {
    try {
      const todos = await this.llamadosService.obtenerTodosLosLlamados();
      const hoy = new Date();
  
      this.llamadosVencidos = todos.filter(c => new Date(c.cierre_llamado) < hoy);
  
      // Formatear la fecha de los llamados vencidos
      this.llamadosVencidos = this.llamadosVencidos.map((llamado: any) => ({
        ...llamado,
        cierre_llamado: this.formatearFecha(llamado.cierre_llamado),
      }));
  
      this.llamadosVencidos = await Promise.all(
        this.llamadosVencidos.map(async (llamado: any) => {
          // Traemos inscriptos
          const inscriptos = await this.inscripcionesService.obtenerInscriptosPorLlamado(llamado.id);
  
          // Separar los que tienen puntaje y los que no
          const inscriptosConPuntaje = inscriptos.filter((i: any) => i.puntaje !== null);
  
          return {
            ...llamado,
            inscriptos: inscriptos.map((i: any) => ({
              nombre: i.nombre,
              apellido: i.apellido,
              puntaje: i.puntaje,
            })),
            inscriptosConPuntaje: inscriptosConPuntaje.map((i: any) => ({
              nombre: i.nombre,
              apellido: i.apellido,
              puntaje: i.puntaje,
            })),
          };
        })
      );
  
      // AHORA sí filtramos para la tabla:
      this.llamadosVencidosFiltrados = this.llamadosVencidos.filter(
        llamado =>
          llamado.inscriptos.length === 0 || // ✅ Mostrar si NO tiene inscriptos
          llamado.inscriptosConPuntaje.length > 0 // ✅ Mostrar si hay inscriptos CON puntaje
      );
  
    } catch (error) {
      console.error('Error cargando llamados:', error);
    }
  }
  
  

  // Método para formatear la fecha en formato DD-MM-AAAA
  private formatearFecha(fecha: string): string {
    const date = new Date(fecha + "T00:00:00");
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }
}
