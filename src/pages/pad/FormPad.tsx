import { Button, Modal, Popover, RowProps, Table } from "antd";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { RiCouponLine, RiDeleteBin7Line, RiMentalHealthLine } from "react-icons/ri";
import useSessionStorage from "../../core/sessionStorage";
import { DEFAULT_FILTERS } from "../../data/filter/filters";
import { FilterEmployeesRequest } from "../../data/filter/filters.request";
import { PadCatalogueDetail } from "../../data/pad/pad.catalogue.detail";
import { padCatalogsToSelectItemOption } from "../../data/pad/pad.extensions";
import SelectItemOption from "../../data/select/select.item.option";
import { patientsToSelectItemOption } from "../../data/select/select.item.option.extensions";
import User from "../../data/user/user";
import { useGetPadCatalogsMutation, useRegisterPadMutation } from "../../services/padService";
import { useGetPatientsByBranchOfficeMutation, useGetPatientsMutation } from "../../services/patientService";
import Constants from "../../utils/Constants";
import { isAdmin } from "../../utils/Extensions";
import { handleErrorNotification } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import CustomFormInput from "../components/CustomFormInput";
import SelectSearch from "../components/SelectSearch";
import LayoutCard from "../layouts/LayoutCard";
import { DndContext } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const FormPad = () => {
    const [getPadCatalogs] = useGetPadCatalogsMutation();
    const [getPatientsByBranchOffice] = useGetPatientsByBranchOfficeMutation();
    const [registerPad] = useRegisterPadMutation();
    const [branchId, setBranchId] = useSessionStorage(Constants.BRANCH_ID, 0);
    const [session, setSession] = useSessionStorage(Constants.SESSION_AUTH, 0);
    const [getPatients] = useGetPatientsMutation();
    const [patientList, setPatientList] = useState<SelectItemOption[]>([]);
    const [padCatalogList, setPadCatalogList] = useState<SelectItemOption[]>([]);
    const [padCatalogs, setPadCatalogs] = useState<PadCatalogueDetail[]>([]);
    const [data, setData] = useState<any[]>([]);

    const [patient, setPatient] = useState<SelectItemOption>();
    const [padCatalogue, setPadCatalogue] = useState<SelectItemOption>();
    const [selectedPadCatalogue, setSelectedPadCatalogue] = useState<PadCatalogueDetail>();

    const [isTableLoading, setIsTableLoading] = useState(false);

    const [isOpenModal, setIsOpenModal] = useState(false);

    useEffect(() => {
        handleGetPadCatalogs();
        if (session != null) {
            const user = session as User;
            if (isAdmin(user)) {
                handleGetAllPatients();
            } else {
                handleGetPatients();
            }
        }
    }, []);

    const handleGetPadCatalogs = async () => {
        try {
            const response = await getPadCatalogs({}).unwrap();
            setPadCatalogs(response);
            setPadCatalogList(padCatalogsToSelectItemOption(response));
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleGetPatients = async () => {
        try {
            const response = await getPatientsByBranchOffice(Number(branchId)).unwrap();
            setPatientList(patientsToSelectItemOption(response));
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleGetAllPatients = async () => {
        try {
            const response = await getPatients(new FilterEmployeesRequest([DEFAULT_FILTERS[3]])).unwrap();
            console.log(response);
            setPatientList(patientsToSelectItemOption(response));
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleOnAddPatientToPad = () => {
        if (patient == null) {
            return
        }
        const exists = data.find((value, _) => value.id === patient.id);
        if (exists) {
            handleErrorNotification(Constants.PATIENT_PAD_EXISTS)
            return;
        }

        let dataList = data;
        if (selectedPadCatalogue?.type == 'individual' && dataList.length == 1) {
            handleErrorNotification(Constants.IS_INDIVIDUAL_PAD)
            return;
        } else {
            const maxMembers = (selectedPadCatalogue?.maxMemebers ?? 1) - 1;
            if (dataList.length <= maxMembers) {
                setIsTableLoading(true);
                setData([]);
                dataList.push({
                    key: patient?.id,
                    id: patient?.id,
                    fullname: patient.label,
                })

                setTimeout(() => {
                    setData(dataList);
                    setIsTableLoading(false);
                }, 1000)
            } else {
                handleErrorNotification(Constants.MAX_MEMBERS_PAD);
                return;
            }
        }
    }

    const columns = [
        {
            title: 'Identificador #',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Nombre completo',
            dataIndex: 'fullname',
            key: 'fullname',
        },
        {
            title: Strings.actions,
            dataIndex: 'action',
            key: 'action',
            render: (_: any, value: any) => (
                <div key={value.key} className="flex flex-wrap cursor-pointer justify-center items-center">
                    <RiDeleteBin7Line size={20} onClick={() => handleOnDeletePatient(value.id)} className="text text-red-600" />
                </div>
            ),
        },
    ];

    const handleOnDeletePatient = (id: number) => {
        setIsTableLoading(true);
        setData([]);
        let dataList = data.filter((value, _) => value.id != id);
        setTimeout(() => {
            setData(dataList);
            setIsTableLoading(false);
        }, 1000)
    }

    const disabledSelect = (): boolean => {
        return padCatalogue != null && data.length > 0
    }


    const handleOnRegisterPad = async () => {

        console.log(padCatalogue)
        console.log(data);

        try {
            await registerPad({
                'padCatalogueId': padCatalogue?.id,
                'members': data.map((value, _) => value.id),
                'adquisitionDate': format(new Date(), 'yyyy-MM-dd')
            }).unwrap();
        } catch (error) {
            console.log(error);
        }

    }


    //  class RegisterPadRequest {
    //     padCatalogueId: number;

    // }


    const Row = (props: any) => {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
            id: props['data-row-key'],
        });

        const style: React.CSSProperties = {
            ...props.style,
            transition,
            cursor: 'move',
            ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
        };

        return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
    };

    const onDragEnd = ({ active, over }: any) => {
        if (active.id !== over?.id) {
          setData((prev) => {
            const activeIndex = prev.findIndex((i) => i.key === active.id);
            const overIndex = prev.findIndex((i) => i.key === over?.id);
            return arrayMove(prev, activeIndex, overIndex);
          });
        }
      };

    return (<LayoutCard isLoading={false} content={
        <div>
            <Button onClick={() => setIsOpenModal(true)}>Agregar PAD</Button>
            <Modal width={'85%'} title='Registro de PAD' onCancel={() => setIsOpenModal(false)} onOk={() => setIsOpenModal(false)} open={isOpenModal} okText='Cerrar'>
                <div className="flex flex-col">
                    <div className="flex flex-row items-baseline gap-4 my-4">
                        <SelectSearch
                            placeholder="Selecciona un tipo de pad"
                            items={padCatalogList}
                            disabled={disabledSelect()}
                            onChange={(event) => {
                                setSelectedPadCatalogue(padCatalogs.find((value, _) => value.id == event.id))
                                setPadCatalogue(event)
                            }}
                            icon={<RiCouponLine />}
                        />
                        <SelectSearch
                            placeholder="Selecciona un paciente"
                            items={patientList}
                            onChange={(event) => setPatient(event)}
                            icon={<RiMentalHealthLine />}
                        />
                        <Button onClick={() => handleOnAddPatientToPad()}>Agregar</Button>
                    </div>


                    <span className="text text-xs text-gray-600 mt-4 mb-4">Nota * El primer miembro de la lista será el miembro principal del PAD</span>

                    <DndContext onDragEnd={onDragEnd}>
                        <SortableContext
                            // rowKey array
                            items={data.map((i) => i.key)}
                            strategy={verticalListSortingStrategy}
                        >
                            <Table components={{
                                body: {
                                    row: Row,
                                },
                            }} rowKey="key" scroll={{ y: 300 }} loading={isTableLoading} columns={columns} dataSource={data} />
                        </SortableContext>
                    </DndContext>

                    <div className="flex justify-end items-end mt-4 mb-8">
                        <Popover placement="leftTop" content={
                            <div className="flex flex-col flex-wrap">
                                <span className="text text-xs text-gray-600 mt-2 mb-4">Una vez guardado no se permitiran cambios. Estas seguro que deseas continuar?</span>
                                <Button type="primary" onClick={() => handleOnRegisterPad()}>Continuar</Button>
                            </div>
                        } title="Confirmación" trigger="hover">
                            <Button type="primary">Guardar</Button>
                        </Popover>
                    </div>
                </div>
            </Modal>
        </div>
    } />);
}



export default FormPad;

