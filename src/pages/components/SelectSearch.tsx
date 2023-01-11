import React from 'react';
import { Select } from 'antd';
import SelectItemOption from '../../data/select/select.item.option';


interface SelectSearchProps {
  placeholder: string;
  items: SelectItemOption[];
  onChange: (value: SelectItemOption) => void;
  icon: JSX.Element;
  defaultValue?: number;

}

const SelectSearch = ({ placeholder, onChange, items, icon, defaultValue }: SelectSearchProps) => {



  const handleOnChange = (option: number) => {
    const item = items.find((value, _) => value.id == option);
    if (item != null) {
      console.log(item);
      onChange(item);
    }
  }

  return (
    <div className='flex flex-row w-full gap-2 items-baseline'>
      {icon}
      <Select
        showSearch
        placeholder={placeholder}
        optionFilterProp="children"
        onChange={handleOnChange}
        size='large'
        className='flex w-full'
        defaultValue={defaultValue}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={
          items
        }
        allowClear
      />
    </div>
  );
}

export default SelectSearch;