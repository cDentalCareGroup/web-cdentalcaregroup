import Input from "antd/es/input/Input";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";

interface CustomFormInputProps {
    label: string;
    value: string;
    icon?: JSX.Element;
    placeholder?: string;
    prefix?: string;
    isArea?: boolean;
    onChange: (value: string) => void;
}

const CustomFormInput = ({ label, onChange, icon, placeholder, prefix, isArea, value }: CustomFormInputProps) => {

    const [currentValue, setCurrentValue] = useState(value);

    const handleOnChange = (value: string) => {
        setCurrentValue(value);
        onChange(value);

    }
    return (
        <div className="flex flex-col flex-wrap gap-2 mt-2 mb-2">
            <span className="flex">{label}</span>
            {isArea == true && <TextArea
                showCount
                rows={6}
                maxLength={150}
                value={currentValue}
                defaultValue={currentValue}
                style={{ height: 120, marginBottom: 5 }}
                onChange={((event) => handleOnChange(event.target.value))}
                placeholder={placeholder}
            />}

            {!isArea && <Input size="large"
                addonBefore={prefix}
                onChange={((event) => handleOnChange(event.target.value))}
                prefix={icon}
                defaultValue={currentValue}
                value={currentValue}
                placeholder={placeholder} />}
        </div>
    );
}

export default CustomFormInput;