export class BranchOffice {
    id: number;
    name: string;
    street: string;
    number: string;
    colony: string;
    cp: string;
    primaryContact: string;
    primaryBranchOfficeContact: string;
    email: string;
    status: number;
    lat: number;
    lng: number;
    appointmens?: number;

    constructor(id: number,
        name: string,
        street: string,
        number: string,
        colony: string,
        cp: string,
        primaryContact: string,
        primaryBranchOfficeContact: string,
        email: string,
        status: number,lat: number,
        lng: number, appointmens?: number) {
         this.id = id; 
         this.name = name; 
         this.street = street; 
         this.number = number; 
         this.colony = colony; 
         this.cp = cp; 
         this.primaryContact = primaryContact;   
         this.primaryBranchOfficeContact = primaryBranchOfficeContact;   
         this.email = email;   
         this.status = status; 
         this.lat = lat; 
         this.lng = lng;  
         this.appointmens = appointmens;
        }
  }