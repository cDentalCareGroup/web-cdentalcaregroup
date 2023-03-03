import { Button, Card, List, Tag } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { RiCouponLine, RiHospitalLine, RiMoneyDollarCircleLine, RiTodoLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { PadCatalogue } from "../../data/pad/pad.catalogue";
import { PadCatalogueDetail } from "../../data/pad/pad.catalogue.detail";
import { useGetPadCatalogsMutation } from "../../services/padService";
import Constants from "../../utils/Constants";
import { formatPrice, RESPONSIVE_LIST } from "../../utils/Extensions";
import { handleErrorNotification } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import SectionElement from "../components/SectionElement";
import LayoutCard from "../layouts/LayoutCard";

const PadCatalogues = () => {

    const [getPadCatalogs, { isLoading }] = useGetPadCatalogsMutation();
    const [data, setData] = useState<PadCatalogueDetail[]>([]);
    const [padCatalogueList, setPadCatalogueList] = useState<PadCatalogueDetail[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        handleGetPadCatalogs();
    }, []);


    const handleGetPadCatalogs = async () => {
        try {
            const response = await getPadCatalogs({}).unwrap();
            setData(response);
            setPadCatalogueList(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const getStauts = (value: any): JSX.Element => {
        if (value.status == Constants.STATUS_ACTIVE) {
            return <Tag color="success">Activo</Tag>
        }
        if (value.status == Constants.STATUS_INACTIVE) {
            return <Tag color="red">Inactivo</Tag>
        }
        return <></>;
    }


    const handleOnSearch = (query: string) => {
        if (query.length == 0 || query == "") {
            setPadCatalogueList(data);
        }
        const res = data?.filter((value) =>
            value.name
                .toLowerCase()
                .replace(/\s+/g, '')
                .includes(query.toLowerCase().replace(/\s+/g, '')));
        setPadCatalogueList(res);
    }

    return (
        <LayoutCard title={Strings.padCatalogue} isLoading={isLoading} content={
            <div className="flex flex-col">
                <Search onChange={(event) => handleOnSearch(event.target.value)} size="large" placeholder={Strings.searchPad} onSearch={handleOnSearch} enterButton />
                <div className="flex w-full items-end justify-end mt-4 mb-12">
                    <Button type="primary" onClick={() => navigate('/admin/pad/catalogs/register')}>Registrar pad</Button>
                </div>
                <List
                    grid={RESPONSIVE_LIST}
                    dataSource={padCatalogueList}
                    renderItem={(item) => (
                        <List.Item>
                            <Card actions={[
                                <span
                                onClick={() => navigate(`/admin/pad/catalogs/detail/${item.id}`)}
                                >{Strings.edit}</span>
                            ]} title={item.name}>
                                <SectionElement icon={<RiTodoLine />} label={Strings.description} value={item.description} />
                                <SectionElement icon={<RiMoneyDollarCircleLine />} label={Strings.price} value={formatPrice(Number(item.price))} />
                                <SectionElement icon={<RiCouponLine />} label={Strings.type} value={item.type} />
                                {getStauts(item)}
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        } />
    );
}

export default PadCatalogues;