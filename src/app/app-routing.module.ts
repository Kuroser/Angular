import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './componentes/zonaCliente/registro.component';
import {LoginComponent} from './componentes/zonaCliente/login.component';

const routes: Routes = [
  {path: 'Cliente/Registro',component: RegistroComponent},
  {path: 'Cliente/Login',component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
