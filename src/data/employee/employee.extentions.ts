import SelectItemOption from "../select/select.item.option";
import { Employee } from "./employee";

const employeesToSelectItemOptions = (data: Employee[], showDescription: Boolean = false): SelectItemOption[] => {
  
    return data.map((value, index) => {
      const description = showDescription ? `${value.typeName}` : ``;
      return new SelectItemOption(value.id, `${value.name} ${value.lastname}`, index, description)
    });
  }

  export {employeesToSelectItemOptions};