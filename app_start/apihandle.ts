import {ErrorResult} from "business_core_app_react";
import Utils from "../src/common/utils";

const handleBusinessError = (error: ErrorResult): void => {
  Utils.showErrorToast(error.message);
}
const handleExceptionError = (error: ErrorResult): void => {
  Utils.showErrorToast(error.message);
}
const generateHeader = async (): Promise<any> => {

    // const store: IStore = FactoryInjection.get<IStore>(PUBLIC_TYPES.IStore);
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
}

export {handleBusinessError, handleExceptionError, generateHeader};