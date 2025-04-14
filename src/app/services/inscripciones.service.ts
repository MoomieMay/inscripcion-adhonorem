import { Injectable } from '@angular/core';
import { supabase } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class InscripcionesService {

  constructor() {}

  async crearInscripcion(formData: any, asignatura: string) {
    // Armamos el objeto sin el campo "id", y le agregamos la asignatura
    const inscripcion = {
      ...formData,
      asignatura: asignatura
    };

    // Enviamos los datos a Supabase
    const { data, error } = await supabase
      .from('inscripciones')
      .insert(inscripcion)
      .select(); // Esto hace que devuelva el registro insertado (incluido el id)

    if (error) {
      console.error('Error al crear la inscripción:', error);
      throw new Error(error.message);
    }

    return data[0]; // Retornamos el objeto completo (podés usar data[0].id)
  }

  async obtenerInscripcionesPorAsignatura(asignatura: string) {
    const { data, error } = await supabase
      .from('inscripciones')
      .select('*')
      .eq('asignatura', asignatura);

    if (error) {
      console.error('Error al obtener las inscripciones:', error);
      throw new Error(error.message);
    }

    return data;
  }
  async obtenerInscripciones() {
    const { data, error } = await supabase
      .from('inscripciones')
      .select('*')

    if (error) {
      console.error('Error al obtener la inscripción:', error);
      throw new Error(error.message);
    }

    return data;
  }
}
