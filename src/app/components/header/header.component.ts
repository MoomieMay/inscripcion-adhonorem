import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  texto: string = "Inscripción Alumno Ayudante Ad Honorem"
  email = '';
  password = '';
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.checkSession();
  }

  async checkSession() {
    const { data, error } = await this.authService.getUser();
    this.isLoggedIn = !!data?.user;
  }

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      this.toastr.success('Inicio de sesión exitoso ✅');
      this.isLoggedIn = true;
      this.router.navigate(['/lista-inscriptos']);
    } catch (error) {
      console.error(error);
      this.toastr.error('Credenciales incorrectas ❌');
    }
  }
  async logout() {
    await this.authService.logout();
    this.isLoggedIn = false;
    this.toastr.info('Sesión finalizada');
    this.router.navigate(['/llamados']);
  }
}
