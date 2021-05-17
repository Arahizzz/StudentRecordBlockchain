import { selector } from "recoil";
import { RecordBook } from "../models/record_book";
import { UserRole } from "../models/user";
import { getRecordBook } from "../services/record_service";
import { authenticationState } from "./authentication";


export const recordBookState = selector<RecordBook | null>({
    key: 'recordBookState',
    get: async ({ get }) => {
        const auth = get(authenticationState);
        if (!auth || auth.role !== UserRole.Student) return null;
        return await getRecordBook(auth.login);
    }
})