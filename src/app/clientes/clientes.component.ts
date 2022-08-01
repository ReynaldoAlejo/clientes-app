import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';
import { AuthService } from '../usuarios/auth.service';
import { URL_BACKEND } from '../config/config';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {

  clientes:Cliente[]=[];
  paginator:any;
  clienteSeleccionado:Cliente=new Cliente();
  urlBackend:string=URL_BACKEND;

  constructor(public clienteService:ClienteService,private activatedRoute:ActivatedRoute, public modalService:ModalService, public authService: AuthService) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params=>{
      let page:number=+params.get('page')!|0;
      if(!page){
        page=0;
      }
      this.clienteService.getClientes(page).subscribe(
        response=>{
          this.clientes=response.content as Cliente[];
          this.paginator=response;
        }
      );
    });

    this.modalService.notificarUpload.subscribe(cliente =>{
      this.clientes= this.clientes.map(clienteOriginal => {
        if(cliente.id==clienteOriginal.id){
          clienteOriginal.foto=cliente.foto;
        }
        return clienteOriginal;
      })
    })

    //con tap
    /*this.clienteService.getClientes().pipe(
      tap(clientes=> this.clientes=clientes)
    ).subscribe();*/
  }

  delete(cliente:Cliente):void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Está seguro?',
      text: `¿Seguro que desea eliminar el cliente ${cliente.nombre} ${cliente.apellido} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        this.clienteService.delete(cliente.id).subscribe(
          reponse=>{
            this.clientes=this.clientes.filter(cli=> cli!==cliente);
            swalWithBootstrapButtons.fire(
              'Cliente eliminado',
              `Cliente ${cliente.nombre} eliminado con éxito `,
              'success'
            )
          }
        );
      }
    })
  }

  abrirModal(cliente:Cliente){
    this.clienteSeleccionado=cliente;
    this.modalService.abrilModal();
  }

}
