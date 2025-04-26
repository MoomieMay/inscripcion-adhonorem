// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { supabase } from '../supabase.service';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  async logout() {
    await supabase.auth.signOut();
  }

  getUser() {
    return supabase.auth.getUser();
  }

  getSession() {
    return this.supabase.auth.getSession();
  }
}
