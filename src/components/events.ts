import Seat from "./seat";

type ChangeEvent = {
    action: string,
    current: Seat,
    previous: Seat,
}

type ClearEvent = Array<{
    current: Seat,
    previous: Seat,
}>

export {
    ChangeEvent,
    ClearEvent,
};
