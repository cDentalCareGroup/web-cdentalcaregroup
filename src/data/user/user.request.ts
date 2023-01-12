export class LoginRequest {
    username: string;
    password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
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