import { Button, Card, Divider, List, Modal, Tag, Pagination } from 'antd';
import Search from 'antd/es/input/Search';
import { useEffect, useState } from 'react';
import {
	RiDeleteBin7Line,
	RiMentalHealthLine,
	RiUserHeartLine,
} from 'react-icons/ri';
import useSessionStorage from '../../core/sessionStorage';
import { DEFAULT_FILTERS } from '../../data/filter/filters';
import { FilterEmployeesRequest } from '../../data/filter/filters.request';
import { PadDetail } from '../../data/pad/pad.detail';
import { Patient } from '../../data/patient/patient';
import { buildPatientName } from '../../data/patient/patient.extensions';
import SelectItemOption from '../../data/select/select.item.option';
import { patientsToSelectItemOption } from '../../data/select/select.item.option.extensions';
import User from '../../data/user/user';
import {
	useGetPadsMutation,
	useRegisterAditionalMemberMutation,
} from '../../services/padService';
import {
	useGetPatientsByBranchOfficeMutation,
	useGetPatientsMutation,
} from '../../services/patientService';
import Constants from '../../utils/Constants';
import { UserRoles } from '../../utils/Extensions';
import {
	handleErrorNotification,
	handleSucccessNotification,
	NotificationSuccess,
} from '../../utils/Notifications';
import Strings from '../../utils/Strings';
import SectionElement from '../components/SectionElement';
import SelectSearch from '../components/SelectSearch';
import LayoutCard from '../layouts/LayoutCard';
import PadCard from './components/PadCard';
import FormPad from './FormPad';

interface PadsProps {
	rol: UserRoles;
}

const Pads = (props: PadsProps) => {
	const [getPads, { isLoading }] = useGetPadsMutation();
	const [data, setData] = useState<PadDetail[]>([]);
	const [padList, setPadList] = useState<PadDetail[]>([]);
	const [branchId, setBranchId] = useSessionStorage(Constants.BRANCH_ID, 0);
	const [session, setSession] = useSessionStorage(Constants.SESSION_AUTH, 0);
	const [getPatients] = useGetPatientsMutation();
	const [getPatientsByBranchOffice] = useGetPatientsByBranchOfficeMutation();
	const [patientList, setPatientList] = useState<SelectItemOption[]>([]);
	const [patient, setPatient] = useState<SelectItemOption>();
	const [aditionalMembers, setAditionalMembers] = useState<SelectItemOption[]>(
		[]
	);
	const [registerAditionalMember] = useRegisterAditionalMemberMutation();

	const [selectedPad, setSelectedPad] = useState<PadDetail>();
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [isListLoading, setIsListLoading] = useState(false);
	const [isActionLoading, setIsActionLoading] = useState(false);

	useEffect(() => {
		handleGetPads();
		if (props.rol == UserRoles.ADMIN) {
			handleGetAllPatients();
		} else {
			handleGetPatients();
		}
	}, []);

	const [currentPage, setCurrentPage] = useState(1);
	const cardsPerPage = 20; 

	const indexOfLastCard = currentPage * cardsPerPage;
	const indexOfFirstCard = indexOfLastCard - cardsPerPage;
	const currentPads = padList.slice(indexOfFirstCard, indexOfLastCard);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleGetPads = async () => {
		try {
			const response = await getPads({}).unwrap();
			if (props.rol == UserRoles.RECEPTIONIST) {
				console.log(`Process rep pads`);
				const processResponse = processPadsInBranchOffice(branchId, response);
				setData(processResponse);
				setPadList(processResponse);
			} else {
				setData(response);
				setPadList(response);
			}
		} catch (error) {
			handleErrorNotification(error);
		}
	};

	const processPadsInBranchOffice = (
		branch: number,
		response: PadDetail[]
	): PadDetail[] => {
		let newData = [];
		for (const item of response) {
			if (
				item.members.filter((value, _) => value.currentBranchOfficeId == branch)
					.length > 0
			) {
				newData.push(item);
			}
		}
		return newData;
	};

	const handleOnSearch = (query: string) => {
		if (query.length == 0 || query == '') {
			setPadList(data);
		}
		const res = data?.filter(
			(value) =>
				value.members.filter((member, _) =>
					buildPatientName(member)
						.toLowerCase()
						.replace(/\s+/g, '')
						.includes(query.toLowerCase().replace(/\s+/g, ''))
				).length > 0
		);
		setPadList(res);
	};

	const handleGetPatients = async () => {
		try {
			const response = await getPatientsByBranchOffice(
				Number(branchId)
			).unwrap();
			const filterData = response.filter(
				(value, _) => value.pad == 0 || value.pad == null
			);
			setPatientList(patientsToSelectItemOption(filterData));
		} catch (error) {
			handleErrorNotification(error);
		}
	};

	const handleGetAllPatients = async () => {
		try {
			const response = await getPatients(
				new FilterEmployeesRequest([DEFAULT_FILTERS[3]])
			).unwrap();
			const filterData = response.filter(
				(value, _) => value.pad == 0 || value.pad == null
			);
			setPatientList(patientsToSelectItemOption(filterData));
		} catch (error) {
			handleErrorNotification(error);
		}
	};

	const buildPadMembers = () => {
		return (
			selectedPad?.members.map((value, _) => {
				if (value.id == selectedPad?.principalId) {
					return <span>{`* ${buildPatientName(value)}`}</span>;
				} else {
					return <span>{`${buildPatientName(value)}`}</span>;
				}
			}) ?? []
		);
	};

	const handleOnAddPatientToPad = () => {
		const dataList = aditionalMembers;
		if (patient == null || patient == undefined) {
			return;
		}

		if (dataList.find((value, _) => value.id == patient.id)) {
			handleErrorNotification(Constants.PATIENT_PAD_EXISTS);
			return;
		}

		console.log(dataList.length);
		console.log(selectedPad?.catalogue);

		if (
			selectedPad != null &&
			dataList.length < selectedPad?.catalogue.maxAdditional
		) {
			setIsListLoading(true);
			dataList.push(patient);
			setTimeout(() => {
				setAditionalMembers(dataList);
				setIsListLoading(false);
			}, 100);
		} else {
			handleErrorNotification(Constants.MAX_MEMBERS_PAD);
		}
	};

	const handleOnAddAditionalMember = async () => {
		//console.log(aditionalMembers)
		try {
			setIsActionLoading(true);
			const branch = selectedPad?.members[0].padAcquisitionBranch ?? branchId;

			const ids = aditionalMembers.map((value, _) => value.id);
			await registerAditionalMember(
				new RegisterAditionalMemberRequest(
					selectedPad?.pad.id ?? 0,
					ids,
					branch
				)
			).unwrap();
			handleSucccessNotification(NotificationSuccess.UPDATE);
			setIsOpenModal(false);
			setIsActionLoading(false);
			setAditionalMembers([]);
			handleGetPads();
		} catch (error) {
			setIsActionLoading(false);
			handleErrorNotification(error);
		}
	};
	class RegisterAditionalMemberRequest {
		padId: number;
		members: number[];
		branchOfficeId: number;
		constructor(padId: number, members: number[], branchOfficeId: number) {
			this.padId = padId;
			this.members = members;
			this.branchOfficeId = branchOfficeId;
		}
	}

	return (
		<LayoutCard
			isLoading={isLoading}
			content={
				<div className="flex flex-col flex-wrap">
					<Search
						onChange={(event) => handleOnSearch(event.target.value)}
						size="large"
						placeholder={Strings.searchPadMember}
						onSearch={handleOnSearch}
						enterButton
					/>
					<div className="flex w-full items-end justify-end mt-4 mb-12">
						<FormPad onFinish={() => handleGetPads()} />
					</div>

					<div className="flex flex-row flex-wrap">
						{currentPads.map((value, index) => (
							<PadCard
								onEditMembers={() => {
									setSelectedPad(value);
									setIsOpenModal(true);
								}}
								data={value}
								key={index}
							/>
						))}
					</div>

					<Pagination
						current={currentPage}
						onChange={setCurrentPage}
						total={padList.length}
						pageSize={cardsPerPage}
						showSizeChanger={false}
						style={{ marginTop: '16px', alignSelf: 'center' }}
					/>

					<Modal
						afterClose={() => {
							setAditionalMembers([]);
							setSelectedPad(undefined);
							setIsListLoading(false);
						}}
						title={Strings.padInfo}
						open={isOpenModal}
						okText={Strings.update}
						confirmLoading={isActionLoading}
						onOk={() => handleOnAddAditionalMember()}
						onCancel={() => setIsOpenModal(false)}
					>
						<Divider>Información del PAD</Divider>
						<SectionElement
							label={Strings.padName}
							value={`${selectedPad?.catalogue?.name}`}
							icon={<RiUserHeartLine />}
						/>
						<SectionElement
							label={Strings.padType}
							value={`${selectedPad?.catalogue?.type}`}
							icon={<RiUserHeartLine />}
						/>

						<Divider>Mimebros del PAD</Divider>
						<SectionElement
							label={Strings.members}
							icon={<></>}
							value={buildPadMembers()}
						/>

						<Divider className="mt-6">{Strings.addMember}</Divider>

						<SelectSearch
							placeholder={Strings.selectMember}
							items={patientList}
							onChange={(event) => setPatient(event)}
							icon={<RiMentalHealthLine />}
						/>
						<div className="flex items-end justify-end mt-2">
							<Button onClick={() => handleOnAddPatientToPad()}>
								{Strings.addMember}
							</Button>
						</div>

						<List
							itemLayout="horizontal"
							loading={isListLoading}
							dataSource={aditionalMembers}
							renderItem={(item, index) => (
								<List.Item key={index}>
									<List.Item.Meta title={item.label} />
								</List.Item>
							)}
						/>
					</Modal>
				</div>
			}
		/>
	);
};

export default Pads;
