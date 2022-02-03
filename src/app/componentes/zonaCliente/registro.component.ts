import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMunicipo } from 'src/app/modelos/municipio';
import { IProvincia } from 'src/app/modelos/provincia';
import { ICliente } from 'src/app/modelos/cliente';
import { CloudfirebaseService } from 'src/app/servicios/cloudfirebase.service';
import { IDireccion } from 'src/app/modelos/direccion';
import { Router } from '@angular/router';

@Component({
	selector: 'app-registro',
	templateUrl: '../../vistas/zonaCliente/registro.component.html',
	styleUrls: ['../../vistas/zonaCliente/css/registro.component.css']
})
export class RegistroComponent implements OnInit {
	//Las propiedades públicas de la clase pueden ser accedidasd desde la vista.
	public listProvs:Array<IProvincia>=[];
	public miform:FormGroup;
	public listaMunis:Array<IMunicipo>=[];

	constructor(private _accesoFirebase: CloudfirebaseService,private _router:Router) {
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
		this.miform=new FormGroup(
      {
        login: new FormControl('',[Validators.required]),
        email: new FormControl('',[Validators.required,Validators.email]),
        password: new FormControl('',[
                                      Validators.required,
                                      Validators.minLength(5),
                                      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$')
                                    ]),                      
        repassword: new FormControl('',[
                                      Validators.required,
                                      Validators.minLength(5),
                                      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$')
                                    ]),
        nombre: new FormControl('',[Validators.required]),
        apellidos: new FormControl('',[Validators.required]),
        nif: new FormControl('',[Validators.required,Validators.pattern('^[0-9]{8}-?[a-zA-Z]$')]),
        telefono: new FormControl('',[Validators.required]),
        calle: new FormControl('',[Validators.required]),
        codpro: new FormControl('',[Validators.required]),
        codmun: new FormControl('',[Validators.required]),
        cp: new FormControl('',[ Validators.required, Validators.pattern('^[0-9]{5}$') ] )
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
			datos => {
				this.listProvs=<IProvincia[]>datos/*
				var y:IProvincia;
				console.log('Entra en bucle')
				for(let x = 0 ; x < (<IProvincia[]>datos).length ; x++){
					console.log(x,' ',this.listProvs[x].CodPro);
				}
				console.log('Sale de bucle');
				console.log('Ha llamado correctamente a devolverProvincias()')*/;
				console.log(datos);
			}
		);
	}

	cargaMunicipios(){
		let _codprov = this.miform.controls['codpro'].value;
    this._accesoFirebase.devolverMunicipios(_codprov).subscribe(
      datos=> {
                this.listaMunis=<IMunicipo[]>datos.filter( (muni:IMunicipo)=> muni.CodPro==_codprov);
    }
    )
    console.log(this.miform.controls);
	}

	registrarCliente(){
		let _valoresFormulario=this.miform.value;
		let _nuevoCliente:ICliente={
			  nombre: _valoresFormulario.nombre,
			  apellidos: _valoresFormulario.apellidos,
			  nif: _valoresFormulario.nif,
			  telefono: _valoresFormulario.telefono,
			  credenciales: {
							  login: _valoresFormulario.login,
							  email: _valoresFormulario.email,
							  password: _valoresFormulario.password,
							  imagenAvatar: '',
							  cuentaActiva: false
			  },
			  direcciones:[
				  {
				  calle: _valoresFormulario.calle,
				  cp: _valoresFormulario.cp,
				  provincia:  this.listProvs.filter( (prov:IProvincia)=> prov.CodPro==_valoresFormulario.codpro )[0],
				  municipio: this.listaMunis.filter( (muni:IMunicipo)=> muni.CodPro==_valoresFormulario.codpro && muni.CodMun==_valoresFormulario.codmun)[0]
				  
				}
			  ]
			}
			console.log(_nuevoCliente);
			this._accesoFirebase.registrarDatosCliente(_nuevoCliente).subscribe(
				datos=>{
					console.log(datos);
					this._router.navigateByUrl('/Cliente/Login');					
				}
			);
	}
}
