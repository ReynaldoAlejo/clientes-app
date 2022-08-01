import { Factura } from '../facturas/models/factura';
import { Region } from './region';

export class Cliente {
  id: number;
  nombre: string;
  apellido: string;
  createAt: string;
  email: string;
  foto: string;
  region: Region;
  facturas: Array<Factura>= [];

  constructor() {
    this.id = 0;
    this.nombre = '';
    this.apellido = '';
    this.createAt = '';
    this.email = '';
    this.foto = '';
    this.region = new Region();
  }
}
