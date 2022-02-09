import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CloudfirebaseService } from 'src/app/servicios/cloudfirebase.service';

@Component({
  selector: 'app-registrook',
  templateUrl: '../../vistas/zonaCliente/registrook.component.html',
  styleUrls: ['../../vistas/zonaCliente/css/registrook.component.css']
})
export class RegistrookComponent implements OnInit {

  constructor(private _rutaActiva: ActivatedRoute, private _accesoFirebase: CloudfirebaseService ) { }

  ngOnInit(): void {
    /*
    activar la cuenta: cuando el usuario recibe por mail el link de activacion, se carga este componente
    en la url hay dos parametros q se pasan por querystring:

      http://.../Cliente/RegistroOk ? mode=verifyEmail & oobCode=.....
                                     -----------------
                                          |---> tipo de operacion para la cual firebase ha generado esta url:
                                                activacion de cuenta, cambio de password, cambio de email de cuenta existente,...

    necesito el parametro oobCode para invocar al servivico AgularFireAuth para activar la cuenta
    uso clase ActivatedRoute, metodos:

        - paramMap <------- metodo q devuelve Observable<ParamMap> coleccion clave-valor para recuperar los segmentos de la url
        - queryParamMap <-- metodo q devuelve Observable<ParamMap> coleccion clave-valor para recupear los parametros pasados en la url (a continuacion ?)
                Observable
            -------------------------------------------
                  dato: ParamMap
            -------------------------------------------

    */
   this._rutaActiva.queryParamMap.subscribe(
      (parametros:ParamMap)=>{

                console.log('parametros de la url....', parametros);

                let _codigo=parametros.get('oobCode');

                if(_codigo){
                  this._accesoFirebase.activarCuentaCliente(_codigo).subscribe(
                    datos => {
                      console.log(datos);

                    }
                  )

                }




       }
   );

  }

}
