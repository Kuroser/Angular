import { Component } from '@angular/core';
import { NavigationStart, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: '../vistas/app.component.html',
  styleUrls: ['../vistas/app.component.css']
})
export class AppComponent {
  //intercepto primer evento q se produce por el servicio de enrutamiento
  //nada mas poner el cliente en el navegador la url...NavigationStart
  //asi antes de cargar cualquier componente activo variables boolean para
  //cargar un panel de opciones de materias o de panel-cliente
  public muestraPanelMaterias:boolean=false;
  public toLoginRegistro:boolean=false;

  constructor(private _router:Router){
    /*
      -----------------------------------| pipe |-----------
      RouterEvent  RouterEvent ...                RouterEvent(NavigationStart)
      -----------------------------------|      |------------
    */
    this._router
        .events
        .pipe(
              filter( (events)=>events instanceof NavigationStart)
              )
        .subscribe(
            (evento)=>{
                
                (evento as RouterEvent).url.search('Cliente/Panel') != -1 ? this.muestraPanelMaterias=false : this.muestraPanelMaterias=true; 
                (evento as RouterEvent).url.search('Cliente/(Login|Registro)') != -1 ? this.toLoginRegistro=true : this.toLoginRegistro=false;
            });
        

  }
}
