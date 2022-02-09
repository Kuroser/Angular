import { Injectable, Query } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { concatMap, from, map, Observable, of, take, tap } from 'rxjs';
import { ICliente } from '../modelos/cliente';
import { ILibro } from '../modelos/libro';
import { IMateria } from '../modelos/materia';



@Injectable({
  providedIn: 'root'
})
export class CloudfirebaseService {
  //servicio para hacer querys contra colecciones de firebase cloud storage
  //para lo cual necesito inyectar el servicio AngularFireStore
  //q me va a dar acceso al Cloud Storage
  constructor(private _db:AngularFirestore, private _auth:AngularFireAuth) { }

//#region "----------- metodos FIREBASE CLOUD-STORAGE -------------"

//#region  "----registro-cliente ----"
devolverProvincias():Observable<any> {
  //si uso .get() me devuleve objetos QueryDocumentSnapshot <--- ventaja: se cierra observable
  // desventaja: tienes copias  no datos a tiempo real
  // return this._db.collection('provincias').get()

  //si uso .valueChanges() <--- ventaja: tienes datos actualizados en tiempo real, y devuelves documentos IProvincia
  // deventaja: socket abierto, si no lo cierras consume memoria...

  return this._db.collection('provincias',ref=>ref.orderBy('NombreProvincia')).valueChanges()
}

devolverMunicipios(codprov:number):Observable<any> {

  return this._db.collection('municipios', ref=>ref.orderBy('NombreMunicipio'))//,ref=>ref.where("CodPro","==",codprov)).orderBy('NombreMunicipio')
                .valueChanges()
}
//#endregion

//#region  "---tienda libros----"
 
devolverMaterias(idMateria:number):Observable<Array<IMateria>>{
    return this._db
              .collection('materias',ref=>ref.where('IdMateriaPadre','==',idMateria))
              .valueChanges()
              .pipe(
                map( (docs)=>docs as Array<IMateria>)
              )
  }

devolverLibros(criterio:string, valor:string):Observable<Array<ILibro>>{
  let filtro;
  switch (criterio) {
    case 'IdMateria':
    case 'ISBN':          
          filtro=(ref:any)=>ref.where(criterio,'==',parseInt(valor));
          break;
  
    default:
      break;
  }

  return this._db
              .collection('libros',filtro)
              .valueChanges()
              .pipe(
                map(docs=>docs as Array<ILibro>)
              )
}
  //#endregion

  //#endregion



  //#region "---------- metodos FIREBASE-AUTHENTICATION----------"

  registrarDatosCliente(nuevoCliente:ICliente): Observable<any> {
     /*pasos:
        1º almacenar y registrar credenciales en firabase Authentication,
            usando servicio de @angular/fire: AngularFireAuth
        2º almacenar datos del cliente en coleccion clientes del cloud-storage:

        this._db.collection('clientes').add(nuevoCliente)

     */

        return from(
          this._auth.createUserWithEmailAndPassword(nuevoCliente.credenciales.email,nuevoCliente.credenciales.password)
          ).pipe(
            tap(
                {
                  next: async (datos:any) => {
                              //en datos hay un objeto de la clase de firebase.auth.UserCredential
                              //en propiedad .user <--- obejto de la clase firebase.auth.User
                              await datos.user?.sendEmailVerification();

                              //quitamos de las credenciales la password....
                              //delete nuevoCliente.credenciales.password
                              let {password, ...resto}=nuevoCliente.credenciales;
                              let _clientesinpass={ ...nuevoCliente, credenciales: resto };

                              this._db.collection('clientes').add(_clientesinpass);
                  },
                    error: (err) => { console.log(err) },
                    complete: ()=>{ console.log('flujo del observable del TAP completado')}
              }
            )
        )

  }

  activarCuentaCliente(codigo:string): Observable<any>{
    /*
    metodo del sevicio AngularFireAuth q devuelve promesa firebase.auth.ActionCodeInfo
          this._auth.checkActionCode(codigo)

     en la propiedad .data hay un objeto javascript con la prop.   .email<--- email a verificar
     lo suyo seria comprobar q este email existe en la coleccion "clientes" pendiente de activacion (campo cuentaActiva: false)
     si todo ok:  aplicar codigo para actviar cuenta
                  modificar en coleccion clientes la prop. cuentaActiva=true dentro de credenciales

            Observable
        ------------------------| pipe     |--------------------
          ActionCodeInfo           tap             documento-Cliente-modificado
        ------------------------|  map     |--------------------
    */
    return from(this._auth.checkActionCode(codigo)).pipe(
        tap(
          async actioncode => {
                    //1º operacion activacion
                    await this._auth.applyActionCode(codigo); //activacion de cuenta en firebase Authorization...ya puedo usar email para login

          }
        ),
        map(
          actioncode => {
                  //2º operacion modificacion documento coleccion "clientes" en cloud-storage y poner campo credenciales.cuentaActiva a true
                  //como necesito el id del documento para acceder al path del mismo en la coleccion clientes y poder modificarlo
                  //no uso .valueChanges() sino .get()  y asi obtengo snapshot del documento, con prop id y data()


                  console.log('el valor del actionCodeInfo en el map...', actioncode);

                  this._db.collection('clientes', ref=>ref.where('credenciales.email','==', actioncode.data.email))
                  .snapshotChanges()
                  .pipe(take(1))
                  .subscribe(
                              (docsCliente:any) => {

                                    console.log('array de documentos recuperados en el map para hacer el update....', docsCliente);

                                    let _creds=docsCliente[0].payload.doc.data().credenciales;
                                    _creds.cuentaActiva=true;

                                    this._db.doc('/clientes/' + docsCliente[0].payload.doc.id)
                                            .update({ credenciales: _creds})
                                            .then(
                                              ()=> {
                                                return docsCliente[0].payload.doc.data();
                                              }
                                            )
                                            .catch(
                                              (err)=> {
                                                return {};
                                              }
                                            )

                              }
                  );

          }
        )
    )


  }

  login(email:string, password:string):Observable<any> {
    /*
    el metodo .signInWithEmailAndPassword devuelve una promesa de un objeto firebase.auth.UserCredential
    lo convertimos en observable y manipulamos...
     si todo ok, firebase almacena un token de sesion: JWT  dentro de indexedDB del navegador del cliente

    Observable:sigInWithEmailAndPassword
    --------------------------|  pipe   |----------------------
    dato:UserCredential                    dato_trans: ICliente
    --------------------------|         |----------------------
    */

    return from(this._auth.signInWithEmailAndPassword(email,password))
            .pipe(
              concatMap(
                datosUserCredential=>{
                    if (datosUserCredential.user){
                        return this._db
                                  .collection('clientes',ref=>ref.where('credenciales.email','==',email))
                                  .valueChanges()
                                    
                    } else {
                        return of(undefined)
                    }
                }
              )
            )
  }
//#endregion
}
