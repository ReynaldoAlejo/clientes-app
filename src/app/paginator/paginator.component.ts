import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input() paginator: any;

  paginas: number[] = [];

  desde: number = 0;
  hasta: number = 0;
  MAX_PAGINAS = 4;

  constructor() {}

  ngOnInit(): void {
    this.initPaginator();
  }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    let paginadorActualizado = simpleChanges['paginator'];
    if (paginadorActualizado.previousValue) {
      this.initPaginator();
    }
  }

  private initPaginator(): void {
    /* this.desde= Math.min(Math.max(1,this.paginator.number-4),this.paginator.totalPages-5);
    this.hasta= Math.max(Math.min(this.paginator.totalPages,this.paginator.number+4,6));

    if(this.paginator.totalPages>5){
      this.paginas=new Array(this.hasta-this.desde+1).fill(0).map((_valor,indice)=>indice+this.desde);
    }else{
      this.paginas=new Array(this.paginator.totalPages).fill(0).map((_valor,indice)=>indice+1);
    }*/
    if (this.paginator.totalPages > this.MAX_PAGINAS) {
      this.desde = Math.min(
        Math.max(0, this.paginator.number - Math.trunc(this.MAX_PAGINAS / 2)),
        this.paginator.totalPages - this.MAX_PAGINAS
      );
      this.hasta = Math.max(
        Math.min(
          this.paginator.number + Math.trunc((this.MAX_PAGINAS + 1) / 2),
          this.paginator.totalPages
        ),
        this.MAX_PAGINAS
      );
      this.paginas = new Array(this.hasta - this.desde)
        .fill(0)
        .map((valor, indice) => indice + 1 + this.desde);
    } else {
      this.paginas = new Array(this.paginator.totalPages)
        .fill(0)
        .map((valor, indice) => indice + 1);
    }
  }
}
