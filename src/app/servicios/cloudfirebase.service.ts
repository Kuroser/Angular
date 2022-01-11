import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { IProvincia } from '../modelos/provincia';

@Injectable({
	providedIn: 'root'
})
export class CloudfirebaseService {

	constructor(private _db: AngularFirestore) {
		
	}

	devolverProvincias(): Observable<any>{
		return this._db.collection('provincias').valueChanges();

	}
}
