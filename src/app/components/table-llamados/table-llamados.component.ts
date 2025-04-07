import { Component, OnInit } from '@angular/core';
import { ConvocatoriasService } from 'src/app/services/convocatorias.service';

@Component({
  selector: 'app-table-llamados',
  templateUrl: './table-llamados.component.html',
  styleUrls: ['./table-llamados.component.css']
})
export class TableLlamadosComponent implements OnInit {
  convocatoriasVigentes: any[] = [];
  convocatoriasVencidas: any[] = [];

  constructor(private convocatoriasService: ConvocatoriasService) {}

  ngOnInit(): void {
    this.cargarConvocatorias();
  }

  async cargarConvocatorias() {
    try {
      const todas = await this.convocatoriasService.obtenerTodasLasConvocatorias();
      const hoy = new Date();

      this.convocatoriasVigentes = todas.filter(c => new Date(c.cierre) >= hoy);
      this.convocatoriasVencidas = todas.filter(c => new Date(c.cierre) < hoy);
    } catch (error) {
      console.error('Error al cargar las convocatorias:', error);
    }
  }
}
