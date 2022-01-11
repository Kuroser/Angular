import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IProvincia } from 'src/app/modelos/provincia';
import { CloudfirebaseService } from 'src/app/servicios/cloudfirebase.service';

@Component({
	selector: 'app-registro',
	templateUrl: '../../vistas/zonaCliente/registro.component.html',
	styleUrls: ['../../vistas/zonaCliente/css/registro.component.css']
})
export class RegistroComponent implements OnInit {
	//Las propiedades públicas de la clase pueden ser accedidasd desde la vista.
	public listProvs:Array<IProvincia>=[];
	public miform:FormGroup;

	constructor(private _accesoFirebase: CloudfirebaseService) {
		/*
			Creamos el formulario y los controles que vamos a mapear contra
			elementos del Dom de la vista registro.component.html
			========
			Creamos una instancia de 'FormGroup' en el constructor al cual hay que pasar un
			objeto con el siguiente formato:
			{clave_control: new FormControl(), clavecontrol: new FormControl(), ......}
				\---> se asocia a un input         \---> se asocia a un input
		*/
		//TODO Agregar validators para todos los campos de registro
		this.miform = new FormGroup(
			{
				login: new FormControl('',[Validators.required]),
				email: new FormControl('',[Validators.required,Validators.email]),
				password: new FormControl('',[Validators.required,Validators.minLength(8)]),
				repassword: new FormControl('',[Validators.required,Validators.minLength(8)]),
				nombre:   new FormControl('',[Validators.required]),
				apellidos: new FormControl('',[Validators.required]),
				nif:  new FormControl('',[Validators.required,Validators.pattern(/^[0-9]{8}-?[a-zA-Z]$/)]),
				telefono: new FormControl('',[Validators.required,Validators.pattern(/^[0-9]{9}$/)]),
				calle: new FormControl('',[Validators.required])
			}
		);
	}

	ngOnInit(): void {
		//metodo que se lanza tras el constructor y del DOm de la vista del componente
		//esta........
		//Inicializamos variable listProvs(No testeable hasta que cree
		//                                 la base de datos en firebase)
		//Para ello necesitamos acceder a firebase:
		this._accesoFirebase.devolverProvincias().subscribe(
			datos => {this.listProvs=<IProvincia[]>datos}
		);
		var isOrdered = true;
		while(isOrdered){
			for(let i = 0 ; i < this.listProvs.length-1; i++){
				var swapper:IProvincia;
				if(this.listProvs[i].NombreProvincia.charAt(0) > this.listProvs[i+1].NombreProvincia.charAt(0)){
					swapper = this.listProvs[i+1];
					this.listProvs[i+1] = this.listProvs[i];
					this.listProvs[i+1] = swapper;
					isOrdered = false;
				}
			}
		}
	}

}
