import { capitalizeFirstLetter } from "../../utils/Extensions";
import SelectItemOption from "../select/select.item.option";
import { Employee } from "./employee";

const employeesToSelectItemOptions = (data: Employee[], showDescription: Boolean = false): SelectItemOption[] => {

  return data.map((value, _) => {
    const description = showDescription ? `${value.typeName}` : ``;
    return new SelectItemOption(value.id, `${value.name} ${value.lastname} - ${value.typeName}`, value.id, description)
  });
}

const employeesToSelectItemOptionsEmpty = (data: Employee[]): SelectItemOption[] => {
  return data.map((value, _) => {
    return new SelectItemOption(
      value.id, 
      `${capitalizeFirstLetter(value.name)} ${capitalizeFirstLetter(value.lastname)} ${capitalizeFirstLetter(value?.secondLastname ?? '')}`, 
      value.id, 
      '');
  });
}

const buildEmployeeName = (employee: Employee): string => {
  return `
    ${capitalizeFirstLetter(employee.name)} 
    ${capitalizeFirstLetter(employee.lastname)} 
    ${capitalizeFirstLetter(employee.secondLastname ?? '')}`;
}

const buildEmployeeEmail = (employee: Employee): string => {
  if (employee.email != "" && employee.email != null) {
      return employee.email;
  }
  return `-`;
}
const buildEmployeeNumber = (employee: Employee): string => {
  return `${employee?.primaryContact ?? '-'}`;
}

export { 
  employeesToSelectItemOptions, 
  buildEmployeeName,
  employeesToSelectItemOptionsEmpty,
  buildEmployeeEmail,
  buildEmployeeNumber
 };