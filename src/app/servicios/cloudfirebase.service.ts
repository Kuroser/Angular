import { Injectable, NgModule } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';
import { ICliente } from '../modelos/cliente';

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
		return from(
			this._auth
			.createUserWithEmailAndPassword(nuevoCliente.credenciales.email,
											nuevoCliente.credenciales.password)
		).pipe();
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
