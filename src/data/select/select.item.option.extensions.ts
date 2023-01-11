import { BranchOffice } from '../branchoffice/branchoffice';
import { Patient } from '../patient/patient';
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
          (value, _) => new SelectItemOption(value.id, value.name, value.id, `${value.street} ${value.number} ${value.colony}, CP.${value.cp}`)
        );
      }
      return result;
    } catch (error) {
      return [];
    }
  };

  const patientsToSelectItemOption = (list: Patient[]): SelectItemOption[] => {
    return list.map((value, _) => new SelectItemOption(value.id,`${value.name} ${value.lastname} ${value.secondLastname}`,value.id,``))
  }
  export  {
    sortSelectItemOptions,
    resetSelectItemOptions,
    resetSingleSelectItemOptions,
    branchOfficesToSelectOptionItem,
    patientsToSelectItemOption
  };