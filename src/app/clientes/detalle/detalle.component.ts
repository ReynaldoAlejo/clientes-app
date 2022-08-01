import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from '../../usuarios/auth.service';
import { FacturaService } from 'src/app/facturas/services/factura.service';
import { Factura } from 'src/app/facturas/models/factura';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html'
})
export class DetalleComponent implements OnInit {

  @Input()cliente : Cliente= new Cliente();

  titulo:string="Detalle del cliente";
  fotoSeleccionada:File=new File([],'');
  progreso:number=0;

  constructor(private clienteService: ClienteService,public modalService:ModalService, public authService:AuthService, private facturaService: FacturaService) { }

  ngOnInit(): void {

    //por el modal ya no va
    /*this.activatedRoute.paramMap.subscribe(params => {
      let id = + params.get('id')!;
      if (id) {
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente;
        });
      }
    })*/
  }

  seleccionarFoto(event:any){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso=0;
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image')<0) {
      Swal.fire('Error Seleccionar imagen: ','El archivo debe ser de tipo imagen','error');
      this.fotoSeleccionada=null!;
    }

  }

  subirFoto(){
    if(!this.fotoSeleccionada){
      Swal.fire('Error Upload: ','Debe seleccionar una foto','error');
    }else{
      this.clienteService.subirFoto(this.fotoSeleccionada,this.cliente.id).subscribe(event => {
        if(event.type=== HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/(event.total ?? 0))*100)
        }else if (event.type===HttpEventType.Response) {
          let response : any = event.body;
          this.cliente = response.cliente as Cliente;

          this.modalService.notificarUpload.emit(this.cliente);
          Swal.fire('La foto se ha subido completamente! ',response.mensaje,'success');
        }
      });
    }

  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada=null!;
    this.progreso=0;
  }

  delete(factura: Factura){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Está seguro?',
      text: `¿Seguro que desea eliminar la factura ${factura.descripcion}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        this.facturaService.delete(factura.id).subscribe(
          ()=>{
            this.cliente.facturas=this.cliente.facturas.filter(f=> f!=factura);
            swalWithBootstrapButtons.fire(
              'Factura eliminada',
              `Factura ${factura.id} eliminada con éxito `,
              'success'
            )
          }
        );
      }
    })
  }
}
