import { Patient } from "../patient/patient"
import { Pad } from "./pad";
import { PadCatalogue } from "./pad.catalogue";



export interface PadDetail {
    members: Patient[];
    pad: Pad,
    catalogue: PadCatalogue,
    principalId: number;
}
