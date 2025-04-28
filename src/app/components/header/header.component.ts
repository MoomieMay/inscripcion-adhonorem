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
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }
  

  /* async checkSession() {
    const userRole = await this.authService.getUserRole();
    if (userRole) {
      console.log('User role:', userRole);
    } else {
      console.error('Failed to retrieve user role');
    }
  } */

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      this.toastr.success('Inicio de sesión exitoso ✅');
      this.router.navigate(['/lista-inscriptos']);
    } catch (error) {
      console.error(error);
      this.toastr.error('Credenciales incorrectas ❌');
    }
  }
  async logout() {
    await this.authService.logout();
    this.toastr.info('Sesión finalizada');
    this.router.navigate(['/']);
  }
}
