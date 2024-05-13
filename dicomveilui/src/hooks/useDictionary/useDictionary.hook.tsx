/**
 * @fileoverview React hook for retrieving DICOM tag information.
 */

import { useMemo } from "react";
import { DicomTagKey, getDictionary } from "./dictionary/dicom.dictionary";

/**
 * React hook that provides a dictionary of DICOM tags based on input.
 * @param {DicomTagKey[] | undefined} partialDictionary - Optional array of DICOM tag keys to retrieve.
 * If not provided or empty, the hook defaults to all available DICOM tags.
 * @returns {Record<DicomTagKey, DicomTag>} A dictionary of DICOM tags.
 */
export const useDictionary = (partialDictionary?: DicomTagKey[]) => {
    const dictionary = useMemo(() => {
        const tags = partialDictionary?.length ? partialDictionary : Object.values(DicomTagKey);
        return getDictionary(tags);
    }, [partialDictionary]);
    return dictionary;
}