

 export class Employee{
    id: number;
    name: string;
    lastname: string;
    secondLastname: string;
    status: number;
    stateId: number;
    municipalityId: number;
    jobScheme: number;
    typeId: number;
    branchOfficeId: number;
    street: string;
    number: string;
    colony: string;
    cp: string;
    primaryContact: string;
    secondaryContact: string;
    curp: string;
    birthDay: Date;
    rfc: string;
    nss: string;
    typeName?: string;
  
    constructor(id: number,
      name: string,
      lastname: string,
      secondLastname: string,
      status: number,
      stateId: number,
      municipalityId: number,
      jobScheme: number,
      typeId: number,
      branchOfficeId: number,
      street: string,
      number: string,
      colony: string,
      cp: string,
      primaryContact: string,
      secondaryContact: string,
      curp: string,
      birthDay: Date,
      rfc: string,
      nss: string, typeName?: string){
          this.id = id;
          this.name = name;
          this.lastname = lastname;
          this.secondLastname = secondLastname;
          this.status = status;
          this.stateId = stateId;
          this.municipalityId = municipalityId;
          this.jobScheme = jobScheme;
          this.typeId = typeId;
          this.branchOfficeId = branchOfficeId;
          this.street = street;
          this.number = number;
          this.colony = colony;
          this.cp = cp;
          this.primaryContact = primaryContact;
          this.secondaryContact = secondaryContact;
          this.curp = curp;
          this.birthDay = birthDay;
          this.rfc = rfc;
          this.nss = nss;
          this.typeName = typeName;
  
    }
  }