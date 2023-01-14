
export class GetEmployeeByTypeRequest {
    type: string;
    constructor(type: string) {
        this.type = type;
    }
}

export class GetEmployeeByBranchOfficeRequest {
    id: string;
    constructor(id: string) {
        this.id = id;
    }
}