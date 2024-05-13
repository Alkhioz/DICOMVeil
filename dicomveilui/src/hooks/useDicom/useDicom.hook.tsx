import { useCallback, useEffect, useState } from 'react';
import init, { modify_tag_value, get_tag_value, remove_tag, remove_update_tag } from './dicomlib/dicom';
import { useDictionary } from '../useDictionary/useDictionary.hook';
import { DicomTag, DicomTagKey } from '../useDictionary/dictionary/dicom.dictionary';

/**
 * Represents a simplified type for a DICOM tag with its key and associated value.
 * @typedef {Object} tagType
 * @property {DicomTagKey} key - The key of the DICOM tag.
 * @property {string} value - The value to be associated with the DICOM tag.
 */
type tagValueType = {
    key: DicomTagKey;
    value: string;
}

export enum dicomActionType {
    DELETEACTION = 0,
    UPDATEACTION = 1,
}

export type ActionType = {
    key: DicomTagKey;
    type: dicomActionType;
    value?: string;
}


type tagTypeMapped = {
    group: number;
    element: number;
    operationtype: number;
}

type tagValueTypeMapped = {
    group: number;
    element: number;
    operationtype: number;
    value: string;
}

/**
 * Custom React hook to manage DICOM tags within a web application.
 * @returns {Object} An object containing functions to handle setting and getting DICOM tag values.
 */
export const useDicom = () => {
    /**
     * State to track if the WebAssembly module is ready.
     */
    const [isWasmReady, setWasmReady] = useState(false);
    /**
     * Retrieves a dictionary of DICOM tags currently supported.
     */
    const dictionary: Record<DicomTagKey, DicomTag> = useDictionary();
    /**
     * Effect to asynchronously load the WebAssembly module.
     */
    useEffect(() => {
        const loadWasm = async () => {
            await init();
            setWasmReady(true);
        };
        loadWasm();
    }, []);

    /**
     * Handles setting values for specified DICOM tags within a DICOM file.
     * @async
     * @param {any} file - The file object (assumed to be a DICOM file).
     * @param {Array<TagValueType>} tags - An array of tag types to set in the DICOM file.
     * @returns {Promise<Uint8Array>} A promise that resolves to the result of the tag modification operation.
     */
    const handleSetTagValue = useCallback(async (file: any, tags: Array<tagValueType>) => {
        if (file && isWasmReady) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await modify_tag_value(
                new Uint8Array(arrayBuffer),
                JSON.stringify(
                    tags?.map((tag: tagValueType): tagValueTypeMapped => {
                        return {
                            group: dictionary[tag.key].group,
                            element: dictionary[tag.key].element,
                            operationtype: dicomActionType.UPDATEACTION,
                            value: tag.value,
                        }
                    })
                )
            );
            return result;
        }
    }, [isWasmReady]);
    /**
     * Handles removal of tags inside a DICOM file.
     * @async
     * @param {any} file - The file object (assumed to be a DICOM file).
     * @param {Array<DicomTagKey>} tags - An array of keys to remove from the DICOM file.
     * @returns {Promise<Uint8Array>} A promise that resolves to the result of the tag removal operation.
     */
    const handleRemoveTag = useCallback(async (file: any, tags: Array<DicomTagKey>) => {
        if (file && isWasmReady) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await remove_tag(
                new Uint8Array(arrayBuffer),
                JSON.stringify(
                    tags?.map((key: DicomTagKey): tagTypeMapped => {
                        return {
                            group: dictionary[key].group,
                            element: dictionary[key].element,
                            operationtype: dicomActionType.DELETEACTION,
                        }
                    })
                )
            );
            return result;
        }
    }, [isWasmReady]);
    /**
     * Handles removal of tags inside a DICOM file.
     * @async
     * @param {any} file - The file object (assumed to be a DICOM file).
     * @param {Array<DicomTagKey>} tags - An array of keys to remove from the DICOM file.
     * @returns {Promise<Uint8Array>} A promise that resolves to the result of the tag removal operation.
     */
    const handleRemoveUpdateTag = useCallback(async (file: any, tags: Array<ActionType>) => {
        if (file && isWasmReady) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await remove_update_tag(
                new Uint8Array(arrayBuffer),
                JSON.stringify(
                    tags?.map((tag: ActionType): tagValueTypeMapped => {
                        return {
                            group: dictionary[tag.key].group,
                            element: dictionary[tag.key].element,
                            operationtype: tag.type,
                            value: tag?.value ?? '',
                        }
                    })
                )
            );
            return result;
        }
    }, [isWasmReady]);
    /**
     * Retrieves the values of specified DICOM tags from the provided file.
     * 
     * @param {File} file - The DICOM file to read from.
     * @param {Array<DicomTagKey>} tags - An array of DICOM tag keys to retrieve values for.
     * @returns A promise that resolves to an array of tag types with key and value pairs.
     */
    const handleGetTagValue = useCallback(async (file: any, tags: Array<DicomTagKey>): Promise<Array<tagValueType>> => {
        if (file && isWasmReady) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await get_tag_value(new Uint8Array(arrayBuffer), tags);
            return JSON.parse(result);
        }
        return [];
    }, [isWasmReady]);

    return {
        handleSetTagValue,
        handleRemoveTag,
        handleRemoveUpdateTag,
        handleGetTagValue,
    }
}