import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CloudfirebaseService } from 'src/app/servicios/cloudfirebase.service';

@Component({
  selector: 'app-login',
  templateUrl: '../../vistas/zonaCliente/login.component.html',
  styleUrls: ['../../vistas/zonaCliente/css/login.component.css']
})
export class LoginComponent implements OnInit {
  public formLogin:FormGroup;
  constructor(private firebase:CloudfirebaseService,private router:Router) { 
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
    this.firebase.login(_email,_password).subscribe(
      datos=>{
        console.log(datos);
        this.router.navigateByUrl('/Tienda');
      }
    )
  }
}
