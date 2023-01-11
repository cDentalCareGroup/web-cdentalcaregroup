import { Button } from "antd";
import React from "react";
import { useEffect, useState } from "react";
import SelectItemOption from '../../data/select/select.item.option';
import { sortSelectItemOptions } from '../../data/select/select.item.option.extensions';

interface SingleFiltersProps {
    data: SelectItemOption[];
    onFilterChange: (filter: SelectItemOption) => void;
    defaultOption?: SelectItemOption;
}
const SingleFilters = ({ data, onFilterChange, defaultOption }: SingleFiltersProps) => {


    const [filter, setFilter] = useState<SelectItemOption | undefined>(defaultOption);
    const [options, setOptions] = useState<SelectItemOption[]>(sortSelectItemOptions(data));

    useEffect(() => {
        setFilter(defaultOption);
    }, [defaultOption]);

    const handleFilter = (value: SelectItemOption) => {
        setFilter(value);
        onFilterChange(value);
    }

    return (
        <div className="mt-4">
            <div className="flex flex-row items-center justify-center">
                    <div className="flex flex-row items-center justify-center flex-wrap  ">
                        {options.map((value, index) =>
                            <Button key={index} onClick={() => handleFilter(value)} type={`${value.id == filter?.id ? 'primary' : 'text'}`}>{value.label}</Button>
                        )}
                    </div>
                </div>
        </div>);
}

export default SingleFilters;