// tabla de llamadas desde el callcenter

import { Table, Collapse } from 'antd';
import { differenceInDays, differenceInMinutes, differenceInSeconds, format } from 'date-fns';
import { buildPatientName } from '../../../data/patient/patient.extensions';
import { GetCallsReports } from '../../../data/statistics/statistic.calls';


interface CallCenterReportProps {
  data: GetCallsReports[];
}

const CallCenterReport = (props: CallCenterReportProps) => {

  const CALLS_REPORT_COLUMS = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
    },
    {
      title: 'Vencimiento',
      dataIndex: 'vencimiento',
      key: 'vencimiento',
    },
    {
      title: 'Fecha Hora Llamada',
      dataIndex: 'fechaHoraLlamada',
      key: 'fechaHoraLlamada',
    },
    {
      title: 'Resultado',
      dataIndex: 'resultado',
      key: 'resultado',
    },
    {
      title: 'Estatus',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Usuario',
      dataIndex: 'usuario',
      key: 'usuario',
    },
  ];

  const CALLS_LOGS_REPORT_COLUMS = [
    {
      title: 'Inicio',
      dataIndex: 'inicio',
      key: 'inicio',
    },
    {
      title: 'Fin',
      dataIndex: 'fin',
      key: 'fin',
    },
    {
      title: 'Duración',
      dataIndex: 'duracion',
      key: 'duracion',
    },
    {
      title: 'Resultado',
      dataIndex: 'resultado',
      key: 'resultado',
    },
  ];

  const callToCallLogs = (key: number): any[] => {
    let logs: any[] = [];
    const element = props.data.find((value, _) => value.call.id == key);
    if (element != null) {
      for (const log of element.logs) {
        let duration = '';

        if (log.finishedAt != null && log.finishedAt != undefined) {
          const diff = differenceInSeconds(stringDateToDate(log.finishedAt), stringDateToDate(log.startedAt));
          const time = (diff / 60);

          if (time < 1) {
            duration = `${time.toFixed(2)} segundos`
          } else if (time >= 1 && time < 60) {
            duration = `${time.toFixed(2)} minutos`
          } else {
            duration = `${time.toFixed(2)} horas`
          }
        } else {
          duration = 'Sin resolver'
        }

        logs.push({
          key: log.id,
          inicio: log.startedAt,
          fin: log.finishedAt ?? '-',
          duracion: duration,
          resultado: log.result ?? '-',
        })
      }
    }
    return logs;
  }

  const stringDateToDate = (date: string): Date => {

    const finalDate = new Date();

    //2023-04-03 13:52:37
    let arrayDate = date.split(" ");

    let dateArray = arrayDate[0].split("-");
    finalDate.setFullYear(Number(dateArray[0]));
    finalDate.setMonth(Number(dateArray[1]) - 1);
    finalDate.setDate(Number(dateArray[2]))

    let hourArray = arrayDate[1].split(":");
    finalDate.setHours(Number(hourArray[0]));
    finalDate.setMinutes(Number(hourArray[1]));
    finalDate.setSeconds(Number(hourArray[2]))
    return finalDate;
  }

  const dataToDataTable = (): any[] => {
    const info: any[] = [];

    for (const item of props.data) {

      let name = '';

      if (item.patient != null && item.patient != undefined) {
        name = buildPatientName(item.patient)
      } else {
        name = item.prospect?.name ?? '';
      }

      let callStatus = 'Activa';

      if (item.call.status == 'solved') {
        callStatus = 'Resuelta'
      }

      info.push({
        key: item.call.id,
        id: item.call.id,
        nombre: name,
        tipo: item.catalog.name,
        vencimiento: item.call.dueDate,
        fechaHoraLlamada: item.call.effectiveDate ?? '-',
        resultado: getCallType(item.call.result),
        status: callStatus,
        usuario: 'Irene',
      });
    }

    return info;
  }

  const getCallType = (type: string): string => {
    let value = ''
    switch (type) {
      case 'call':
        value = 'Llamada';
        break;

      case 'appointment':
        value = 'Cita'
        break;

      default:
        value = 'Activa'
        break;
    }
    return value;
  }

  return <Table className="bg-warning" columns={CALLS_REPORT_COLUMS} dataSource={dataToDataTable()}
    expandable={{
      expandedRowRender: (element) => <Table className="bg-warning ml-4" columns={CALLS_LOGS_REPORT_COLUMS} dataSource={callToCallLogs(element.key)}
        pagination={false} scroll={{ y: 200 }}
      />
    }}
  />;
}

export default CallCenterReport;
