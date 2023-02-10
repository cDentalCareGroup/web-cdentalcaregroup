import { Select } from "antd";
import SelectItemOption from "../../data/select/select.item.option";

interface MultiSelectSearchProps {
    placeholder: string;
    items: SelectItemOption[];
    onChange: (value: number[]) => void;
    icon: JSX.Element;
    defaultValues?: number[];

}

const MultiSelectSearch = ({ placeholder, onChange, items, icon, defaultValues }: MultiSelectSearchProps) => {

    const handleOnChange = (option: number[]) => {
        onChange(option);
    }

    return (
        <div className='flex flex-row w-full gap-2 items-baseline'>
            {icon}
            <Select
                showSearch
                mode="multiple"
                allowClear
                style={{width:'100%'}}
                placeholder={placeholder}
                defaultValue={defaultValues}
                onChange={handleOnChange}
                options={items}
                size='large'
                filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
            />
        </div>
    );
}

export default MultiSelectSearch;