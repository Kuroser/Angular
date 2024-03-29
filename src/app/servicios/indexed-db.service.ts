import { Injectable } from '@angular/core';
import { Observable, Subscribable, Subscriber } from 'rxjs';
import { ICliente } from '../modelos/cliente';
import { IToken } from '../modelos/token';

@Injectable({
	providedIn: 'root'
})
export class IndexedDBService {

	constructor() {

	}
	devuelveToken():Observable<IToken>{
		return new Observable<IToken>(
      (subscriber)=>{
        let _request:IDBOpenDBRequest=window.indexedDB.open('firebaseLocalStorageDb');
  
        _request.addEventListener('success', (ev)=>{
          console.log('bd firebase abierta');
          
          let _db:IDBDatabase=_request.result as IDBDatabase;
          let _transac:IDBTransaction=_db.transaction(['firebaseLocalStorage'],'readonly');
          
          let _select:IDBRequest=_transac.objectStore('firebaseLocalStorage').getAllKeys();
          _select.addEventListener('success',
                                  (evDatos)=>{
                                            let _clave=_select.result[0];
                                            console.log('clave recuperada...', _clave);
            
                                            let _selectDatos:IDBRequest=_transac.objectStore('firebaseLocalStorage').get(_clave);
                                            _selectDatos.addEventListener('success',
                                                                          (evDatos2)=>{
                                                                                      let _datosJWT=_selectDatos.result;
                                                                                      console.log('datos recuperados....', _datosJWT);

                                                                                      let _valorDevuelto:IToken={
                                                                                         email: _datosJWT.value.email,
                                                                                         emailVerified: _datosJWT.value.emailVerified,
                                                                                         uid: _datosJWT.value.uid,
                                                                                         jwt: _datosJWT.value.stsTokenManager.accessToken,
                                                                                         expirationTime: _datosJWT.value.stsTokenManager.expirationTime
                                                                                      };
                                                                                      subscriber.next(_valorDevuelto);
                                                                                  }
                                              );
            
           _select.addEventListener('error',(err)=>console.log('errores al recuperar claves ',err));
            
          });
            
        });
      
      }
    );
	}
	almacenaCliente(datosCliente:ICliente,token:IToken){
		try{
			let _reqDb:IDBOpenDBRequest=window.indexedDB.open('clientes');
			_reqDb.addEventListener('upgradeneeded',(ev)=>{
				let _db:IDBDatabase=_reqDb.result;
				let _store:IDBObjectStore=_db.createObjectStore('infoClientes',{keyPath:'nif'});
				_store.createIndex('nif','nif');
				
			})
			_reqDb.addEventListener('success',(ev)=>{
				let _db:IDBDatabase=_reqDb.result;
				let _transac:IDBTransaction=_db.transaction(['infoClientes','tokens'],'readwrite');
				let _insertReq:IDBRequest=_db
											.transaction(['infoClientes'],'readwrite')
											.objectStore('infoClientes')
											.add(datosCliente);
				_insertReq.addEventListener('success',(ev)=>{
					console.log('datos almacenados del cliente ok en indexedDB');
				});

				_insertReq.addEventListener('error',(ev)=>{
					console.log('Algo ha salido mal al insertar el cliente en indexedDB');
				});
				let _insertJWT:IDBRequest=_transac.objectStore('tokens').add(token);
				_insertJWT.addEventListener('success',(ev)=>{
					console.log('datos almacenados del JWT ok en indexedDB');
				})
				_insertJWT.addEventListener('error',(err)=>{throw err});
			});
			_reqDb.addEventListener('error',(ev)=>{

			});
		} catch(error){

		}
	}
}
