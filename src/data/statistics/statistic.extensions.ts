


const callDataToStatisticChar = (data: any) => {
    const calls = data.calls;

    const pending = calls.pending.length;
    const attended = calls.attended.length;
    return [
        {
            type: 'Llamadas pendientes',
            value: pending,
        },
        {
            type: 'Llamadas atendidas',
            value: attended,
        },
    ];
}


export {
    callDataToStatisticChar
}