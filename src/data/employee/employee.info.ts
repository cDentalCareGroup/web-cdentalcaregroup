import { BranchOffice } from "../branchoffice/branchoffice";
import { Employee } from "./employee";

export interface EmployeeInfo {
    employee: Employee;
    branchOffice: BranchOffice;
}