
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


export class RegisterEmployeeRequest {
    user: string;
    password: string;
    name: string;
    lastname: string;
    secondLastname: string;
    street: string;
    number: string;
    colony: string;
    cp: string;
    state: string;
    phone: string;
    brithday: string;
    rfc: string;
    nss: string;
    status: number;
    branchOfficeId: number;
    jobSchemeId: number;
    typeId: number;
    email: string;
    gender: string;

    constructor(
        user: string,
        password: string,
        name: string,
        lastname: string,
        secondLastname: string,
        street: string,
        number: string,
        colony: string,
        cp: string,
        state: string,
        phone: string,
        brithday: string,
        rfc: string,
        nss: string,
        status: number,
        branchOfficeId: number,
        jobSchemeId: number,
        typeId: number,
        email: string,
        gender: string
    ) {
        this.user = user;
        this.password = password;
        this.name = name;
        this.lastname = lastname;
        this.secondLastname = secondLastname;
        this.street = street;
        this.number = number;
        this.colony = colony;
        this.cp = cp;
        this.state = state;
        this.phone = phone;
        this.brithday = brithday;
        this.rfc = rfc;
        this.nss = nss;
        this.status = status;
        this.branchOfficeId = branchOfficeId;
        this.jobSchemeId = jobSchemeId;    
        this.typeId = typeId;    
        this.email = email;    
        this.gender = gender;    
    }
}