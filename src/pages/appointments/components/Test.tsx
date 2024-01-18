import * as React from "react";

import { Input,Table } from "antd";


class EditableTextCell extends React.Component<any, any> {
    private handleChange(e: any) {
        const { value } = e.target;
        this.props.handleChange(value);
    }

    public render() {
        const { editable, value } = this.props;

        return (
            <div>
                { editable ?
                    <div>
                        <Input
                            value={value}
                            onChange={e => this.handleChange(e)}
                        />
                    </div>
                    :
                    <div className="editable-row-text">
                        { value.toString() || " " }
                    </div>
                }
            </div>
        );
    }
}

export default class EditableSortableTable extends React.Component<any, any> {

    private columns;

    constructor(props: any) {
        super(props);

        this.columns = [
            {
                title: "Title",
                dataIndex: "title",
                width: "40%",
                render: (text: any, record: any, index: any) => this.renderTextColumn(record, index, "title", text),
                sorter: (a: any, b: any) => a._originalTitle.localeCompare(b._originalTitle),
            },
            {
                title: "Type",
                dataIndex: "type",
                width: "20%",
                render: (text: any, record: any, index: any) => this.renderTextColumn(record, index, "type", text),
                filters: [
                    {
                        text: "A",
                        value: "A"
                    },
                    {
                        text: "B",
                        value: "B",
                    }
                ],
               
                sorter: (a: any, b: any) => a._originalType.localeCompare(b._originalType),

            },
            {
                title: "Actions",
                dataIndex: "actions",
                render: (text: any, record: any, index: any) => this.renderActionColumn(record),
            },
        ];

        this.state = {
            sourceData: [
                {
                    key: 1,
                    title: "C - Test",
                    type: "A",
                    _originalTitle: "C - Test",
                    _originalType: "A"

                },
                {
                    key: 2,
                    title: "M - Test",
                    type: "A",
                    _originalTitle: "M - Test",
                    _originalType: "A"
                },
                {
                    key: 3,
                    title: "X - Test",
                    type: "B",
                    _originalTitle: "X - Test",
                    _originalType: "B"
                },
            ],
            isEditableMap: {}
        };
    }

    private renderActionColumn(record: any) {
        const editable = this.isEditable(record);

        return (
            <div className="editable-row-operations">
                {
                    editable ?
                        <span>
                            <a onClick={() => this.handleSave(record)}>Save</a>
                        </span>
                    :
                        <span>
                            <a onClick={() => this.handleEdit(record)}>Edit</a>
                        </span>
                }
            </div>
        );
    }

    private renderTextColumn(record: any, index: any, key: any, text: any) {
        const editable = this.isEditable(record);

       return (
           <EditableTextCell
                editable={editable}
                value={text}
                handleChange={(value: any) => this.handleChange(record, key, value)}
           />
       );
    }

    private isEditing() {
        return Object.keys(this.state.isEditableMap).length > 0;
    }

    private isEditable(record: any) {
        return this.state.isEditableMap[record.key];
    }

    private setEditable(record: any) {
        const { isEditableMap } = this.state;
        isEditableMap[record.key] = true;

        this.setState({
            isEditableMap: isEditableMap
        });
    }

    private setNotEditable(record: any) {
        const { isEditableMap } = this.state;

        delete isEditableMap[record.key];

        this.setState({
            isEditableMap: this.state.isEditableMap
        });
    }

    private handleEdit(record: any) {
        this.setEditable(record);
    }

    private handleSave(record: any) {
        // Save to API
        // APIUtils.saveRecord(record);
        record._originalTitle = record.title;
        record._originalType = record.type;
        this.setNotEditable(record);
    }

    private handleChange(record: any, key: any, value: any) {
        const sourceData = this.state.sourceData.map((a: any) => Object.assign({}, a));
        const updatedRecord = { ...record, [key]:value };

        const index = sourceData.findIndex((data: any) =>
            data.key === record.key
        );
        sourceData.splice(index, 1, updatedRecord);

        this.setState({
            sourceData: sourceData
        })
    }

    public render() {
        const { sourceData } = this.state;

        return (
            <div>
                <h1>Editable sortable table</h1>
                <Table
                    dataSource={sourceData}
                    columns={this.columns}
                    locale={{
                        filterTitle: 'Filter Menu',
                        filterConfirm: 'OK',
                        filterReset: 'Reset',
                        emptyText: 'No Data',
                        selectAll: 'Select Current Page',
                        selectInvert: 'Select Invert',
                    }}
                />
            </div>
        );
    }
}