import { Component, OnInit } from '@angular/core';
import { LlamadosService } from 'src/app/services/llamados/llamados.service';

@Component({
  selector: 'app-table-llamados',
  templateUrl: './table-llamados.component.html',
  styleUrls: ['./table-llamados.component.css']
})
export class TableLlamadosComponent implements OnInit {
  llamadosVigentes: any[] = [];
  llamadosVencidos: any[] = [];

  constructor(private llamadosService: LlamadosService) { }

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

      // Formatear la fecha de los llamados vigentes
      this.llamadosVigentes = this.llamadosVigentes.map((llamado: any) => ({
        ...llamado,
        cierre_llamado: this.formatearFecha(llamado.cierre_llamado),
      }));

      // Formatear la fecha de los llamados vencidos
      this.llamadosVencidos = this.llamadosVencidos.map((llamado: any) => ({
        ...llamado,
        cierre_llamado: this.formatearFecha(llamado.cierre_llamado),
      }));
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
