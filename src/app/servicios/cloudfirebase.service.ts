import { Injectable, NgModule } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable, tap } from 'rxjs';
import { ICliente} from '../modelos/cliente';
import { ICredenciales } from '../modelos/credenciales';
@Injectable({
	providedIn: 'root'
})
export class CloudfirebaseService {

	constructor(private _db: AngularFirestore,private _auth:AngularFireAuth) {
		
	}

	devolverProvincias(): Observable<any>{
		return this._db
								.collection('provincias'
								/*,ref=>ref.where('CodPro','>=','0').orderBy('NombreProvincia')*/)
								.valueChanges();
	}

	devolverMunicipios(codprov:number): Observable<any>{
		return this._db
						.collection('municipios'/*,ref=>ref.where('CodPro','==',codprov).orderBy('NombreMunicipio')*/)
						.valueChanges();
	}
	registrarDatosCliente(nuevoCliente:ICliente): Observable<any>{
		//Si la contraseña está definida (Un caso garantizado en realidad) procederá con el registro
		if(nuevoCliente.credenciales.password !== undefined){
			return from(
				this._auth
				.createUserWithEmailAndPassword(nuevoCliente.credenciales.email,
												nuevoCliente.credenciales.password)
			).pipe(
				tap({
					next: async (datos:any)=>{
						await datos.user?.sendEmailVerification();
						//Quitamos la password de las credenciales
						delete nuevoCliente.credenciales.password;
						return this._db.collection('clientes').add(nuevoCliente);
					},
					error: (err)=>{console.log(err)},
					complete: ()=>{console.log('Flujo del observable del TAP completo.\nRegistro completo')}
				}
				)
			);
		}
		else{
			//Añadir comprobación de que ningún listo haya pasado la validación del registro
			//Aunque eso, como dicho arriba, es imposible. Esto es para evitar problemas con las credenciales
			return from([]);
		}
		/*this._auth
			.createUserWithEmailAndPassword(nuevoCliente.credenciales.email,nuevoCliente.credenciales.password)
			.then(
				async datos => {
					//En datos hay n objeto de la clase de firebase.auth.UserCredential
					//En la propiedad .user se recibe un objeto de clase firebase.auth.User
					await datos.user?.sendEmailVerification();
					return from(this._db.collection('clientes').add(nuevoCliente));
				}
			)
			.catch(err=>console.log(err));*/
	}
}
