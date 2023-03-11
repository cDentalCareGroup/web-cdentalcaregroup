export class LoginRequest {
    username: string;
    password: string;
    info: any;

    constructor(username: string, password: string, info: any) {
        this.username = username;
        this.password = password;
        this.info = info;
    }
}


export class UpdatePasswordRequest {
    username: string;
    password: string;

    constructor(username: string, passowrd: string) {
        this.password = passowrd;
        this.username = username;
    }
}


export class SaveTokenRequest {
    username: string;
    token: string;

    constructor(username: string, token: string) {
        this.username = username;
        this.token = token;
    }
}