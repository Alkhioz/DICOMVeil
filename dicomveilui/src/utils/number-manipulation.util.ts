/**
 * Provides utility methods for number manipulations between different bases.
 * Specifically, this class includes methods for converting numbers between 
 * hexadecimal and decimal formats.
 */
export abstract class numberManipulationUtil {
    /**
     * Converts a hexadecimal string to its equivalent decimal number.
     * 
     * @param {string} hex - The hexadecimal string to convert. Must only contain 
     *                       hexadecimal characters (0-9, a-f, A-F).
     * @returns {number} The decimal representation of the hexadecimal 
     *                               string, or undefined if the input is not a valid 
     *                               hexadecimal string.
     * @throws {Error} Throws an error if the input string is not a valid hexadecimal string.
     */
    static hexToDecimal(hex: string): number {
        if (typeof hex !== 'string' || !hex.match(/^[0-9a-fA-F]+$/)) {
            throw new Error("Invalid hexadecimal input");
        }
        return parseInt(hex, 16);
    }

    /**
     * Converts a decimal number to its equivalent hexadecimal string.
     * 
     * @param {number} decimal - The decimal number to convert to hexadecimal.
     * @returns {string} The hexadecimal representation of the decimal number.
     */
    static decimalToHex(decimal: number): string {
        return decimal.toString(16);
    }
}