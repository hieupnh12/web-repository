import BASE_URL from '../api';
import { GET, POST } from '../constants/httpMethod';

export const fetchAccounts = () => {
    const responds = BASE_URL[GET]("account");
    return responds;
}

export const createAccount = (id, data) => {
    const responds = BASE_URL[POST](`account/${id}`,data);
    return responds;
}

export const updateAccount = () => {
    const responds = BASE_URL[GET]("account");
    return responds;
}

export const deleteAccount = () => {
    const responds = BASE_URL[GET]("account");
    return responds;
}

 