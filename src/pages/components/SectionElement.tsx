interface SectionElementProps {
    label: string;
    value: string | JSX.Element[];
    icon: JSX.Element;
    size?: string;
}


const SectionElement = ({ label, value, icon, size }: SectionElementProps) => {
    if (size == 'sm') {
        return (
            <div className="flex flex-row gap-2 items-center p-2 flex-wrap">
                <div className="flex gap-2 items-baseline">
                    {icon}
                    <span className="text-sm font-normal">{label}: </span>
                </div>
                <span className="text text-xs text-gray-600 flex flex-wrap flex-col">
                    {value}
                </span>
            </div>
        );
    } else {
        return (
            <div className="flex flex-row gap-2 items-center p-2 flex-wrap">
                <div className="flex gap-2 items-baseline">
                    {icon}
                    <span className="text text-base text-gray-500">{label}: </span>
                </div>
                <span className="text text-sm font-bold text-gray-600 flex flex-wrap flex-col">
                    {value}
                </span>
            </div>
        );
    }
}

export default SectionElement;