
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ICliente } from 'src/app/modelos/cliente';
import { IToken } from 'src/app/modelos/token';
import { CloudfirebaseService } from 'src/app/servicios/cloudfirebase.service';
import { IndexedDBService } from 'src/app/servicios/indexed-db.service';

@Component({
  selector: 'app-login',
  templateUrl: '../../vistas/zonaCliente/login.component.html',
  styleUrls: ['../../vistas/zonaCliente/css/login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin:FormGroup;

  constructor(private _accesoFirebase: CloudfirebaseService,
             private _router:Router,
             private _indexedDb: IndexedDBService) {

    this.formLogin=new FormGroup(
      {
        email: new FormControl('',[Validators.required, Validators.email]),
        password: new FormControl('',[
                                      Validators.required,
                                      Validators.minLength(5),
                                      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$')
                                      ]
                                  )
      }
    )
  }

  ngOnInit(): void {
  }

  Login(){
      let _email:string=this.formLogin.controls['email'].value;
      let _pass:string=this.formLogin.controls['password'].value;

      this._accesoFirebase.login(_email, _pass)
          .subscribe(
            (datos:ICliente[]) => {
                        console.log('datos recibidos desde el observable login del servicio...', datos);
                        if(datos){
                          //localStorage.setItem('cliente',JSON.stringify(datos));
                          this._indexedDb.devuelveToken().subscribe(
                            (token:IToken)=> {
                                        console.log('token recuperado de datos de indexedDB:',token);
                                        this._indexedDb.almacenaClienteJWT(datos[0],token);
                            }
                          );

                          this._router.navigateByUrl('/Tienda/Libros/0/0');

                        } else {
                          //....poner error en formulario de ha habido un fallo en la autentificacion
                          this.formLogin.controls['email'].setErrors({required: 'false'});
                          this.formLogin.controls['password'].setErrors({required:'false'});
                        }

            }
          )

  }

}
