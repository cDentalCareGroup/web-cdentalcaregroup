

interface LayoutTitleProps {
    title: string;
}

const LayoutTitle = ({title}:LayoutTitleProps) => {
    return (<h2 className="lg:text-2xl md:text-2xl sm:text-xs font-semibold text-[#00152A] w-full mb-6">
       {title}
    </h2>);
}

export default LayoutTitle;