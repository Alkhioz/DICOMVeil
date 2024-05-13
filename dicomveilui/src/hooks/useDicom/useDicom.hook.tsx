import { useCallback, useEffect, useState } from 'react';
import init, { modify_tag_value, get_tag_value } from './lib/dicom';

type setTagType = {
    group: number;
    element: number;
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

    const handleGetTagValue = useCallback(async (file: any, tag: string) => {
        if (file && isWasmReady) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await get_tag_value(new Uint8Array(arrayBuffer), tag);
            return result;
        }
    }, [isWasmReady]);

    return {
        handleSetTagValue,
        handleGetTagValue,
    }
}