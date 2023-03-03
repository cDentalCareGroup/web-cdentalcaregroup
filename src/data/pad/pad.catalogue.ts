
export enum PadType {
    INDIVIDUAL = 'individual',
    GROUP = 'grupal',
}

export enum PadStatus {
    ACTIVE = 'activo',
    INACTIVE = 'inactivo',
}

export interface PadCatalogue {
    id: number;
    name: string;
    description: string;
    price: number;
    type: PadType;
    status: PadStatus;
    day: number;
    maxMember: number;
    maxAdditional: number;
}

