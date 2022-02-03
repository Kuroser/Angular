import { ICredenciales} from "./credenciales";
import { IDireccion } from "./direccion";

export interface ICliente {
    nombre: string;
    apellidos: string;
    nif: string;
    telefono: number;
    imagenAvatar?: string;
    descripcion?: string;
    credenciales: ICredenciales;
    direcciones: IDireccion[];
    uid?: string;
    
}