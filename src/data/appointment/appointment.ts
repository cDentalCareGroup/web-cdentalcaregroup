
export class Appointment {
    id: number;
    appointment: string;
    branchId: number;
    branchName: string;
    scheduleBranchOfficeId: number;
    time: string;
    dentistId: number;
    receptionistId: number;
    status: string;
    costAmount: number;
    priceAmount: number;
    prospectId: number;
    patientId: number;
    scheduledAt: Date;
    treatmentCategoryId: number;
    treatmentCategory: string;
    folio: string;
    startedAt: string;
    finishedAt: string;
    comments: string;
    hasLabs?: number;
    constructor( id: number,
       appointment: string,
       branchId: number,
       branchName: string,
       scheduleBranchOfficeId: number,
       time: string,
       dentistId: number,
       receptionistId: number,
       status: string,
       costAmount: number,
       priceAmount: number,
       prospectId: number,
       patientId: number,
       scheduledAt: Date,
       treatmentCategoryId: number,
       treatmentCategory: string,
       folio: string,
       startedAt: string,
       finishedAt: string,
       comments: string,
       hasLabs?: number
       ) {
           this.id = id;
           this.appointment = appointment;
           this.branchId = branchId;
           this.branchName = branchName;
           this.scheduleBranchOfficeId = scheduleBranchOfficeId;
           this.time = time;
           this.dentistId = dentistId;
           this.receptionistId = receptionistId;
           this.status = status;
           this.costAmount = costAmount;
           this.priceAmount = priceAmount;
           this.prospectId = prospectId;
           this.patientId = patientId;
           this.scheduledAt = scheduledAt;
           this.treatmentCategoryId = treatmentCategoryId;
           this.treatmentCategory = treatmentCategory;
           this.folio = folio;
           this.startedAt = startedAt;
           this.comments = comments;
           this.finishedAt = finishedAt;
           this.hasLabs = hasLabs;
   
    }
   }