import { Service } from "../service/service";
import { Pad } from "./pad";
import { PadMember } from "./pad.member";
import { PadComponent } from "./pad.component";


export interface PadComponentUsed {
    pad: Pad;
    padMember: PadMember;
    components: PadComponentService[]
}


interface PadComponentService {
    service: Service;
    component: PadComponent;
}


