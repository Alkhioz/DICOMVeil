/**
 * @fileoverview This module provides utilities for managing DICOM tag references
 * and converting between hexadecimal and decimal representations of these tags.
 */

import { numberManipulationUtil } from "@utils/number-manipulation.util";

/**
 * Enumerates DICOM tag keys with their standard names.
 */
export enum DicomTagKey {
    PatientName = 'PatientName',
    PatientBirthDate = 'PatientBirthDate',
    AccessionNumber = 'AccessionNumber',
    InstitutionName = 'InstitutionName',
    ReferringPhysicianIdentificationSequence = 'ReferringPhysicianIdentificationSequence',
    PhysiciansOfRecord = 'PhysiciansOfRecord',
    PhysiciansOfRecordIdentificationSequence = 'PhysiciansOfRecordIdentificationSequence',
    PerformingPhysicianName = 'PerformingPhysicianName',
    PerformingPhysicianIdentificationSequence = 'PerformingPhysicianIdentificationSequence',
    NameOfPhysiciansReadingStudy = 'NameOfPhysiciansReadingStudy',
    PhysiciansReadingStudyIdentificationSequence = 'PhysiciansReadingStudyIdentificationSequence',
    PatientInsurancePlanCodeSequence = 'PatientInsurancePlanCodeSequence',
    PatientPrimaryLanguageCodeSequence = 'PatientPrimaryLanguageCodeSequence',
    OtherPatientIDs = 'OtherPatientIDs',
    OtherPatientNames = 'OtherPatientNames',
    OtherPatientIDsSequence = 'OtherPatientIDsSequence',
    PatientAge = 'PatientAge',
    PatientAddress = 'PatientAddress',
    PatientMotherBirthName = 'PatientMotherBirthName',
    PatientID = 'PatientID',
    IssuerOfPatientID = 'IssuerOfPatientID',
    PatientBirthTime = 'PatientBirthTime',
    PatientSex = 'PatientSex',
    PatientBirthName = 'PatientBirthName',
    CountryOfResidence = 'CountryOfResidence',
    RegionOfResidence = 'RegionOfResidence',
    PatientTelephoneNumbers = 'PatientTelephoneNumbers',
    CurrentPatientLocation = 'CurrentPatientLocation',
    PatientInstitutionResidence = 'PatientInstitutionResidence',
    StudyDate = 'StudyDate',
    SeriesDate = 'SeriesDate',
    AcquisitionDate = 'AcquisitionDate',
    AcquisitionDateTime = 'AcquisitionDateTime',
    ContentDate = 'ContentDate',
    OverlayDate = 'OverlayDate',
    CurveDate = 'CurveDate',
    StudyTime = 'StudyTime',
    SeriesTime = 'SeriesTime',
    AcquisitionTime = 'AcquisitionTime',
    ContentTime = 'ContentTime',
    OverlayTime = 'OverlayTime',
    CurveTime = 'CurveTime',
    InstitutionAddress = 'InstitutionAddress',
    ReferringPhysicianName = 'ReferringPhysicianName',
    ReferringPhysicianAddress = 'ReferringPhysicianAddress',
    ReferringPhysicianTelephoneNumbers = 'ReferringPhysicianTelephoneNumbers',
    InstitutionalDepartmentName = 'InstitutionalDepartmentName',
    OperatorsName = 'OperatorsName',
    StudyID = 'StudyID',
    DateTime = 'DateTime',
    Date = 'Date',
    Time = 'Time',
    PersonName = 'PersonName',
};

export enum AnonymizationAction {
    DUMMY = 'D',
    ZERO_OR_DUMMY = 'Z',
    REMOVE = 'X',
    KEEP = 'K',
    CLEAN = 'C',
    UNIQUE = 'U'
}

/**
 * Represents a reference to DICOM tag positions in hexadecimal format.
 */
type DicomTagReference = {
    groupHex: string;  // Hexadecimal string of the group ID
    elementHex: string;  // Hexadecimal string of the element ID
    displayName: string;
    action: AnonymizationAction;
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
    [DicomTagKey.PersonName]: {
        groupHex: '0040',
        elementHex: 'A123',
        displayName: `Person Name`,
        action: AnonymizationAction.DUMMY,
    },
    [DicomTagKey.PatientName]: {
        groupHex: '0010',
        elementHex: '0010',
        displayName: `Patient's Name`,
        action: AnonymizationAction.ZERO_OR_DUMMY,
    },
    [DicomTagKey.PatientBirthDate]: {
        groupHex: '0010',
        elementHex: '0030',
        displayName: `Patient's Birth Date`,
        action: AnonymizationAction.ZERO_OR_DUMMY,
    },
    [DicomTagKey.AccessionNumber]: {
        groupHex: '0008',
        elementHex: '0050',
        displayName: `Accession Number`,
        action: AnonymizationAction.ZERO_OR_DUMMY,
    },
    [DicomTagKey.PatientID]: {
        groupHex: '0010',
        elementHex: '0020',
        displayName: `Patient ID`,
        action: AnonymizationAction.ZERO_OR_DUMMY,
    },
    [DicomTagKey.PatientSex]: {
        groupHex: '0010',
        elementHex: '0040',
        displayName: `Patient Sex`,
        action: AnonymizationAction.ZERO_OR_DUMMY,
    },
    [DicomTagKey.StudyDate]: {
        groupHex: '0008',
        elementHex: '0020',
        displayName: `Study Date`,
        action: AnonymizationAction.ZERO_OR_DUMMY,
    },
    [DicomTagKey.ContentDate]: {
        groupHex: '0008',
        elementHex: '0023',
        displayName: `Content Date`,
        action: AnonymizationAction.ZERO_OR_DUMMY,
    },
    [DicomTagKey.StudyTime]: {
        groupHex: '0008',
        elementHex: '0030',
        displayName: `Study Time`,
        action: AnonymizationAction.ZERO_OR_DUMMY,
    },
    [DicomTagKey.ContentTime]: {
        groupHex: '0008',
        elementHex: '0033',
        displayName: `Content Time`,
        action: AnonymizationAction.ZERO_OR_DUMMY,
    },
    [DicomTagKey.ReferringPhysicianName]: {
        groupHex: '0008',
        elementHex: '0090',
        displayName: `Referring Physician Name`,
        action: AnonymizationAction.ZERO_OR_DUMMY,
    },
    [DicomTagKey.StudyID]: {
        groupHex: '0020',
        elementHex: '0010',
        displayName: `Study ID`,
        action: AnonymizationAction.ZERO_OR_DUMMY,
    },
    [DicomTagKey.InstitutionName]: {
        groupHex: '0008',
        elementHex: '0080',
        displayName: `Institution Name`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.ReferringPhysicianIdentificationSequence]: {
        groupHex: '0008',
        elementHex: '0096',
        displayName: `Referring Physician ID Sequence`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.PhysiciansOfRecord]: {
        groupHex: '0008',
        elementHex: '1048',
        displayName: `Physicians Of Record`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.PhysiciansOfRecordIdentificationSequence]: {
        groupHex: '0008',
        elementHex: '1049',
        displayName: `Physicians Of Record ID Sequence`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.PerformingPhysicianName]: {
        groupHex: '0008',
        elementHex: '1050',
        displayName: `Performing Physician Name`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.PerformingPhysicianIdentificationSequence]: {
        groupHex: '0008',
        elementHex: '1052',
        displayName: `Performing Physician ID Sequence`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.NameOfPhysiciansReadingStudy]: {
        groupHex: '0008',
        elementHex: '1060',
        displayName: `Name Of Physician Reading Study`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.PhysiciansReadingStudyIdentificationSequence]: {
        groupHex: '0008',
        elementHex: '1062',
        displayName: `Physician Reading Study ID Sequence`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.PatientInsurancePlanCodeSequence]: {
        groupHex: '0010',
        elementHex: '0050',
        displayName: `Patient Insurance Plan Code Sequence`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.PatientPrimaryLanguageCodeSequence]: {
        groupHex: '0010',
        elementHex: '0101',
        displayName: `Patient Primary Language Code Sequence`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.OtherPatientIDs]: {
        groupHex: '0010',
        elementHex: '1000',
        displayName: `Other Patient IDs`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.OtherPatientNames]: {
        groupHex: '0010',
        elementHex: '1001',
        displayName: `Other Patient Names`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.OtherPatientIDsSequence]: {
        groupHex: '0010',
        elementHex: '1002',
        displayName: `Other Patient IDs Sequence`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.PatientAge]: {
        groupHex: '0010',
        elementHex: '1010',
        displayName: `Patient Age`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.PatientAddress]: {
        groupHex: '0010',
        elementHex: '1040',
        displayName: `Patient Address`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.PatientMotherBirthName]: {
        groupHex: '0010',
        elementHex: '1060',
        displayName: `Patient Mother BirthName`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.IssuerOfPatientID]: {
        groupHex: '0010',
        elementHex: '0021',
        displayName: `Issuer Of Patient ID`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.PatientBirthTime]: {
        groupHex: '0010',
        elementHex: '0032',
        displayName: `Patient Birth Time`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.PatientBirthName]: {
        groupHex: '0010',
        elementHex: '1005',
        displayName: `Patient Birth Name`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.CountryOfResidence]: {
        groupHex: '0010',
        elementHex: '2150',
        displayName: `Country Of Residence`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.RegionOfResidence]: {
        groupHex: '0010',
        elementHex: '2152',
        displayName: `Region Of Residence`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.PatientTelephoneNumbers]: {
        groupHex: '0010',
        elementHex: '2154',
        displayName: `Patient Telephone Numbers`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.CurrentPatientLocation]: {
        groupHex: '0038',
        elementHex: '0300',
        displayName: `Current Patient Location`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.PatientInstitutionResidence]: {
        groupHex: '0038',
        elementHex: '0400',
        displayName: `Patient Institution Residence`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.SeriesDate]: {
        groupHex: '0008',
        elementHex: '0021',
        displayName: `Series Date`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.AcquisitionDate]: {
        groupHex: '0008',
        elementHex: '0022',
        displayName: `Acquisition Date`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.AcquisitionDateTime]: {
        groupHex: '0008',
        elementHex: '002A',
        displayName: `Acquisition DateTime`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.OverlayDate]: {
        groupHex: '0008',
        elementHex: '0024',
        displayName: `Overlay Date`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.CurveDate]: {
        groupHex: '0008',
        elementHex: '0025',
        displayName: `Curve Date`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.SeriesTime]: {
        groupHex: '0008',
        elementHex: '0031',
        displayName: `Series Time`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.AcquisitionTime]: {
        groupHex: '0008',
        elementHex: '0032',
        displayName: `Acquisition Time`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.OverlayTime]: {
        groupHex: '0008',
        elementHex: '0034',
        displayName: `Overlay Time`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.CurveTime]: {
        groupHex: '0008',
        elementHex: '0035',
        displayName: `Curve Time`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.InstitutionAddress]: {
        groupHex: '0008',
        elementHex: '0081',
        displayName: `Institution Address`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.ReferringPhysicianAddress]: {
        groupHex: '0008',
        elementHex: '0092',
        displayName: `Referring Physician Address`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.ReferringPhysicianTelephoneNumbers]: {
        groupHex: '0008',
        elementHex: '0094',
        displayName: `Referring Physician Telephone Number`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.InstitutionalDepartmentName]: {
        groupHex: '0008',
        elementHex: '1040',
        displayName: `Institutional Department Name`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.OperatorsName]: {
        groupHex: '0008',
        elementHex: '1070',
        displayName: `Operators Name`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.DateTime]: {
        groupHex: '0040',
        elementHex: 'A120',
        displayName: `Date Time`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.Date]: {
        groupHex: '0040',
        elementHex: 'A121',
        displayName: `Date`,
        action: AnonymizationAction.REMOVE,
    },
    [DicomTagKey.Time]: {
        groupHex: '0040',
        elementHex: 'A122',
        displayName: `Time`,
        action: AnonymizationAction.REMOVE,
    },
};

/**
 * Represents a detailed structure of a DICOM tag including its name and numeric identifiers.
 */
export type DicomTag = {
    name: string;
    displayName: string;
    group: number;
    element: number;
    action: AnonymizationAction;
}

/**
 * Retrieves detailed information about a DICOM tag by its key.
 * @param {DicomTagKey} key - The key of the DICOM tag to retrieve.
 * @returns {DicomTag} The DICOM tag information including its name, group, and element numbers.
 */
export const getDicomTag = (key: DicomTagKey): DicomTag => {
    const { groupHex, elementHex, displayName, action } = DICTIONARY[key];
    return {
        name: key,
        displayName,
        group: numberManipulationUtil.hexToDecimal(groupHex),
        element: numberManipulationUtil.hexToDecimal(elementHex),
        action,
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