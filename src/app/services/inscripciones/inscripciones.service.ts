// Maneja la lógica de las inscripciones, las materias, las carreras y las escuelas.
import { Injectable } from '@angular/core';
import { supabase } from '../supabase.service';

@Injectable({
  providedIn: 'root',
})
export class InscripcionesService {
  constructor() { }

  // CREATE
  // Método para crear una inscripción en la base de datos
  async crearInscripcion(formData: any, idLlamado: number | null) {
    // Armamos el objeto sin el campo "id", y le agregamos la asignatura
    const inscripcion = {
      ...formData,
      id_llamado: idLlamado
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

  // READ
  // Método para obtener todas las inscripciones
  async obtenerInscripciones() {
    const { data, error } = await supabase
      .from('inscripciones')
      .select(`
        *,
        llamado: id_llamado (
          *,
          materia_llamado: materia_llamado (
            id,
            nombre_materia
          )
        )
      `)

    if (error) {
      console.error('Error al obtener la inscripción:', error);
      throw new Error(error.message);
    }

    return data;
  }

  // Método para obtener las inscripciones por asignatura
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

  // Método para obtener las inscripciones asociadas a un llamado
  async obtenerInscripcionesPorLlamado(idLlamado: Number) {
    const { data, error } = await supabase
      .from('inscripciones')
      .select('id, nombre, apellido, documento')
      .eq('id_llamado', idLlamado);

    if (error) {
      console.error('Supabase error:', error.message);
      throw new Error('Error al obtener inscripciones');
    }

    return data || [];
  }



  // PDF
  // Método para obtener todas las carreras de la base de datos
  async obtenerCarreras() {
    const { data, error } = await supabase
      .from('carreras')
      .select('*');

    if (error) {
      console.error('Error al obtener las carreras:', error);
      throw new Error(error.message);
    }

    return data;
  }

  // Método para obtener todas las materias de la base de datos
  async obtenerMaterias() {
    const { data, error } = await supabase
      .from('materias')
      .select('id, nombre_materia')
      .order('nombre_materia', { ascending: true });

    if (error) {
      console.error('Error al obtener las carreras:', error);
      throw new Error(error.message);
    }

    return data;
  }

}

