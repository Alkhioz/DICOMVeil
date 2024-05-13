import { useReducer } from "react";

export enum fileStatus {
    UPLOADED = 'UPLOADED',
    ANONYMIZED = 'ANONYMIZED',
    DOWNLOADED = 'DOWNLOADED',
}

export type fileElement = {
    file: File,
    index: string,
    status: fileStatus,
    anonymizedFile?: Blob,
}

enum actionTypeEnum {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
    ANONYMIZE = 'ANONYMIZE',
    DOWNLOAD = 'DOWNLOAD',
    CLEAR = 'CLEAR',
}

type addFileActionType = {
    type: actionTypeEnum.ADD,
    payload: fileElement,
}

type removeFileActionType = {
    type: actionTypeEnum.REMOVE,
    payload: string,
}

type anonymizeFileActionType = {
    type: actionTypeEnum.ANONYMIZE,
    payload: {
        index: string,
        anonymizedFile: Blob,
    },
}

type downloadFileActionType = {
    type: actionTypeEnum.DOWNLOAD,
    payload: string,
}


type clearFileActionType = {
    type: actionTypeEnum.CLEAR,
}

const filesReducer = (state: fileElement[], action: addFileActionType | removeFileActionType | anonymizeFileActionType | downloadFileActionType | clearFileActionType) => {
    switch (action.type) {
        case actionTypeEnum.ADD:
            return [...state, { ...action.payload }];
        case actionTypeEnum.REMOVE:
            return state.filter((item) => item.index !== action.payload);
        case actionTypeEnum.ANONYMIZE:
            return state.map((item) =>
                item.index === action.payload.index ? {
                    ...item,
                    status: fileStatus.ANONYMIZED,
                    anonymizedFile: action.payload.anonymizedFile,
                } : item
            );
        case actionTypeEnum.DOWNLOAD:
            return state.map((item) =>
                item.index === action.payload ? { ...item, status: fileStatus.DOWNLOADED } : item
            );
        case actionTypeEnum.CLEAR:
            return [];
        default:
            throw new Error('Unknown action type');
    }
}

export const useFiles = () => {
    const [files, dispatch] = useReducer(filesReducer, []);
    const addFile = (file: fileElement) => {
        dispatch({ type: actionTypeEnum.ADD, payload: file });
    };
    const removeFile = (index: string) => {
        dispatch({ type: actionTypeEnum.REMOVE, payload: index });
    };
    const anonymizeFile = (
        payload: { index: string, anonymizedFile: Blob }
    ) => {
        dispatch({ type: actionTypeEnum.ANONYMIZE, payload });
    };
    const downloadFile = (index: string) => {
        dispatch({ type: actionTypeEnum.DOWNLOAD, payload: index });
    };
    const clearFiles = () => {
        dispatch({ type: actionTypeEnum.CLEAR });
    }

    return {
        files,
        addFile,
        removeFile,
        anonymizeFile,
        downloadFile,
        clearFiles,
    }
}