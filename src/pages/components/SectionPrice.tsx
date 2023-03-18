import { formatPrice } from "../../utils/Extensions";

interface SectionPriceProps {
    label: string;
    price: number;
    danger?: boolean;
}


const SectionPrice = (props: SectionPriceProps) => {
    return (
        <div className="flex flex-row w-full items-end justify-end gap-2">
            <span className="text font-bold text-base text-gray-600">
                {props.label}:
            </span>
            <span className={`text font-semibold text-base ${props.danger == true ? 'text-red-800' : ''}`}>
                {formatPrice(props.price)}
            </span>
        </div>
    );
}

export default SectionPrice;