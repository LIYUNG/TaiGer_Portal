import axios from 'axios';

export const BASE_URL =
    process.env.NODE_ENV === 'development'
        ? process.env.REACT_APP_DEV_URL
        : process.env.REACT_APP_PROD_URL;

const tenantId =
    process.env.NODE_ENV === 'development'
        ? process.env.REACT_APP_DEV_TENANT_ID
        : process.env.REACT_APP_TENANT_ID;

const request = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        tenantId: tenantId
    },
    withCredentials: true,
    credentials: 'same-origin',
    validateStatus: (status) => status < 500
});

const postData = async (url, payload) => {
    try {
        const response = await request.post(url, payload);
        if (response.status >= 400) {
            throw new Error(
                response.data?.message || 'An unknown error occurred'
            );
        }
        return response.data; // Return the data on success
    } catch (error) {
        console.log(error);
        throw error; // Propagate the error
    }
};

const putData = async (url, payload) => {
    try {
        const response = await request.put(url, payload);
        if (response.status >= 400) {
            throw new Error(
                response.data?.message || 'An unknown error occurred'
            );
        }
        return response.data; // Return the data on success
    } catch (error) {
        console.log(error);
        throw error; // Propagate the error
    }
};

const getData = async (url) => {
    try {
        const response = await request.get(url);
        if (response.status >= 400) {
            throw new Error(
                response.data?.message || 'An unknown error occurred'
            );
        }
        return response.data; // Return the data on success
    } catch (error) {
        console.log(error);
        throw error; // Propagate the error
    }
};

const getDataBlob = async (url, blob) => {
    try {
        const response = await request.get(url, blob);
        if (response.status >= 400) {
            throw new Error(
                response.data?.message || 'An unknown error occurred'
            );
        }
        return response.data; // Return the data on success
    } catch (error) {
        console.log(error);
        throw error; // Propagate the error
    }
};

const deleteData = async (url) => {
    try {
        const response = await request.delete(url);
        if (response.status >= 400) {
            throw new Error(
                response.data?.message || 'An unknown error occurred'
            );
        }
        return response.data; // Return the data on success
    } catch (error) {
        console.log(error);
        throw error; // Propagate the error
    }
};

export { request, postData, putData, getData, getDataBlob, deleteData };
