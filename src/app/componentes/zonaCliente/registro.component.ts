import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ICliente } from 'src/app/modelos/cliente';
import { IMunicipio } from 'src/app/modelos/municipio';
import { IProvincia } from 'src/app/modelos/provincia';
import { CloudfirebaseService } from 'src/app/servicios/cloudfirebase.service';

@Component({
  selector: 'app-registro',
  templateUrl: '../../vistas/zonaCliente/registro.component.html',
  styleUrls: ['../../vistas/zonaCliente/css/registro.component.css']
})
export class RegistroComponent implements OnInit {
 
  //las props.publicas de la clase pueden ser accedidas desde la vista....  
  public miform:FormGroup;
  public listaProvs:Array<IProvincia>=[];
  public listaMunis:Array<IMunicipio>=[];
  


  constructor(private _accesoFirebase: CloudfirebaseService, private _router:Router) {
    //....nos creamos el formulario y los controles q vamos a mapear contra elemetos del DOM de la vista
    //.... registro.component.html
    // nos creamos una instancia de FormGroup en el constructor le tienes q pasar un objeto con este formato:
    //{  clave_control: new FormControl(), clave_control: new FormControl(), ....}
    //   -------------                     --------------
    //      \--> se asocia a un input           \----> se asocia a un input 

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
    //metodo q se lanza tras el constructor y el DOM de la vista del componente esta creada
    //...inicializamos variable:  listProvs
    //para lo cual necesitamos acceder a firebase

      this._accesoFirebase.devolverProvincias().subscribe(
        datos => this.listaProvs=<IProvincia[]>datos
      );
  }

  cargaMunicipios(){
    //este metodo se va a ejecutar cada vez q se dispare evento "change" sobre el select-provincias
    let _codprov=this. miform.controls['codpro'].value;
    
    this._accesoFirebase.devolverMunicipios(_codprov).subscribe(
      datos=> {
                this.listaMunis=<IMunicipio[]>datos.filter( (muni:IMunicipio)=> muni.CodPro==_codprov);
              }
    )
  }

  registrarCliente(){
    //a partir de los valores de cada FormControl del formulario me tengo q construir un objeto ICliente
    //y almacenarlo en firebase...
    

    
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
              provincia:  this.listaProvs.filter( (prov:IProvincia)=> prov.CodPro==_valoresFormulario.codpro )[0],
              municipio: this.listaMunis.filter( (muni:IMunicipio)=> muni.CodPro==_valoresFormulario.codpro && muni.CodMun==_valoresFormulario.codmun)[0]
              
            }
          ]

    }
    
    console.log(_nuevoCliente);
    this._accesoFirebase.registrarDatosCliente(_nuevoCliente).subscribe(
      datos=>{
        //en datos hay un objeto firebase de la clase firebase.auth.UserCredential
          console.log(datos);
          this._router.navigate(['/Cliente/Login']);

      }
    )


    }
}
