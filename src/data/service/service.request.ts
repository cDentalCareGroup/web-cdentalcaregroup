export class RegisterServiceRequest {
    name: string;
    price: number;
    categoryId: number;
    labCost: number;

    constructor(name: string,
        price: number,
        categoryId: number, labCost: number) {
        this.name = name;
        this.price = price;
        this.categoryId = categoryId;
        this.labCost = labCost;
    }
}



export class UpdateServiceRequest {
    id: number;
    name: string;
    price: number;
    categoryId: number;
    status: string;

    constructor(id: number, name: string,
        price: number,
        categoryId: number, status: string,) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.categoryId = categoryId;
        this.status = status;
    }
}