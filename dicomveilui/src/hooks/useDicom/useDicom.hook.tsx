import { useCallback, useEffect, useState } from 'react';
import init, { modify_tag_value, get_tag_value } from './dicomlib/wasm/dicom';

type setTagType = {
    group: number;
    element: number;
    value: string;
}

type getTagType = {
    tag: string;
    value: string;
}

export const useDicom = () => {
    const [isWasmReady, setWasmReady] = useState(false);
    useEffect(() => {
        const loadWasm = async () => {
            await init();
            setWasmReady(true);
        };
        loadWasm();
    }, []);

    const handleSetTagValue = useCallback(async (file: any, tags: Array<setTagType>) => {
        if (file && isWasmReady) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await modify_tag_value(new Uint8Array(arrayBuffer), JSON.stringify(tags));
            return result;
        }
    }, [isWasmReady]);

    const handleGetTagValue = useCallback(async (file: any, tags: Array<string>): Promise<Array<getTagType>> => {
        if (file && isWasmReady) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await get_tag_value(new Uint8Array(arrayBuffer), tags);
            return JSON.parse(result);
        }
        return [];
    }, [isWasmReady]);

    return {
        handleSetTagValue,
        handleGetTagValue,
    }
}