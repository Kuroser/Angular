import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ILibro } from 'src/app/modelos/libro';

@Component({
  selector: 'app-minilibro',
  templateUrl: '../../vistas/zonaTienda/minilibro.component.html',
  styleUrls: ['../../vistas/zonaTienda/css/minilibro.component.css']
})
export class MinilibroComponent implements OnInit {

   @Input() libroApintar?: ILibro;
   @Output() libroAcomprar:EventEmitter<ILibro>=new EventEmitter<ILibro>();
  constructor() { }

  ngOnInit(): void {
  }
  comprarLibro(libro?:ILibro){
    console.log("Emite correctamente....... "+libro);
    this.libroAcomprar.emit(libro);
  }
}
