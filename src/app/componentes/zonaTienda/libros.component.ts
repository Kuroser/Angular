import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ILibro } from 'src/app/modelos/libro';
import { CloudfirebaseService } from 'src/app/servicios/cloudfirebase.service';

@Component({
  selector: 'app-libros',
  templateUrl: '../../vistas/zonaTienda/libros.component.html',
  styleUrls: ['../../vistas/zonaTienda/css/libros.component.css']
})
export class LibrosComponent implements OnInit {

  //tengo q extraer de la url /Tienda/Libros/nombre_materia/IdMateria
  //ultimos dos segmentos, usar el servicio de acceso a firebase y recuperar
  //los libros de esa materia y pintarlos

  public listaTuplasLibros:Array<ILibro[]>=[];
  constructor(private _db:CloudfirebaseService, private _activatedrouter:ActivatedRoute) { }

  ngOnInit(): void {
    let _idMateria: string| null; //<---- extraer de la url...
    this._activatedrouter.paramMap.subscribe((parametros:ParamMap)=>{
         console.log('parametros ruta...',parametros);
         
        _idMateria=parametros.get('idmateria');
        if(_idMateria){
            this._db.devolverLibros('IdMateria',_idMateria).subscribe(
              (libros:Array<ILibro>)=>{
                                        console.log('lista libros recuperada de filibros----',libros);
                                        for (let index = 0; index < libros.length; index+=3) {
                                            this.listaTuplasLibros.push(libros.slice(index,index+3));
                                        }
                                      });
        } //cierre-if
      });
  }

  prepararCompra(libro:ILibro){
    console.log("Libro cargado... ");
    console.log(libro);
  }
}
