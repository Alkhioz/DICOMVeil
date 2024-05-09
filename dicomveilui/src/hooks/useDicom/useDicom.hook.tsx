import { useCallback, useEffect, useState } from 'react';
import init, { modify_patient_name } from './lib/dicom';

export const useDicom = () => {
    const [isWasmReady, setWasmReady] = useState(false);
    useEffect(() => {
        const loadWasm = async () => {
            await init();
            setWasmReady(true);
        };
        loadWasm();
    }, []);

    const handleAnonymization = useCallback(async (file:any) => {
        if (file && isWasmReady) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await modify_patient_name(new Uint8Array(arrayBuffer));
            return result;
        }
    }, [isWasmReady]);

    return {
        handleAnonymization,
    }
}