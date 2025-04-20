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

  // Método para guardar resultados
  async guardarResultado(resultado: any[], id: number) {
    const { data, error } = await supabase
      .from('inscripciones')
      .update({ puntaje: resultado })
      .eq('id', id)
      .select(); 

    if (error) {
      console.error('Error al guardar resultados:', error);
      throw new Error(error.message);
    }

    return data;
  }

  // Método para obtener los inscriptos por llamado (Table Resultados)
  async obtenerInscriptosPorLlamado(idLlamado: number) {
    const { data, error } = await supabase
      .from('inscripciones')
      .select(`*`)
      .eq('id_llamado', idLlamado)
      .order('puntaje', { ascending: false });

    if (error) {
      console.error('Error al obtener inscriptos:', error);
      return [];
    }

    if (!data) return [];

    return data.map((item: any) => ({
      nombre: item.nombre,
      apellido: item.apellido,
      puntaje: item.puntaje,
    }));
  }

  // Método para traer inscriptos por llamado, aunque no tengan puntaje (Table Gestion Llamados)
  async obtenerInscriptosYResultadosPorLlamado(idLlamado: number) {
    const { data, error } = await supabase
      .from('inscripciones')
      .select(`*`)
      .eq('id_llamado', idLlamado);

    if (error) {
      console.error('Error al obtener inscriptos y resultados:', error);
      return [];
    }

    if (!data) return [];

    return data.map((item: any) => ({
      id: item.id,         // ID del inscripto (opcional si lo necesitas)
      nombre: item.nombre,
      apellido: item.apellido,
      puntaje: item.puntaje ?? null,       // Puntaje directo, si no hay lo deja como null
    }));
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

