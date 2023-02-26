


const callDataToStatisticChar = (data: any) => {
    const calls = data.calls;

    const pending = calls.pending.length;
    const attended = calls.attended.length;
    return  {
        labels: ['Pendientes', 'Resueltas'],
        datasets: [
            {
                label: '# of Votes',
                data: [pending, attended],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',

                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
}


export {
    callDataToStatisticChar
}