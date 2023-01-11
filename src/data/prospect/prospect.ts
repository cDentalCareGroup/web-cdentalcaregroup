export class Prospect {
    id: number;
    name: string;
    primaryContact: string;
    email: string;
    createdAt: Date;
    constructor( id: number,
        name: string,
        primaryContact: string,
        email: string,
        createdAt: Date) {
            this.id = id;
            this.name = name;
            this.primaryContact = primaryContact;
            this.email = email;
            this.createdAt = createdAt;

    }
  }