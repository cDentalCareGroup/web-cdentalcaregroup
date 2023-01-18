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