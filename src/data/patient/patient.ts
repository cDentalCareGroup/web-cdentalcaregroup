import { Pad } from "../pad/pad";
import { PadCatalogue } from "../pad/pad.catalogue";
import { PadComponent } from "../pad/pad.component";
import { Service } from "../service/service";

export interface Patient {
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
    currentBranchOfficeId: number;
    startDate: Date;
    sourceClient: string;
    organizationClient: string;
    pad: number;
    currentPadId: number;
    padType: string;
    padAcquisitionDate: string;
    padExpirationDate: string;
    padAcquisitionBranch: string;
    padPrice: number;
    createdAt: Date;
    updatedAt: Date;
    city: string;

  }


  export interface PatientInfo {
    patient: Patient;
    pad?: PadData;
  }

  export interface PadData {
    pad?: Pad;
    padCatalog?: PadCatalogue;
    component?: PadComponentService[]
  }

  export interface PadComponentService{
    service: Service;
    component: PadComponent;
  }