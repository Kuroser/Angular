import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CloudfirebaseService } from 'src/app/servicios/cloudfirebase.service';
@Component({
	selector: 'app-registro-ok',
	templateUrl: './../../vistas/zonaCliente/registro-ok.component.html',
	styleUrls: ['./../../vistas/zonaCliente/css/registro-ok.component.css']
})
export class RegistroOkComponent implements OnInit {

	constructor(private _rutaActiva:ActivatedRoute,private _firebase:CloudfirebaseService) { }

	ngOnInit(): void {
		
		//	Activar la cuenta: Al entrar al link de activación se carga este componente
		//	En la url hay 2 parámetros a recibir:
		//		http://....../Cliente/RegistroOk? mode=verifyEmail & oobCode=..........

		//	Necesito separar los parámetros para poder almacenarlos en una variable y trabajar con ellos, específicamente oobCode.
		
		console.log('se inicia');
		this._rutaActiva.queryParamMap.subscribe(
			(parametros:ParamMap)=>{
				console.log('Parametros de la url......',parametros);
				var oobCode = parametros.get('oobCode');
				if(oobCode != null){
					this._firebase.activarCuentaCliente(oobCode);
					console.log('Se ha activado la cuenta del cliente');
				}
			}
		)
	}
}