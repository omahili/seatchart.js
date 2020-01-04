type Options = {
    map: {
        id: string,
        rows: number,
        columns: number,
        seatNameCallback: (
            row: {
                index: number,
                disabled: boolean,
                disabledCount: number,
            },
            column: {
                index: number,
                disabled: boolean,
                disabledCount: number,
            },
        ) => string,
        reserved: {
            seats: Array<number>,
        },
        disabled: {
            seats: Array<number>,
            rows: Array<number>,
            columns: Array<number>,
        },
        indexes: {
            rows: {
                visible: boolean,
                position: 'left' | 'right',
                name: (
                    index: number,
                    disabled: boolean,
                    disabledCount: number,
                ) => string,
            },
            columns: {
                visible: boolean,
                position: 'top' | 'bottom',
                name: (
                    index: number,
                    disabled: boolean,
                    disabledCount: number,
                ) => string,
            },
        },
        front: {
            visible: boolean,
        },
    },
    types: Array<{
        type: string,
        backgroundColor: string,
        price: number,
        textColor: string,
        selected: Array<number>,
    }>,
    cart: {
        id: string,
        height: string,
        width: string,
        currency: number,
    },
    legend: {
        id: string,
    },
    assets: {
        path: string,
    },
}

type Seat = {
    type: string,
    id: string,
    index: number,
    name: string,
    price: number | null,
}

type ChangeEvent = {
    action: string,
    current: Seat,
    previous: Seat,
}

type ClearEvent = Array<{
    current: Seat,
    previous: Seat,
}>
