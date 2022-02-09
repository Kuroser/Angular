import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ILibro } from '../modelos/libro';

@Injectable({
  providedIn: 'root'
})
export class ControlpedidoService {
  
  private _itemsEnCarro$?:BehaviorSubject<Array<[ILibro,number]>>=new BehaviorSubject<any>([]);
  
  constructor() { }

  
}
