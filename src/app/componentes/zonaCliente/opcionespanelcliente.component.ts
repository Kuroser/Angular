import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-opcionespanelcliente',
  templateUrl: '../../vistas/zonaCliente/opcionespanelcliente.component.html',
  styleUrls: ['../../vistas/zonaCliente/css/opcionespanelcliente.component.css']
})
export class OpcionespanelclienteComponent implements OnInit {

  public listaOpcPanel:Array<String>=[
    "Inicio-PanelInicio",
    "Mi Perfil-MiPerfil",
    "Mis Datos de Envio-MisDatosEnvio",
    "Mis Compras-MisCompras",
    "Mis Gustos-MisGustos",
    "Mis Opiniones-MisOpiniones",
    "Mi Lista de Deseos-MiListaDeseos",
    "Volver a Agapea-Inicio",
    "Desconectarse-Logout"
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
