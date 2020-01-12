/**
 * Callback to generate a seat name.
 *
 * @function seatNameCallback
 *
 * @param {object} row
 * @param {number} row.index - Row index (starts from 0).
 * @param {boolean} row.disabled - True if current row is disabled.
 * @param {number} row.disabledCount - Number of disabled rows till that one (including current one if disabled).
 *
 * @param {object} column
 * @param {number} column.index - Column index (starts from 0).
 * @param {boolean} column.disabled - True if current column is disabled.
 * @param {number} column.disabledCount - Number of disabled columns till that one (including current one if disabled).
 *
 * @returns {string} Seat name. Return null or undefined if empty.
 */

/**
 * Callback to generate a row name.
 *
 * @function rowNameCallback
 *
 * @param {number} index - Row index (starts from 0).
 * @param {boolean} disabled - True if current row is disabled.
 * @param {number} disabledCount - Number of disabled rows till that one (including current one if disabled).
 *
 * @returns {string} Row name. Return null or undefined if empty.
 */

/**
 * Callback to generate a column name.
 *
 * @function columnNameCallback
 *
 * @param {number} index - Column index (starts from 0).
 * @param {boolean} disabled - True if current column is disabled.
 * @param {number} disabledCount - Number of disabled columns till that one (including current one if disabled).
 *
 * @returns {string} Column name. Return null or undefined if empty.
 *
 */

/**
 * @typedef {Object} Options
 *
 * @property {Object} options.map - Map options.
 * @property {string} options.map.id - Container id.
 * @property {number} options.map.rows - Number of rows.
 * @property {number} options.map.columns - Number of columns.
 * @property {seatNameCallback} [options.map.seatName] - Seat name generator.
 *
 * @property {Object} [options.map.reserved] - Array of reserved seats.
 * @property {Array.<number>} [options.map.reserved.seats] - Array of the reserved seats.
 *
 * @property {Object} [options.map.disabled] - Disabled seats options.
 * @property {Array.<number>} [options.map.disabled.seats] - Array of the disabled seats.
 * @property {Array.<number>} [options.map.disabled.rows] - Array of the disabled rows of seats.
 *
 * @property {Array.<number>} [options.map.disabled.columns] - Array of the disabled columns of seats.
 *
 * @property {Object} [options.map.indexes] - Indexes options.
 *
 * @property {Object} [options.map.indexes.rows] - Rows index options.
 * @property {boolean} [options.map.indexes.rows.visible = true] - Row index visibility.
 * @property {string} [options.map.indexes.rows.position = left] - Row index position.
 * @property {rowNameCallback} [options.map.indexes.rows.name] - Row name generator.
 *
 * @property {Object} [options.map.indexes.columns] - Columns index options.
 * @property {boolean} [options.map.indexes.columns.visible = true] - Column index visibility.
 * @property {string} [options.map.indexes.columns.position = top] - Column index position.
 * @property {columnNameCallback} [options.map.indexes.columns.name] - Column name generator.
 *
 * @property {Object} [options.map.front] - Front header options.
 * @property {boolean} [options.map.front.visible = true] - Front header visibility.
 *
 *
 * @property {Array.<Object>} options.types - Seat types options.
 * @property {string} options.types.type - Name of seat type.
 * @property {string} options.types.backgroundColor - Background color of the defined seat type.
 * @property {number} options.types.price - Price of the defined seat type.
 * @property {string} [options.types.textColor = white] - Text color of the defined seat type.
 * @property {Array.<number>} [options.types.selected] - Selected seats of the defined seat type.
 *
 *
 * @property {Array.<Object>} [options.cart] - Cart options.
 * @property {string} options.cart.id - Container id.
 * @property {string} [options.cart.height] - Cart height.
 * @property {string} [options.cart.width] - Cart width.
 * @property {string} [options.cart.currency = €] - Current currency.
 *
 *
 * @property {string} [options.legend] - Legend options.
 * @property {string} options.legend.id - Container id.
 *
 *
 * @property {Array.<Object>} [options.assets] - Assets options.
 * @property {string} [options.assets.path] - Path to assets.
 */

interface Options {
    map: {
        id: string;
        rows: number;
        columns: number;
        seatName?: (
            row: {
                index: number;
                disabled: boolean;
                disabledCount: number;
            },
            column: {
                index: number;
                disabled: boolean;
                disabledCount: number;
            },
        ) => string;
        reserved?: {
            seats?: number[];
        };
        disabled?: {
            seats?: number[];
            rows?: number[];
            columns?: number[];
        };
        indexes?: {
            rows?: {
                visible?: boolean;
                position?: 'left' | 'right';
                name?: (
                    index: number,
                    disabled: boolean,
                    disabledCount: number,
                ) => string;
            };
            columns?: {
                visible?: boolean;
                position?: 'top' | 'bottom';
                name?: (
                    index: number,
                    disabled: boolean,
                    disabledCount: number,
                ) => string;
            };
        };
        front?: {
            visible?: boolean;
        };
    };
    types: Array<{
        type: string;
        backgroundColor: string;
        price: number;
        textColor?: string;
        selected?: number[];
    }>;
    cart?: {
        id: string;
        height?: string;
        width?: string;
        currency?: string;
    };
    legend?: {
        id: string;
    };
    assets?: {
        path?: string;
    };
}

export default Options;
