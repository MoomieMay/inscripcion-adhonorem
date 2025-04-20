// Maneja la lógica de los llamados y resultados, las materias, las carreras y las escuelas.
import { Injectable } from '@angular/core';
import { supabase } from '../supabase.service';

@Injectable({
  providedIn: 'root',
})

export class LlamadosService {
  constructor() { }

  // CREATE
  // Carga un nuevo dato en la tabla llamados
  async crearLlamado(llamado: any) {
    const { error } = await supabase
      .from('llamados')
      .insert(llamado);

    if (error) {
      console.error('Error al crear llamado:', error);
      throw new Error(error.message || 'Error desconocido al crear convocatoria');
    }
  }

  // READ
  //Trae de la base todos los datos de la tabla Llamados
  async obtenerTodosLosLlamados() {
    const { data, error } = await supabase
      .from('llamados')
      .select(`
        *,
        materias (
          id,
          nombre_materia,
          carrera_materia (
            id,
            nombre_carrera,
            escuela_carrera (
              id,
              nombre_escuela
            )
          )
        )
      `);
    if (error) {
      throw new Error('Error al obtener los llamados');
    }

    // Agregar formateo de la fecha y obtener los nombres relacionados
    const llamadosConDetalles = data.map((llamado: any) => {
      return {
        ...llamado,
        nombre_materia: llamado.materias?.nombre_materia || 'Materia no encontrada',
        nombre_escuela: llamado.materias?.carrera_materia?.escuela_carrera?.nombre_escuela || 'Escuela no encontrada',
      };
    });

    return llamadosConDetalles;
  }

  // Obtiene una Llamado específica por su ID
  async obtenerLlamadoPorId(id: string) {
    const { data, error } = await supabase
      .from('llamados')
      .select(`
        id,
        nombre_responsable,
        apellido_responsable,
        legajo_responsable,
        porcentaje,
        materia_llamado (
          id,
          nombre_materia,
          codigo_materia,
          carrera_materia (
            id,
            nombre_carrera,
            escuela_carrera (
              id,
              nombre_escuela
            )
          )
        ),
        periodo,
        cierre_llamado
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error('Error al obtener el llamado');
    }

    return data;
  }

  // UPDATE
  // Actualiza un llamado existente
  async actualizarLlamado(id: string, llamado: any) {
    const { error } = await supabase
      .from('llamados')
      .update(llamado)
      .eq('id', id);

    if (error) {
      throw new Error('Error al actualizar convocatoria');
    }
  }

  // DELETE
  // Elimina un llamado
  async eliminarLlamado(id: string) {
    const { error, data } = await supabase
      .from('llamados')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      throw new Error('Error al eliminar llamado');
    }

    if (!data || data.length === 0) {
      throw new Error('No se encontró el llamado para eliminar');
    }
  }


  // Métodos para obtener datos de otras tablas
  async obtenerEscuelas() {
    const { data, error } = await supabase.from('escuelas').select('*');
    if (error) throw new Error('Error al cargar escuelas');
    return data;
  }

  async obtenerCarreras() {
    const { data, error } = await supabase.from('carreras').select('*');
    if (error) throw new Error('Error al cargar carreras');
    return data;
  }

  async obtenerMaterias() {
    const { data, error } = await supabase.from('materias').select('*');
    if (error) throw new Error('Error al cargar materias');
    return data;
  }

  async obtenerNombreMateria(idLlamado: string) {
    const { data, error } = await supabase
      .from('llamados')
      .select('materia_llamado, materias(nombre_materia)')
      .eq('id', idLlamado)
      .single();

    if (error) {
      throw new Error('Error al obtener el nombre de la materia');
    }

    return data?.materias?.[0]?.nombre_materia || '';

  }
}

