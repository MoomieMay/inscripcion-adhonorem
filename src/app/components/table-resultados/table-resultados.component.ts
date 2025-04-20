import { Component, OnInit } from '@angular/core';
import { LlamadosService } from 'src/app/services/llamados/llamados.service';

@Component({
  selector: 'app-table-resultados',
  templateUrl: './table-resultados.component.html',
  styleUrls: ['./table-resultados.component.css']
})
export class TableResultadosComponent implements OnInit {
  resultados: any[] = [];
  llamadosVencidos: any[] = [];

  constructor(private llamadosService: LlamadosService) {}

  ngOnInit(): void {
    this.cargarLlamados();
  }

  async cargarLlamados() {
    try {
      const todos = await this.llamadosService.obtenerTodosLosLlamados();
      console.log('Todos los llamados:', todos);
      const hoy = new Date();

      this.llamadosVencidos = todos.filter(c => new Date(c.cierre_llamado) < hoy);

      // Formatear la fecha de los llamados vencidos
      this.llamadosVencidos = this.llamadosVencidos.map((llamado: any) => ({
        ...llamado,
        cierre_llamado: this.formatearFecha(llamado.cierre_llamado),
      }));

      this.llamadosVencidos = await Promise.all(
        this.llamadosVencidos.map(async (llamado: any) => {
          // Usamos el service para traer inscriptos
          const inscriptos = await this.llamadosService.obtenerInscriptosPorLlamado(llamado.id);
  
          return {
            ...llamado,
            inscriptos: inscriptos.map((i: any) => ({
              nombre: i.nombre,
              apellido: i.apellido,
            })),
          };
        })
      );
  
      console.log('Llamados vencidos con inscriptos:', this.llamadosVencidos);

      //cachi
    } catch (error) {
      console.error('Error al cargar los llamados:', error);
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
