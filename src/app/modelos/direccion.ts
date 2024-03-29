import { IMunicipo } from "./municipio";
import { IProvincia } from "./provincia";

export interface IDireccion {
    calle: string;
    cp: string;
    provincia: IProvincia;
    municipio: IMunicipo;
}