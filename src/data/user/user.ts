export default class User {
    name: string;
    lastname: string;
    username: string;
    token: string;
    roles?: string;
    branchId?: number;
    constructor(name: string, lastname: string, token: string, username: string, roles?: string, branchId?: number) {
      this.name = name;
      this.lastname = lastname;
      this.username = username;
      this.token = token;
      this.roles = roles;
      this.branchId = branchId;
    }
  }