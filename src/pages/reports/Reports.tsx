import React, { useState } from 'react';
import { Button, Collapse, DatePicker, Form, Table, Row, Col } from 'antd';
import LayoutCard from '../layouts/LayoutCard';
import SectionElement from '../components/SectionElement';
import Strings from '../../utils/Strings';
import { usePostReportsMutation } from '../../services/reportsService';
import { handleErrorNotification } from '../../utils/Notifications';

const { Panel } = Collapse;

interface Report {
	name: string;
	lastname: string;
	primaryContact: string;
	appointment: string;
}

const ReportsComponent: React.FC = () => {
	const [startedAt, setStartedAt] = useState<string | null>(null);
	const [finishedAt, setFinishedAt] = useState<string | null>(null);
	const [tableData, setTableData] = useState<Report[]>([]);
	const [postReports] = usePostReportsMutation();

	const handleConsultClick = async () => {
		try {
			const result = await postReports({ startedAt , finishedAt}).unwrap();
	
			if (Array.isArray(result)) {
				setTableData(result);
			}
		} catch (error) {
			handleErrorNotification(error);
			console.log(error);
		}
	};
	
	return (
		<LayoutCard
		  title={Strings.reports}
		  isLoading={false}
		  content={
			<Collapse >
			  <Panel header="Visualización de reportes" key="1">
				<div className="flex justify-between items-center">
				  <div className="flex">
					<div>
					  <SectionElement
						label={Strings.startedAt}
						icon={<></>}
						value={``}
					  />
					  <Form.Item
						rules={[{ required: true, message: Strings.requiredField }]}
					  >
						<DatePicker
						  size="large"
						  style={{ minWidth: 200 }}
						  onChange={(date, dateString) => setStartedAt(dateString)}
						/>
					  </Form.Item>
					</div>
	  
					<div style={{ marginLeft: '20px' }}>
					  <SectionElement
						label={Strings.finishedAt}
						icon={<></>}
						value={``}
					  />
					  <Form.Item
						rules={[{ required: true, message: Strings.requiredField }]}
					  >
						<DatePicker
						  size="large"
						  style={{ minWidth: 200 }}
						  onChange={(date, dateString) => setFinishedAt(dateString)}
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
				  <Table.Column title={Strings.namePatienReport} dataIndex="name" key="name" />
				  <Table.Column title={Strings.lastNamePatientReport} dataIndex="lastname" key="lastname" />
				  <Table.Column title={Strings.phonePatientReport} dataIndex="primaryContact" key="primaryContact" />
				  <Table.Column title={Strings.datePatientReport} dataIndex="appointment" key="appointment" />
				</Table>
			  </Panel>
			</Collapse>
		  }
		/>
	  );
	  
};

export default ReportsComponent;
