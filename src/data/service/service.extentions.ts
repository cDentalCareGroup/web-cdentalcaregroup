import SelectItemOption from "../select/select.item.option"
import { Service } from "./service"


const servicesToSelectItemOption = (data: Service[]): SelectItemOption[] => {
    const options = data.map((value,_) => new SelectItemOption(value.id, value.name,value.id,''));
    return options;
}


export {
    servicesToSelectItemOption
}