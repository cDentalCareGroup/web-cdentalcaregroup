import React, { useContext, useEffect, useRef, useState } from 'react';
import type { InputRef } from 'antd';
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { RiDeleteBin7Line } from 'react-icons/ri';
import { formatNumberToPercent, formatPrice } from '../../../utils/Extensions';
import Strings from '../../../utils/Strings';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
    key: string;
    name: string;
    age: string;
    address: string;
}

interface EditableRowProps {
    index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current!.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
    key: React.Key;
    name: string;
    age: string;
    address: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;


interface EditableTableCustomProps {
    data: any[]
    isLoading: boolean;
    onChange: (data: any) => void;
}


const EditableTable = (props: EditableTableCustomProps) => {
    const [dataSource, setDataSource] = useState<any[]>(props.data);
    const [isLoading, setIsLoading] = useState(props.isLoading);

    const handleDelete = (key: React.Key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        props.onChange(newData);
        setDataSource(newData);
    };

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: Strings.description,
            dataIndex: 'description',
        },
        {
            title: Strings.quantity,
            dataIndex: 'quantity',
            editable: true,
            render: (_: any, value: any) => (
                <div key={value.key} className="flex cursor-pointer flex-wrap justify-center items-center">
                    <span className='text-blue-800'>{value.quantity}</span>
                </div>
            ),
        },
        {
            title: Strings.unitPrice,
            dataIndex: 'unitPrice',
            render: (_: any, value: any) => (
                <div key={value.key} className="flex flex-wrap cursor-pointer justify-center items-center">
                    <span >{formatPrice(value.unitPrice)}</span>
                </div>
            ),
        },
        {
            title: Strings.discount,
            dataIndex: 'disscount',
            editable: false,
            render: (_: any, value: any) => (
                <div key={value.key} className="flex flex-wrap cursor-pointer justify-center items-center">
                    <span className='text-blue-800'>{formatNumberToPercent(value.disscount)}</span>
                </div>
            ),
        },
        {
            title: Strings.price,
            dataIndex: 'price',
            render: (_: any, value: any) => (
                <div key={value.key} className="flex flex-wrap cursor-pointer justify-center items-center">
                    <span >{formatPrice(value.price)}</span>
                </div>
            ),
        },
        {
            title: Strings.subTotal,
            dataIndex: 'subtotal',
            render: (_: any, value: any) => (
                <div key={value.key} className="flex flex-wrap cursor-pointer justify-center items-center">
                    <span >{formatPrice(value.subtotal)}</span>
                </div>
            ),
        },
        {
            title: Strings.actions,
            dataIndex: 'actions',
            render: (_: any, value: any) => (
                <div key={value.key} className="flex flex-wrap cursor-pointer justify-center items-center">
                    <RiDeleteBin7Line size={20} onClick={() => handleDelete(value.key)} className="text text-red-600" />
                </div>
            ),
        },
    ];


    const handleSave = (row: any) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        row.unitPrice = row.unitPrice;
        row.disscount = Math.round(row.disscount);

      //  row.price = Number(row.quantity) * Number(item.unitPrice);

        if (row.disscount != null && row.disscount != 0 && row.disscount != '0') {
            row.price = row.unitPrice - Math.round((Number(row.unitPrice) / 100) * Math.round(Number(row.disscount)));
            row.subtotal = Number(row.quantity) * Number(row.price);
        } else {
            row.price = row.unitPrice;
            row.subtotal = Number(row.quantity) * Number(row.unitPrice);
        }
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        props.onChange(newData);
        setDataSource(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: DataType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    return (
        <div>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns as ColumnTypes}
                loading={isLoading}
            />
        </div>
    );
};

export default EditableTable;