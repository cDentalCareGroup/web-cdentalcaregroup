export class Patient {
    id: number;
    name: string;
    lastname: string;
    secondLastname: string;
    birthDay: Date;
    gender: string;
    maritalStatus: string;
    job: string;
    street: string;
    number: string;
    colony: string;
    cp: string;
    primaryContact: string;
    secondaryContact: string;
    email: string;
    folio: string;
    historicalFolio: string;
    rfc: string;
    originBranchOfficeId: number;
    state: string;
    lat: number;
    lng: number;
    status: string;
    patientStatus: number;
    sourceBranch: string;
    currentBranch: string;
    startDate: Date;
    sourceClient: string;
    organizationClient: string;
    pad: number;
    currentPadId: number;
    padType: string;
    padAcquisitionDate: Date;
    padExpirationDate: Date;
    padAcquisitionBranch: string;
    padPrice: number;
    createdAt: Date;
    updatedAt: Date;
    nextDateAppointment: Date; 
  
  
    constructor(  id: number,
      name: string,
      lastname: string,
      secondLastname: string,
      birthDay: Date,
      gender: string,
      maritalStatus: string,
      job: string,
      street: string,
      number: string,
      colony: string,
      cp: string,
      primaryContact: string,
      secondaryContact: string,
      email: string,
      folio: string,
      historicalFolio: string,
      rfc: string,
      originBranchOfficeId: number,
      state: string,
      lat: number,
      lng: number,
      status: string,
      patientStatus: number,
      sourceBranch: string,
      currentBranch: string,
      startDate: Date,
      sourceClient: string,
      organizationClient: string,
      pad: number,
      currentPadId: number,
      padType: string,
      padAcquisitionDate: Date,
      padExpirationDate: Date,
      padAcquisitionBranch: string,
      padPrice: number,
      createdAt: Date,
      updatedAt: Date,
      nextDateAppointment: Date) {
      
  
          this.id = id;
          this.name = name;
          this.lastname = lastname;
          this.secondLastname = secondLastname;
          this.birthDay = birthDay;
          this.gender = gender;
          this.maritalStatus = maritalStatus;
          this.job = job;
          this.street = street;
          this.number = number;
          this.colony = colony;
          this.cp = cp;
          this.primaryContact = primaryContact;
          this.secondaryContact = secondaryContact;
          this.email = email;
          this.folio = folio;
          this.historicalFolio = historicalFolio;
          this.rfc = rfc;
          this.originBranchOfficeId = originBranchOfficeId;
          this.state = state;
          this.lat = lat;
          this.lng = lng;
          this.status = status;
          this.patientStatus = patientStatus;
          this.sourceBranch = sourceBranch;
          this.currentBranch = currentBranch;
          this.startDate = startDate;
          this.sourceClient = sourceClient;
          this.organizationClient = organizationClient;
          this.pad = pad;
          this.currentPadId = currentPadId;
          this.padType = padType;
          this.padAcquisitionDate = padAcquisitionDate;
          this.padExpirationDate = padExpirationDate;
          this.padAcquisitionBranch = padAcquisitionBranch;
          this.padPrice = padPrice;
          this.createdAt = createdAt;
          this.updatedAt = updatedAt;
          this.nextDateAppointment = nextDateAppointment;
      }
  }