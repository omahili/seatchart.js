import InvalidParameterError from 'errors/invalid-parameter';
import { SeatIndex } from 'types/map-options';
import { Options } from 'types/options';

/**
 * @internal
 */
class Validator {
    public static validateOptions(options: Options): void {
        // check options.map parameter
        if (options.map === undefined) {
            throw new InvalidParameterError(
                'Invalid parameter \'options.map\' supplied to Seatchart. Cannot be undefined.'
            );
        } else if (typeof options.map !== 'object') {
            throw new InvalidParameterError(
                'Invalid parameter \'options.map\' supplied to Seatchart. Must be an object.'
            );
        } else if (!{}.hasOwnProperty.call(options.map, 'id')) {
            throw new InvalidParameterError('Invalid parameter \'options.map\' supplied to Seatchart. ' +
                '\'id\' property cannot be undefined.');
        } else if (!{}.hasOwnProperty.call(options.map, 'rows') || !{}.hasOwnProperty.call(options.map, 'columns')) {
            throw new InvalidParameterError('Invalid parameter \'options.map\' supplied to Seatchart. ' +
                '\'row\' and \'columns\' properties cannot be undefined.');
        } else if (options.map.rows < 2 || options.map.columns < 2) {
            throw new InvalidParameterError('Invalid parameter \'options.map\' supplied to Seatchart. ' +
                '\'row\' and \'columns\' properties cannot be integers smaller than 2.');
        }

        // check options.types parameter
        if (options.types === undefined) {
            throw new InvalidParameterError(
                'Invalid parameter \'options.types\' supplied to Seatchart. Cannot be undefined.'
            );
            // check if options.types is an array and contains at least one element
        } else if (!Array.isArray(options.types) || options.types.length < 1 || typeof options.types[0] !== 'object') {
            throw new InvalidParameterError('Invalid parameter \'options.types\' supplied to Seatchart. ' +
                'Must be an array of objects containing at least one element.');
        } else {
            // check if all elements have the needed attribute and contain the right type of value
            for (let i = 0; i < options.types.length; i += 1) {
                if (!{}.hasOwnProperty.call(options.types[i], 'type') ||
                    !{}.hasOwnProperty.call(options.types[i], 'backgroundColor') ||
                    !{}.hasOwnProperty.call(options.types[i], 'price')) {
                    throw new InvalidParameterError('Invalid parameter \'options.types\' supplied to Seatchart. ' +
                        `Element at index ${i} must contain a 'type', ` +
                        'a \'backgroundColor\' and a \'price\' property.');
                } else if (typeof options.types[i].type !== 'string') {
                    throw new InvalidParameterError('Invalid parameter \'options.types\' supplied to Seatchart. ' +
                        `'type' property at index ${i} must be a string.`);
                } else if (typeof options.types[i].backgroundColor !== 'string') {
                    throw new InvalidParameterError('Invalid parameter \'options.types\' supplied to Seatchart. ' +
                        `'backgroundColor' property at index ${i} must be a string.`);
                } else if (typeof options.types[i].price !== 'number') {
                    throw new InvalidParameterError('Invalid parameter \'options.types\' supplied to Seatchart. ' +
                        `'price' property at index ${i} must be a number.`);
                }
            }
        }

        // check the given input
        for (let x = 0; x < options.types.length; x += 1) {
            for (let y = x + 1; y < options.types.length; y += 1) {
                if (options.types[x].type.toLowerCase() === options.types[y].type.toLowerCase()) {
                    throw new InvalidParameterError(
                        'Invalid parameter \'options.types\' supplied to Seatchart. ' +
                        `'${options.types[x].type}' and '${options.types[y].type}' ` +
                        'types are equal and must be different. ' +
                        'Types are case insensitive.'
                    );
                }
            }
        }
    }

    static validateIndex(index: SeatIndex, totalRows: number, totalColumns: number) {
        const { row, col } = index;
        if (typeof row !== 'number' && Math.floor(row) === row) {
            throw new InvalidParameterError(
                'Invalid parameter \'row\' supplied to Seatchart.get(). It must be an integer.'
            );
        } else if (row >= totalRows) {
            throw new InvalidParameterError(
                'Invalid parameter \'row\' supplied to Seatchart.get(). Index is out of range.'
            );
        } else if (typeof col !== 'number' && Math.floor(col) === col) {
            throw new InvalidParameterError(
                'Invalid parameter \'col\' supplied to Seatchart.get(). It must be an integer.'
            );
        } else if (col >= totalColumns) {
            throw new InvalidParameterError(
                'Invalid parameter \'col\' supplied to Seatchart.get(). Index is out of range.'
            );
        }
    }
}

export default Validator;
