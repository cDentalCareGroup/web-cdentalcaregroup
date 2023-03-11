export class RegisterPadCatalogueRequest {
    name: string;
    description: string;
    price: number;
    type: string;
    day: number;
    status: boolean;
    maxMembers: number;
    maxAdditionals: number;

    constructor(
        name: string,
        description: string,
        price: number,
        type: string,
        day: number,
        status: boolean,
        maxMembers: number,
        maxAdditionals: number
    ) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.type = type;
        this.day = day;
        this.status = status;
        this.maxAdditionals = maxAdditionals;
        this.maxMembers = maxMembers;
    }
}


export class UpdatePadCatalogueRequest {
    id: number;
    name: string;
    description: string;
    price: number;
    type: string;
    day: number;
    status: boolean;

    constructor(
        id: number,
        name: string,
        description: string,
        price: number,
        type: string,
        day: number,
        status: boolean
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.type = type;
        this.day = day;
        this.status = status;
    }
}


export class RegisterPadComponentRequest {
    padCatalogueId: number;
    serviceId: number;
    globalQuantity: number;
    maxPatientQuantity: number;
    discount: number;
    discountTwo: number;

    constructor(
        padCatalogueId: number,
        serviceId: number,
        globalQuantity: number,
        maxPatientQuantity: number,
        discount: number,
        discountTwo: number
    ) {
        this.padCatalogueId = padCatalogueId;
        this.serviceId = serviceId;
        this.globalQuantity = globalQuantity;
        this.maxPatientQuantity = maxPatientQuantity;
        this.discount = discount;
        this.discountTwo = discountTwo
    }
}