import { useCallback, useEffect, useState } from 'react';
import init, { update_tags, remove_tags, remove_update_tags, get_tags } from './dicomlib/dicom';
import { useDictionary } from '@hooks/useDictionary/useDictionary.hook';
import { AnonymizationAction, DicomTag, DicomTagKey } from '@hooks/useDictionary/dictionary/dicom.dictionary';

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
    const handleUpdateTags = useCallback(async (file: any, tags: Array<tagValueType>) => {
        if (file && isWasmReady) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await update_tags(
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
    const handleRemoveTags = useCallback(async (file: any, tags: Array<DicomTagKey>) => {
        if (file && isWasmReady) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await remove_tags(
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
    const handleRemoveUpdateTags = useCallback(async (file: any, tags: Array<ActionType>) => {
        if (file && isWasmReady) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await remove_update_tags(
                new Uint8Array(arrayBuffer),
                JSON.stringify(
                    tags?.map((tag: ActionType): tagValueTypeMapped => {
                        const action = dictionary[tag.key].action;
                        const type = action === AnonymizationAction.REMOVE ?
                            dicomActionType.DELETEACTION : dicomActionType.UPDATEACTION;
                        return {
                            group: dictionary[tag.key].group,
                            element: dictionary[tag.key].element,
                            operationtype: type,
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
    const handleGetTags = useCallback(async (file: any, tags: Array<DicomTagKey>): Promise<Array<tagValueType>> => {
        if (file && isWasmReady) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await get_tags(new Uint8Array(arrayBuffer), tags);
            return JSON.parse(result);
        }
        return [];
    }, [isWasmReady]);

    return {
        handleUpdateTags,
        handleRemoveTags,
        handleRemoveUpdateTags,
        handleGetTags,
    }
}