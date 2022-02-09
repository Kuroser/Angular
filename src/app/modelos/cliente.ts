import { ICredenciales } from "./credenciales";
import { IDireccion } from "./direccion";

export interface ICliente {
    nombre: string;
    apellidos: string;
    nif: string;
    telefono: string;
    credenciales: ICredenciales;
    direcciones: Array<IDireccion>;
    uid?: string;
}