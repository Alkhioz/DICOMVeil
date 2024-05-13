/**
 * @fileoverview This module provides utilities for managing DICOM tag references
 * and converting between hexadecimal and decimal representations of these tags.
 */

import { numberManipulationUtil } from "../../../utils/number-manipulation.util";

/**
 * Enumerates DICOM tag keys with their standard names.
 */
export enum DicomTagKey {
    PatientName = 'PatientName',
    PatientBirthDate = 'PatientBirthDate',
};

/**
 * Represents a reference to DICOM tag positions in hexadecimal format.
 */
type DicomTagReference = {
    groupHex: string;  // Hexadecimal string of the group ID
    elementHex: string;  // Hexadecimal string of the element ID
}

/**
 * Maps DICOM tag keys to their corresponding DICOM tag references.
 */
type DicomTagReferenceMap = {
    [Key in DicomTagKey]: DicomTagReference;
}

/**
 * A predefined dictionary of common DICOM tags.
 */
const DICTIONARY: DicomTagReferenceMap = {
    [DicomTagKey.PatientName]: {
        groupHex: '0010',
        elementHex: '0010',
    },
    [DicomTagKey.PatientBirthDate]: {
        groupHex: '0010',
        elementHex: '0030',
    }
};

/**
 * Represents a detailed structure of a DICOM tag including its name and numeric identifiers.
 */
export type DicomTag = {
    name: string;
    group: number;
    element: number;
}

/**
 * Retrieves detailed information about a DICOM tag by its key.
 * @param {DicomTagKey} key - The key of the DICOM tag to retrieve.
 * @returns {DicomTag} The DICOM tag information including its name, group, and element numbers.
 */
export const getDicomTag = (key: DicomTagKey): DicomTag => {
    const { groupHex, elementHex } = DICTIONARY[key];
    return {
        name: key,
        group: numberManipulationUtil.hexToDecimal(groupHex),
        element: numberManipulationUtil.hexToDecimal(elementHex),
    }
}

/**
 * Retrieves a mapping of DICOM tag keys to their detailed information for a given set of keys.
 * @param {DicomTagKey[]} keys - An array of DICOM tag keys to retrieve information for.
 * @returns {Record<DicomTagKey, DicomTag>} A record mapping each provided DICOM tag key to its detailed information.
 */
export const getDictionary = (keys: DicomTagKey[]): Record<DicomTagKey, DicomTag> => {
    return keys.reduce((acc, key) => {
        acc[key] = getDicomTag(key);
        return acc;
    }, {} as Record<DicomTagKey, DicomTag>);
}