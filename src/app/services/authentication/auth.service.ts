import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userRole: string | null = null;

  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
    this.checkSession();

    // Escuchar cambios de sesión en tiempo real
  this.supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      this.isLoggedInSubject.next(true);
      this.currentUserEmail = session.user.email || null;
    } else {
      this.isLoggedInSubject.next(false);
      this.currentUserEmail = null;
    }
  });
  }

  private async checkSession() {
    const { data: { session }, error } = await this.supabase.auth.getSession();
    if (session?.user) {
      this.isLoggedInSubject.next(true);
      this.currentUserEmail = session.user.email || null;
    } else {
      this.isLoggedInSubject.next(false);
      this.currentUserEmail = null;
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  async getUserRole(): Promise<string | null> {
    if (this.userRole) {
      return this.userRole;
    }

    const { data: { user }, error } = await this.supabase.auth.getUser();
    if (error || !user) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }

    this.userRole = user.user_metadata?.['role'] || null;
    return this.userRole;
  }

  async login(email: string, password: string) {
    try {
      const { data: { user }, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error || !user) {
        throw new Error('Error al iniciar sesión');
      }
  
      this.currentUserEmail = user.email || null;
      this.isLoggedInSubject.next(true);
  
      this.router.navigate(['/gestion-llamados']); // o la ruta principal para usuarios autenticados
    } catch (error) {
      console.error('Error en login:', error);
    }
  }
  

  private currentUserEmail: string | null = null;

  getCurrentUserEmail() {
    return this.currentUserEmail;
  }


  async logout() {
    await this.supabase.auth.signOut();
    this.isLoggedInSubject.next(false);
    this.userRole = null;
    this.router.navigate(['/']);
  }
}
