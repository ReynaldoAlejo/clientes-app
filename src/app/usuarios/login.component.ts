import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo:string = 'Por favor Sign in!';
  usuario:Usuario;


  constructor(private authService:AuthService, private router:Router) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      Swal.fire('Error Login',`Hola ${this.authService.usuario.username}, ya estás autenticado`,'info');
      this.router.navigate(['/clientes']);
    }
  }

  login():void{
    console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.password == null) {
      Swal.fire('Error Login','Username o password vacias!','error');
      return;
    }

    this.authService.login(this.usuario).subscribe(
      response => {

        console.log(response);

        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);

        let usuario = this.authService.usuario;

        this.router.navigate(['/clientes']);
        Swal.fire('Login',`Hola ${usuario.username}, has inicado sesión con éxito`,'success');
      },
      err => {
        if (err.status == 400) {
          Swal.fire('Error Login','Username o password incorrectas','error');
        }
      }
    );
  }
}
