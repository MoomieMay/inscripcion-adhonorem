import { Injectable } from '@angular/core';
import { supabase } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class ConvocatoriasService {
  
  async obtenerTodasLasConvocatorias() {
    const { data, error } = await supabase
      .from('convocatorias')
      .select('*');

    if (error) {
      throw new Error('Error al obtener las convocatorias');
    }

    return data;
  }

  async crearConvocatoria(convocatoria: any) {
    const { error } = await supabase
      .from('convocatorias')
      .insert(convocatoria);

    if (error) {
      throw new Error('Error al crear convocatoria');
    }
  }
}

