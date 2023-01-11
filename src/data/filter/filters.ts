import SelectItemOption from "../select/select.item.option";

const DEFAULT_FILTERS = [
  new SelectItemOption(100, "Pad vigente", 100, ""),
  new SelectItemOption(200, "Pad vencido", 200, ""),
  new SelectItemOption(300, "Sin visita en 1 año (NO activos)", 300, ""),
  new SelectItemOption(400, "Todos", 400, ""),
  new SelectItemOption(500, "Activos", 500, ""),
  new SelectItemOption(600, "Hombres", 600, ""),
  new SelectItemOption(700, "Mujeres", 700, ""),
  new SelectItemOption(800, "Limpiar filtros", 800, ""),
];

const DEFAULT_APPOINTMENTS_FILTERS = [
  new SelectItemOption(1, "Activas", 1, ""),
  new SelectItemOption(2, "En proceso", 2, ""),
  new SelectItemOption(3, "Finalizadas", 3, ""),
  new SelectItemOption(4, "No atendidas", 4, ""),
];

const DEFAULT_PATIENTS_ACTIVE = [
  new SelectItemOption(500, "Activos", 500, ""),
];
export { DEFAULT_FILTERS, DEFAULT_APPOINTMENTS_FILTERS,DEFAULT_PATIENTS_ACTIVE };