import LayoutCard from "../layouts/LayoutCard";

const Test = () => {

    return (
        <LayoutCard
            isLoading={false}
            content={
                <div>
                    <span>testing</span>
                </div>
            }
        />
    );
}

export default Test;