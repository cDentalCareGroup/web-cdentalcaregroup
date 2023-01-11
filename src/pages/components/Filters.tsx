import { Button, Layout } from "antd";
import Tag from "antd/es/tag";
import { useState } from "react";
import SelectItemOption from "../../data/select/select.item.option";
import { sortSelectItemOptions, resetSelectItemOptions, resetSingleSelectItemOptions } from '../../data/select/select.item.option.extensions';

interface FiltersProps {
    data: SelectItemOption[];
    onFilterChange: (filter: SelectItemOption[]) => void;
}
const Filters = ({ data, onFilterChange }: FiltersProps) => {
    const [filters, setFilters] = useState<SelectItemOption[]>([]);
    const [options, setOptions] = useState<SelectItemOption[]>(sortSelectItemOptions(data));

    const handleFilter = (value: SelectItemOption) => {
        if (value.id == 800) {
            setFilters([]);
            setOptions(resetSelectItemOptions(options));
            onFilterChange([value]);
            return;
        }
        const element = filters.find((element, _) => element.id == value.id);
        if (element == null) {
            const item = value;
            item.isSelected = true;
            filters.push(item);
            const newOptions = options.filter((op, _) => op.id != value.id);
            newOptions.push(item);
            setOptions(sortSelectItemOptions(newOptions));
            setFilters(filters);
            onFilterChange(filters);
        } else {
            setOptions(resetSingleSelectItemOptions(options, value));
            const newFilters = filters.filter((element, _) => element.id != value.id);
            setFilters(newFilters);
            onFilterChange(newFilters);
        }
    }


    return (<div className="m-2">
        <div className="">
            <div className="flex flex-row items-center justify-center">
                <div className="flex flex-row items-center justify-center flex-wrap  ">
                    {options.map((value, index) => 
                        <Button key={index}  onClick={() => handleFilter(value)} type={`${value.isSelected ? 'primary' :'text'}`}>{value.label}</Button>
                    )}
                </div>
            </div>
        </div>
    </div>);
}

export default Filters;