import { Component, OnInit } from '@angular/core';
import { IMateria } from 'src/app/modelos/materia';
import { CloudfirebaseService } from 'src/app/servicios/cloudfirebase.service';

@Component({
  selector: 'app-opcionespanelmaterias',
  templateUrl: '../../vistas/zonaTienda/opcionespanelmaterias.component.html',
  styleUrls: ['../../vistas/zonaTienda/css/opcionespanelmaterias.component.css']
})
export class OpcionespanelmateriasComponent implements OnInit {

  public listaMaterias:Array<IMateria>=[]; //<----variable q usamos en la vista
  
  constructor(private _db:CloudfirebaseService) { }

  ngOnInit(): void {
    this._db.devolverMaterias(0).subscribe(
      (materias:IMateria[])=>this.listaMaterias=materias
    )

  }

}
