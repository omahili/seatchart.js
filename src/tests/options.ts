import { Options } from 'types/options';

const options: Options = {
  map: {
    rows: 10,
    columns: 10,
    seatTypes: {
      default: {
        label: 'Economy',
        cssClass: 'economy',
        price: 15,
      },
      first: {
        label: 'First Class',
        cssClass: 'first-class',
        price: 25,
        seatRows: [0, 1, 2],
      },
      reduced: {
        label: 'Reduced',
        cssClass: 'reduced',
        price: 10,
        seatRows: [7, 8, 9],
      },
    },
    disabledSeats: [
      { row: 0, col: 0 },
      { row: 5, col: 5 },
      { row: 8, col: 9 },
    ],
    reservedSeats: [
      { row: 0, col: 3 },
      { row: 4, col: 5 },
      { row: 9, col: 4 },
    ],
    selectedSeats: [
      { row: 0, col: 5 },
      { row: 6, col: 1 },
      { row: 8, col: 4 },
    ],
  },
};

export default options;
