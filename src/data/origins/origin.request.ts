export class RegisterOriginRequest {
    name: string;
    description: string;
    generateCode: boolean;

    constructor(name: string,
        description: string,
        generateCode: boolean) {
        this.name = name;
        this.description = description;
        this.generateCode = generateCode;
    }
}




export class UpdateOriginRequest {
    id: number;
    name: string;
    description: string;
    generateCode: boolean;

    constructor(id: number, name: string,
        description: string,
        generateCode: boolean) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.generateCode = generateCode;
    }
}