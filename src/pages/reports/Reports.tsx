import React, { useState } from 'react';
import { Button, Collapse, DatePicker, Form, Table, Row, Col } from 'antd';
import LayoutCard from '../layouts/LayoutCard';
import SectionElement from '../components/SectionElement';
import Strings from '../../utils/Strings';
import { usePostReportsMutation } from '../../services/reportsService';
import { handleErrorNotification } from '../../utils/Notifications';
import { Reports } from '../../data/reports/report';
const { Panel } = Collapse;

interface Report {
	name: string;
	lastname: string;
	primaryContact: string;
	appointment: string;
}

const ReportsComponent: React.FC = () => {
	const [started_at, setStarted_at] = useState<string | null>(null);
	const [finished_at, setFinished_at] = useState<string | null>(null);
	const [tableData, setTableData] = useState<Report[]>([]);
	const [postReports] = usePostReportsMutation();

	const handleConsultClick = async () => {
		try {
			const result = await postReports({ started_at, finished_at }).unwrap();
			if (Array.isArray(result)) {
				const mappedData: Report[] = result.map((item: Reports) => ({
					name: item.patient.name,
					lastname: item.patient.lastname,
					primaryContact: item.patient.primaryContact,
					appointment: item.appointment,
				}));

				setTableData(mappedData);
			}
		} catch (error) {
			handleErrorNotification(error);
		}
	};

	
	return (
		<LayoutCard
		  title={Strings.reports}
		  isLoading={false}
		  content={
			<Collapse>
			  <Panel header="Visualización de reportes" key="1">
				<div className="flex justify-between items-center">
				  <div className="flex">
					<div>
					  <SectionElement
						label={Strings.started_at}
						icon={<></>}
						value={``}
					  />
					  <Form.Item
						rules={[{ required: true, message: Strings.requiredField }]}
					  >
						<DatePicker
						  size="large"
						  style={{ minWidth: 200 }}
						  onChange={(date, dateString) => setStarted_at(dateString)}
						/>
					  </Form.Item>
					</div>
	  
					<div style={{ marginLeft: '20px' }}>
					  <SectionElement
						label={Strings.finished_at}
						icon={<></>}
						value={``}
					  />
					  <Form.Item
						rules={[{ required: true, message: Strings.requiredField }]}
					  >
						<DatePicker
						  size="large"
						  style={{ minWidth: 200 }}
						  onChange={(date, dateString) => setFinished_at(dateString)}
						/>
					  </Form.Item>
					</div>
				  </div>
	  
				  <div>
					<Button type="primary" onClick={() => handleConsultClick()}>
					  {Strings.ReportConsult}
					</Button>
				  </div>
				</div>
	  
				<Table dataSource={tableData}>
				  <Table.Column title="Nombre" dataIndex="name" key="name" />
				  <Table.Column title="Apellido" dataIndex="lastname" key="lastname" />
				  <Table.Column title="Teléfono" dataIndex="primaryContact" key="primaryContact" />
				  <Table.Column title="Fecha de la Última Cita" dataIndex="appointment" key="appointment" />
				</Table>
			  </Panel>
			</Collapse>
		  }
		/>
	  );
	  
};

export default ReportsComponent;
