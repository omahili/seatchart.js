/**
 * Callback to generate a row or column name.
 * @returns Row or column name. Return null or undefined if empty.
 */
type IndexNameCallback = (
    /**
     * Row or column index (starts from 0).
     */
    index: number,
    /**
     * True if current row or column is disabled.
     */
    disabled: boolean,
    /**
     * Number of disabled rows or columns till current one (including current one if disabled)
     */
    disabledCount: number,
) => string | undefined;

export default IndexNameCallback;
