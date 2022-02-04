import { environment } from 'src/environments/environment';

//--------------- importacion modulos a nivell app ------------------------
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//modulos de firebase....

import { AngularFireModule } from '@angular/fire/compat'; //<--- establece conexion contra firebase
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; //<---modulo para registro/autentificacion/autorizacion usuarios
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';//<----modulo para subida de ficheros a firebase
import { AngularFireStorageModule } from '@angular/fire/compat/storage';//<--- modulo para CRUD contra colecciones del Cloud-Storage

//--------------- importacion componentes a nivel app ----------------------
import { AppComponent } from './app.component';
import { RegistroComponent } from './componentes/zonaCliente/registro.component';
import { LoginComponent } from './componentes/zonaCliente/login.component';

//--------------- importacion de servicios a nivel app ----------------------
import { CloudfirebaseService } from './servicios/cloudfirebase.service';
import { RegistroOkComponent } from './componentes/zonaCliente/registro-ok.component';
import { TiendaComponent } from './componentes/zonaTienda/tienda.component';
import { IndexedDBService } from './servicios/indexed-db.service';
import { LibrosComponent } from './componentes/zonaTienda/libros.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    LoginComponent,
    RegistroOkComponent,
    TiendaComponent,
    LibrosComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    CloudfirebaseService,
    IndexedDBService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { } 