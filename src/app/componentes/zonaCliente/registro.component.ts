import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: '../../vistas/zonaCliente/registro.component.html',
  styleUrls: ['../../vistas/zonaCliente/css/registro.component.css']
})
export class RegistroComponent implements OnInit {
  public miform:FormGroup;
  constructor() {
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

  }

}
