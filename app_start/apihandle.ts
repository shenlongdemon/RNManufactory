import {ErrorResult} from "business_core_app_react";

const handleBusinessError = (_error: ErrorResult): void => {
    debugger
}
const handleExceptionError = (_error: ErrorResult): void => {
    debugger
}
const generateHeader = async (): Promise<any> => {

    // const store: IStore = FactoryInjection.get<IStore>(PUBLIC_TYPES.IStore);
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
}

export {handleBusinessError, handleExceptionError, generateHeader};