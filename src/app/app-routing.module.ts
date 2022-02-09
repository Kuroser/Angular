import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './componentes/zonaCliente/login.component';
import { RegistroComponent } from './componentes/zonaCliente/registro.component';
import { RegistrookComponent } from './componentes/zonaCliente/registrook.component';
import { LibrosComponent } from './componentes/zonaTienda/libros.component';

//en Routes se almacena el array de objetos q implementa interface Route
//https://angular.io/api/router/Route
const routes: Routes = [
  { path: 'Cliente/Registro', component: RegistroComponent },
  { path: 'Cliente/Login', component: LoginComponent},
  { path: 'Cliente/RegistroOk', component: RegistrookComponent },
  { path: 'Tienda/Libros/:materia/:idmateria', component: LibrosComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
