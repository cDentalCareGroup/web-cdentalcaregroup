export default class SelectItemOption {
    id: number;
    label: string;
    value: number;
    description: string | null = "";
    isSelected?: Boolean;
    constructor(id: number, label: string, value: number, description: string, isSelected: Boolean = false) {
      this.id = id;
      this.label = label;
      this.value = value;
      this.description = description;
      this.isSelected = isSelected;
    }
  }