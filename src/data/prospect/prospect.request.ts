export class RegisterProspectRequest {
    name: string;
    phone: string;
    email: string;

    constructor(name: string,
        phone: string,
        email: string) {
        this.name = name;
        this.phone = phone;
        this.email = email;
    }
}