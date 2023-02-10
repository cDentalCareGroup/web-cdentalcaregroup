import SelectItemOption from "../select/select.item.option";
import { PadCatalogueDetail } from "./pad.catalogue.detail";



const padCatalogueDetailToDataTable = (response: PadCatalogueDetail): any[] => {
    let data: any[] = [];
    for (const item of response.components ?? []) {
        data.push({
            key: item.componentId,
            service: item.serviceName,
            quantityPad: item.globalQuantity,
            quantityPatient: item.maxPatientQuantity,
            discount: item.discount
        })
    }
    return data;
}

const padCatalogsToSelectItemOption = (response: PadCatalogueDetail[]): SelectItemOption[] => {
    return response.map((value, _) => new SelectItemOption(value.id, value.name, value.id, ''));
}

export {
    padCatalogueDetailToDataTable,
    padCatalogsToSelectItemOption
}