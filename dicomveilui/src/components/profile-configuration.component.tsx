import { DicomTag } from "@hooks/useDictionary/dictionary/dicom.dictionary"
import { useEffect } from "react"
import { FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form"

type ProfileConfigurationType = {
    register: UseFormRegister<FieldValues>
    setValue: UseFormSetValue<FieldValues>
    actions: {
        dummyAction: (DicomTag & { dummy: string })[]
        zeroOrDummyAction: (DicomTag & { dummy: string })[]
        removeAction: DicomTag[]
    }
}

export const ProfileConfiguration = ({
    register,
    setValue,
    actions: {
        dummyAction,
        zeroOrDummyAction,
        removeAction,
    }
}: ProfileConfigurationType) => {
    useEffect(() => {
        for (const action of [...dummyAction, ...zeroOrDummyAction]) {
            setValue(`${action.name}-input`, action.dummy);
            setValue(`${action.name}-check`, true);
        }
        for (const action of removeAction) {
            setValue(`${action.name}-check`, true);
        }
    }, [
        dummyAction,
        zeroOrDummyAction,
        removeAction,
    ]);
    return (
        <div className="p-4 w-full h-full border border-blue-700 grid grid-rows-[auto,1fr]">
            <h1 className="text-xl font-black">Anonymization Configuration</h1>
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <fieldset className="block border border-blue-700 rounded-lg">
                    <legend>Replaced By Dummy Data:</legend>
                    <div className="w-full h-full relative">
                        <div className="absolute w-full h-full overflow-y-scroll grid grid-cols-1 gap-4 p-4">
                            {
                                dummyAction?.map((action) => (
                                    <div key={action.name} className="flex flex-wrap gap-2 w-full h-fit p-4 border border-blue-700 rounded-lg">
                                        <label
                                            htmlFor={`${action.name}-input`}
                                            className="flex-grow"
                                        >{action.displayName}</label>
                                        <input
                                            type="text"
                                            id={`${action.name}-input`}
                                            className="text-black h-fit rounded-lg px-2 w-full max-w-52"
                                            {...register(`${action.name}-input`)}
                                        />
                                        <input
                                            type="checkbox"
                                            id={`${action.name}-check`}
                                            value={`${action.name}-check`}
                                            {...register(`${action.name}-check`)}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </fieldset>
                <fieldset className="block border border-blue-700 rounded-lg">
                    <legend>Replaced By Zero or Dummy Data:</legend>
                    <div className="w-full h-full relative">
                        <div className="absolute w-full h-full overflow-y-scroll grid grid-cols-1 gap-4 p-4">
                            {
                                zeroOrDummyAction?.map((action) => (
                                    <div key={action.name} className="flex flex-wrap gap-2 w-full h-fit p-4 border border-blue-700 rounded-lg">
                                        <label
                                            htmlFor={`${action.name}-input`}
                                            className="flex-grow"
                                        >{action.displayName}</label>
                                        <input
                                            type="text"
                                            id={`${action.name}-input`}
                                            className="text-black h-fit rounded-lg px-2 w-full max-w-52"
                                            {...register(`${action.name}-input`)}
                                        />
                                        <input
                                            type="checkbox"
                                            id={`${action.name}-check`}
                                            value={`${action.name}-check`}
                                            {...register(`${action.name}-check`)}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </fieldset>
                <fieldset className="block col-span-1 md:col-span-2 border border-blue-700 rounded-lg">
                    <legend>Remove:</legend>
                    <div className="w-full h-full relative">
                        <div className="absolute w-full h-full overflow-y-scroll grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                            {
                                removeAction?.map((action) => (
                                    <div key={action.name} className="flex flex-wrap gap-2 w-full h-fit p-4 border border-blue-700 rounded-lg">
                                        <label
                                            htmlFor={action.name}
                                            className="flex-grow"
                                        >{action.displayName}</label>
                                        <input
                                            type="checkbox"
                                            id={`${action.name}-check`}
                                            value={`${action.name}-check`}
                                            {...register(`${action.name}-check`)}
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