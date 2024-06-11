import { DicomTag } from "@hooks/useDictionary/dictionary/dicom.dictionary"
import { MutableRefObject } from "react"

export type contronInputType = {
    checked: boolean,
    input?: string | undefined,
}

export type controlInputsRefType = Record<string, contronInputType>

type ProfileConfigurationType = {
    controlInputsRef: MutableRefObject<controlInputsRefType>
    actions: {
        dummyAction: (DicomTag & { dummy: string })[]
        zeroOrDummyAction: (DicomTag & { dummy: string })[]
        removeAction: DicomTag[]
    }
}

export const ProfileConfiguration = ({
    controlInputsRef,
    actions: {
        dummyAction,
        zeroOrDummyAction,
        removeAction,
    }
}: ProfileConfigurationType) => {
    const handleCheckboxChange = (name: string) => {
        if (!controlInputsRef?.current[name]) {
            controlInputsRef.current[name] = {
                checked: false,
                input: undefined,
            }
        }
        controlInputsRef.current[name].checked = !controlInputsRef?.current?.[name]?.checked;
    };
    return (
        <div className="p-4 w-full h-full border border-blue-700 grid grid-rows-[auto,1fr]">
            <h1 className="text-xl font-black">Anonymization Configuration</h1>
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <fieldset className="block border border-blue-700">
                    <legend>Replaced By Dummy Data:</legend>
                    <div className="w-full h-full relative">
                        <div className="absolute w-full h-full overflow-y-scroll grid grid-cols-1 gap-4 p-4">
                            {
                                dummyAction?.map((action) => (
                                    <div key={action.name} className="flex gap-2 w-full h-fit p-4 border border-blue-700">
                                        <label
                                            htmlFor={`${action.name}-input`}
                                            className="flex-grow"
                                        >{action.displayName}</label>
                                        <input
                                            type="text"
                                            name={`${action.name}-input`}
                                            id={`${action.name}-input`}
                                            className="text-black h-fit"
                                        />
                                        <input
                                            type="checkbox"
                                            name={`${action.name}-check`}
                                            id={`${action.name}-check`}
                                            value={`${action.name}-check`}
                                            onChange={() =>
                                                handleCheckboxChange(action.name)
                                            }
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </fieldset>
                <fieldset className="block border border-blue-700">
                    <legend>Replaced By Zero or Dummy Data:</legend>
                    <div className="w-full h-full relative">
                        <div className="absolute w-full h-full overflow-y-scroll grid grid-cols-1 gap-4 p-4">
                            {
                                zeroOrDummyAction?.map((action) => (
                                    <div key={action.name} className="flex gap-2 w-full h-fit p-4 border border-blue-700">
                                        <label
                                            htmlFor={`${action.name}-input`}
                                            className="flex-grow"
                                        >{action.displayName}</label>
                                        <input
                                            type="text"
                                            name={`${action.name}-input`}
                                            id={`${action.name}-input`}
                                            className="text-black h-fit"
                                        />
                                        <input
                                            type="checkbox"
                                            name={`${action.name}-check`}
                                            id={`${action.name}-check`}
                                            value={`${action.name}-check`}
                                            onChange={() =>
                                                handleCheckboxChange(action.name)
                                            }
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </fieldset>
                <fieldset className="block col-span-1 md:col-span-2 border border-blue-700">
                    <legend>Remove:</legend>
                    <div className="w-full h-full relative">
                        <div className="absolute w-full h-full overflow-y-scroll grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                            {
                                removeAction?.map((action) => (
                                    <div key={action.name} className="flex gap-2 w-full h-fit p-4 border border-blue-700">
                                        <label
                                            htmlFor={action.name}
                                            className="flex-grow"
                                        >{action.displayName}</label>
                                        <input
                                            type="checkbox"
                                            name={action.name}
                                            id={action.name}
                                            value={action.name}
                                            onChange={() =>
                                                handleCheckboxChange(action.name)
                                            }
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </fieldset>
            </div>
        </div>
    );
}