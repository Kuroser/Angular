import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './componentes/zonaCliente/registro.component';
import {LoginComponent} from './componentes/zonaCliente/login.component';
import { RegistroOkComponent } from './componentes/zonaCliente/registro-ok.component';
import { TiendaComponent } from './componentes/zonaTienda/tienda.component';

const routes: Routes = [
  {path: 'Cliente/Registro',component: RegistroComponent},
  {path: 'Cliente/Login',component: LoginComponent},
  {path: 'Cliente/RegistroOk',component: RegistroOkComponent},
  {path: 'Tienda',component: TiendaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
