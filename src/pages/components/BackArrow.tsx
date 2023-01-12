import { RiArrowLeftSLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Strings from "../../utils/Strings";

const BackArrow = () => {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(-1)} className="flex flex-row items-center align-baseline gap-2 text-blue-800 cursor-pointer mb-4">
            <RiArrowLeftSLine size={24} />
            <span className="text text-sm">{Strings.return}</span>
        </div>
    );
}

export default BackArrow;