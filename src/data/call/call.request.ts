export class UpdateCallRequest {
    id: number;
    description: string;

    constructor(id: number,
        description: string) {
        this.id = id;
        this.description = description;
    }
}

export class UpdateCatalogRequest {
    id: number;
    name: string;
    description: string;
    goal: string;
    script: string;
    constructor(
        id: number,
        values: any
    ) {
        this.id = id;
        this.description = values.description;
        this.goal = values.goal;
        this.script = values.script;
        this.name = values.name;
    }
}


export class RegisterCatalogRequest {
    name: string;
    description: string;
    goal: string;
    script: string;
    constructor(
        values: any
    ) {
        this.description = values.description;
        this.goal = values.goal;
        this.script = values.script;
        this.name = values.name;
    }
}

export class RegisterCallRequest {
    patientId: number;
    description: string;
    date: string;
    type: string;
    name?:string;
    phone?:string;
    email?:string;

    constructor(patientId: number,
        description: string,
        date: string,
        type: string, name?:string,
        phone?:string,
        email?:string
    ) {
        this.patientId = patientId;
        this.description = description;
        this.date = date;
        this.type = type;
        this.name = name;
        this.phone = phone;
        this.email = email;
    }
}