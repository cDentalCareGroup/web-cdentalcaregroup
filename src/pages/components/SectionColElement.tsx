interface SectionColElementProps {
    label: string;
    value: string;
    icon?: JSX.Element;
}

const SectionColElement = ({label, value, icon}:SectionColElementProps) => {
    return (
        <div className="flex flex-col gap-2 p-2 flex-wrap">
            <div className="flex gap-2 items-baseline">
                {icon}
                <span className="text text-base font-bold text-gray-500">{label}: </span>
            </div>
            <span className="text text-sm text-gray-600">
                {value}
            </span>
        </div>
    );
}

export default SectionColElement;