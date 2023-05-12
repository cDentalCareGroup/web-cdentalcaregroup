export class RegisterOrganizationRequest {
    name: string;
    description: string;


    constructor(name: string,
        description: string
    ) {
        this.name = name;
        this.description = description;
    }
}

export class UpdateOrganizationRequest {
    id: number;
    name: string;
    description: string;

    constructor(id: number, name: string,
        description: string
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}