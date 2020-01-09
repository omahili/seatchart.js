import { Seat } from "seat";

interface ChangeEvent {
    action: string;
    current: Seat;
    previous: Seat;
}

type ClearEvent = {
    current: Seat,
    previous: Seat,
}[];

export {
    ChangeEvent,
    ClearEvent,
};
