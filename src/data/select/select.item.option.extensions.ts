import { AppointmentDetail } from '../appointment/appointment.detail';
import { AvailableTime } from '../appointment/available.time';
import { BranchOffice } from '../branchoffice/branchoffice';
import { Patient } from '../patient/patient';
import { ServiceCategory } from '../service/service.category';
import SelectItemOption from './select.item.option';
const sortSelectItemOptions = (options: SelectItemOption[]): SelectItemOption[] => {
  return options.sort(compareSelectItemOptions);
}

const resetSelectItemOptions = (options: SelectItemOption[]): SelectItemOption[] => {
  return options.map((value, index) => {
    const item = value;
    item.isSelected = false;
    return item;
  });
}

const resetSingleSelectItemOptions = (options: SelectItemOption[], element: SelectItemOption): SelectItemOption[] => {
  return options.map((value, index) => {
    const item: SelectItemOption = value;
    if (item.id == element.id) {
      item.isSelected = false;
    }
    return item;
  });
}

const compareSelectItemOptions = (a: SelectItemOption, b: SelectItemOption) => {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
}

const branchOfficesToSelectOptionItem = (
  branchOffices: BranchOffice[] | undefined
): SelectItemOption[] => {
  try {
    let result: SelectItemOption[] = [];
    if (branchOffices != undefined && branchOffices != null) {
      result = branchOffices.map(
        (value, _) => new SelectItemOption(value.id, `${value.name} - ${value.street} ${value.number} ${value.colony}, CP.${value.cp}`, value.id, `${value.street} ${value.number} ${value.colony}, CP.${value.cp}`)
      );
    }
    return result;
  } catch (error) {
    return [];
  }
};

const branchOfficesToSelectOptionItemEmptyDescription = (
  branchOffices: BranchOffice[] | undefined
): SelectItemOption[] => {
  try {
    let result: SelectItemOption[] = [];
    if (branchOffices != undefined && branchOffices != null) {
      result = branchOffices.map(
        (value, _) => new SelectItemOption(value.id, value.name, value.id, `${value.street} ${value.number} ${value.colony}, CP.${value.cp}`)
      );
    }
    return result;
  } catch (error) {
    return [];
  }
};

const patientsToSelectItemOption = (list: Patient[]): SelectItemOption[] => {
  return list.map((value, _) => new SelectItemOption(value.id, `${value.name} ${value.lastname} ${value.secondLastname}`, value.id, ``))
}

const patientToSelectItemOption = (value: Patient): SelectItemOption => {
  return new SelectItemOption(value.id, `${value.name} ${value.lastname} ${value.secondLastname}`, value.id, ``)
}

const appointmentToBranchOfficeSelectItemOption = (data: AppointmentDetail | undefined) => {
  if (data != null && data != undefined) {
    return new SelectItemOption(data.branchOffice.id,
      data.branchOffice.name,
      data.branchOffice.id,
      `${data.branchOffice.street} ${data.branchOffice.number} ${data.branchOffice.colony}, CP.${data.branchOffice.cp}`
    );
  }
}

const appointmentToDentistSelectItemOption = (data: AppointmentDetail) => {
  const id = Number(data.dentist?.id ?? 0);
  return new SelectItemOption(id,
    `${data.dentist?.name} ${data.dentist?.lastname} ${data.dentist?.secondLastname}`,
    id,
    ``
  );
}

const appointmentToPatientSelectItemOption = (data: AppointmentDetail) => {
  return new SelectItemOption(data.patient?.id ?? 0, `${data.patient?.name} ${data.patient?.lastname} ${data.patient?.secondLastname ?? ''}`, data.patient?.id ?? 0, ``);
}



const timesToSelectItemOption = (data: AvailableTime[]): SelectItemOption[] => {
  return data.map((value, index) => new SelectItemOption(index, value.time, index, value.simpleTime));
}

const serviceCategoriesToSelectItemOption = (data: ServiceCategory[]): SelectItemOption[] => {
  return data.map((value, index) => new SelectItemOption(value.id, value.name, value.id, value.name));
}

export {
  sortSelectItemOptions,
  resetSelectItemOptions,
  resetSingleSelectItemOptions,
  branchOfficesToSelectOptionItem,
  patientsToSelectItemOption,
  appointmentToBranchOfficeSelectItemOption,
  appointmentToDentistSelectItemOption,
  branchOfficesToSelectOptionItemEmptyDescription,
  appointmentToPatientSelectItemOption,
  timesToSelectItemOption,
  serviceCategoriesToSelectItemOption,
  patientToSelectItemOption
};