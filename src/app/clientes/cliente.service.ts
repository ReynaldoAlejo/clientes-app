import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map, catchError,tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from './region';
import { AuthService } from '../usuarios/auth.service';
import { URL_BACKEND } from '../config/config';


@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private urlEndPoint: string = URL_BACKEND+'/api/clientes';
  //especifica el tipo de contenido que viene desde el backedn
  //por defecto es json, asi que se puede prescindir de este.Se
  //utiliza cuendo lo que regresamos del back es de otro tipo de dato
  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  // como ya tenemos interceptores podemos obviar el met
  // private agregarAuthorizationHeader(){
  //   let token = this.authService.token;

  //   if (token != null) {
  //     return this.httpHeaders.append('Authorization', 'Bearer '+ token);
  //   }
  //   return this.httpHeaders;
  // }

  /*getClientes(): Observable<Cliente[]> {
    //Primera forma
    //return this.http.get<Cliente[]>(this.urlEndPoint);
    //Segunda forma
    return this.http.get(this.urlEndPoint).pipe(
      tap(response=>{
        let clientes= response as Cliente[];
        console.log('ClienteService: tap 1');
        clientes.forEach(
          cliente=>{
            console.log(cliente.nombre);
          }
        )
      }),
      map(response=>response as Cliente[])
    )
  }*/

  //Esta es una manera, la otra es mediante
  //HtttpInterceptors
  /*isNoAutorizado(e:any):boolean{
    if (e.status==401){
      //si es que vence el token
      if (this.authService.isAuthenticated()) {
        this.authService.logout();
      }
      this.router.navigate(['/login']);
      return true;
    }
    if (e.status==403){
      Swal.fire('Acceso denegado',`Hola ${this.authService.usuario.username}, no tienes acceso a este recurso`,'warning');
      this.router.navigate(['/clientes']);
      return true;
    }
    return false;
  }*/

  getRegiones():Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint+'/regiones');
  }

  //para usar con paginación
  getClientes(page:number): Observable<any> {
    return this.http.get(this.urlEndPoint+'/page/'+page).pipe(
      map((response:any)=>{response.content as Cliente[];
        console.log(response);
        return response;
      })
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http
      .post(this.urlEndPoint, cliente)
      .pipe(
        map((response: any) => response.cliente as Cliente),
        catchError((e) => {

          /*if (this.isNoAutorizado(e)) {
            return throwError(e);
          }*/
          if (e.status==400) {
            return throwError(e);
          }
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }

          //Swal.fire(e.error.mensaje,e.error.error,'error');
          return throwError(e);
        })
      );

    //e.error.mensaje,e.error.error,'error'
  }

  //cath error intersecta el observable en busca de fallos,se usa el met: pipe
  getCliente(id: any): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        /*if (this.isNoAutorizado(e)) {
          return throwError(e);
        }*/
        if(e.status != 401 && e.error.mensaje){
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
        }
        //Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http
      .put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente)
      .pipe(
        catchError((e) => {
          // if (this.isNoAutorizado(e)) {
          //   return throwError(e);
          // }
          if (e.status==400) {
            return throwError(e);
          }
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          //Swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`)
      .pipe(
        catchError((e) => {
          // if (this.isNoAutorizado(e)) {
          //   return throwError(e);
          // }
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          //Swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id:any):Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo",archivo);
    formData.append("id",id);
    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;

    if (token != null ) {
      httpHeaders = httpHeaders.append('Authorization','Bearer '+token);
    }

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`,formData, {
      reportProgress: true,
      headers: httpHeaders
    });

    return this.http.request(req);

    // return this.http.request(req).pipe(
    //   catchError(e => {
    //     this.isNoAutorizado(e);
    //     return throwError(e);
    //   })
    // );
  }


}
