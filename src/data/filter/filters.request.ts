import SelectItemOption from "../select/select.item.option";

export class FilterEmployeesRequest {
    queries: number[] | string[];
    
      constructor(events: SelectItemOption[]) {
        this.queries = events.map((value, index) => value.id);
      }
    }