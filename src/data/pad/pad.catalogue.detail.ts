import { Service } from "../service/service";
import { PadComponent } from "./pad.component";

export interface PadCatalogueDetail {
    id: number;
    name: string;
    description: string;
    price: string;
    type: string;
    status: string;
    day: number;
    components?: PadComponent[]
}

