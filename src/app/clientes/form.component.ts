import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2'
import { Region } from './region';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {

  titulo:string='Formulario';
  cliente:Cliente= new Cliente();
  regiones:Region[]=[];
  errores:string[]=[];

  constructor(
    private clienteService:ClienteService,
    private router:Router,
    private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe(regiones => this.regiones=regiones);
  }

  cargarCliente():void{
    this.activatedRoute.params.subscribe(params=>{
      let id = params['id'];
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente)=>{
          this.cliente=cliente
        })
      }
    })
  }

  create():void{
    this.clienteService.create(this.cliente)
    .subscribe(cliente=> {

      this.router.navigate(['/clientes'])
      Swal.fire('Nuevo cliente',`Cliente ${cliente.nombre} creado con éxito`,'success')
    },
    err=>{
      this.errores=err.error.errors as string[];
      console.error('Código del error desde el backend: '+err.status);
      console.error(err.error.errors);
    }
    );
  }

  update():void{

    this.cliente.facturas=null;
    this.clienteService.update(this.cliente)
    .subscribe(json=>{
      this.router.navigate(['/clientes'])
      Swal.fire('Cliente actualizado',`Cliente ${json.cliente.nombre} actualizado con éxito`,'success')
    },
    err=>{
      this.errores=err.error.errors as string[];
      console.error('Código del error desde el backend: '+err.status);
      console.error(err.error.errors);
    }
    );
  }

  compararRegion(o1:Region,o2:Region):boolean{
    if(o1===undefined&&o2===undefined){
      return true;
    }
    return o1==null|| o2==null? false:o1.id===o2.id;
  }

}
