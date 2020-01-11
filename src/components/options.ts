interface Options {
    map: {
        id: string,
        rows: number,
        columns: number,
        seatName?: (
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
        reserved?: {
            seats?: number[],
        },
        disabled?: {
            seats?: number[],
            rows?: number[],
            columns?: number[],
        },
        indexes?: {
            rows?: {
                visible?: boolean,
                position?: 'left' | 'right',
                name?: (
                    index: number,
                    disabled: boolean,
                    disabledCount: number,
                ) => string,
            },
            columns?: {
                visible?: boolean,
                position?: 'top' | 'bottom',
                name?: (
                    index: number,
                    disabled: boolean,
                    disabledCount: number,
                ) => string,
            },
        },
        front?: {
            visible?: boolean,
        },
    };
    types: {
        type: string,
        backgroundColor: string,
        price: number,
        textColor?: string,
        selected?: number[],
    }[];
    cart?: {
        id: string,
        height?: string,
        width?: string,
        currency?: string,
    };
    legend?: {
        id: string,
    };
    assets?: {
        path?: string,
    };
}

export {
    Options,
};
