interface SectionElementProps {
    label: string;
    value: string;
    icon: JSX.Element;
}


const SectionElement = ({ label, value, icon }: SectionElementProps) => {
    return (
        <div className="flex flex-row gap-2 items-center p-2 flex-wrap">
            <div className="flex gap-2 items-baseline">
                {icon}
                <span className="text text-base text-gray-500">{label}: </span>
            </div>
            <span className="text text-sm font-bold text-gray-600">
                {value}
            </span>
        </div>);
}

export default SectionElement;