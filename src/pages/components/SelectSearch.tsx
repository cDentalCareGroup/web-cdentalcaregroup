import React from 'react';
import { Select } from 'antd';
import SelectItemOption from '../../data/select/select.item.option';


interface SelectSearchProps {
  placeholder: string;
  items: SelectItemOption[];
  onChange: (value: SelectItemOption) => void;
  icon: JSX.Element;

}

const SelectSearch = ({ placeholder, onChange, items, icon }: SelectSearchProps) => {



  const handleOnChange = (option: number) => {
    const item = items.find((value, _) => value.id == option);
    if (item != null) {
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
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={
          items
        }
      />
    </div>
  );
}

export default SelectSearch;