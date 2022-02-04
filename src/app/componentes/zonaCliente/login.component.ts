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
  public formLogin:FormGroup;
  constructor(private firebase:CloudfirebaseService,private router:Router,private IndexedDB:IndexedDBService) { 
    this.formLogin=new FormGroup(
      {
        email:new FormControl('',[Validators.required,Validators.email]),
        password:new FormControl('',[Validators.required,Validators.minLength(8)])
      }
    )
  }

  ngOnInit(): void {
  }
  Login(){
    let _email:string=this.formLogin.controls['email'].value;
    let _password:string=this.formLogin.controls['password'].value;
    this.firebase.login(_email,_password).subscribe((datos:ICliente[])=>{
      if(datos){
        this.IndexedDB.devuelveToken().subscribe(
          (token:IToken)=>{
            this.IndexedDB.almacenaCliente(datos[0],token);
          }
        )
      } else{
        this.formLogin.controls['email'].setErrors({required:false});
        this.formLogin.controls['password'].setErrors({required:false});
      }
    })
  }
}
