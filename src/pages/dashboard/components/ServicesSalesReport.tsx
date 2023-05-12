import { Card, Row } from 'antd';
import { useEffect, useState } from 'react';
import SelectItemOption from '../../../data/select/select.item.option';
import { serviceCategoriesToSelectItemOption } from '../../../data/select/select.item.option.extensions';
import { PieData } from '../../../data/statistics/statistic.extensions';
import { useGetServiceCategoriesMutation } from '../../../services/padService';
import { useGetServiceSalesReportMutation } from '../../../services/statisticService';
import { handleErrorNotification } from '../../../utils/Notifications';
import SelectSearch from '../../components/SelectSearch';
import PieChar from './PieChar';
import NoData from '../../components/NoData';
import Strings from '../../../utils/Strings';

export const ServicesSalesReport = () => {
  const [getServiceCategories] = useGetServiceCategoriesMutation();
  const [serviceCategoryList, setServiceCategoryList] = useState<SelectItemOption[]>([]);
  const [serviceCategory, setServiceCategory] = useState<SelectItemOption>()
  const [getServiceSalesReport] = useGetServiceSalesReportMutation();

  const [serviceSalesData, setServiceSalesData] = useState<any[]>([]);

  useEffect(() => {
    handleGetServiceCategories();
  }, [])

  const handleGetServiceCategories = async () => {
    try {
      const response = await getServiceCategories({}).unwrap();
      setServiceCategoryList(serviceCategoriesToSelectItemOption(response));
    } catch (error) {
      handleErrorNotification(error);
    }
  }


  const handleGetServicesSalesReport = async (id: number) => {
    try {
      const response = await getServiceSalesReport({
        'categoryId': id
      }).unwrap();
      setServiceSalesData(response);
    } catch (error) {
      handleErrorNotification(error);
    }
  }


  return (
    <div className="flex flex-col">
      <SelectSearch
        placeholder={Strings.selectCategory}
        items={serviceCategoryList}
        onChange={(event) => {
          handleGetServicesSalesReport(event.id)
          setServiceCategory(event);
        }}
        icon={<></>}
      />
      <br />

      <Row>
        {serviceSalesData.map((value, index) => <Card key={index} className='flex flex-col m-2'>
          <span>{value.branchOffice.name}</span>
          {value.services.length == 0 && <NoData />}
          {value.services.length > 0 && <PieChar data={value.services.map((item: any, _: number) => new PieData(item.service.name, item.total))} onClick={() => { }} />}
        </Card>)}
      </Row>

    </div>
  );
};

// grafica de pie de ventas de pads por sucursales


