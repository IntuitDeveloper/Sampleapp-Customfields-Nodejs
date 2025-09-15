import { GraphQLClient, gql } from 'graphql-request';
import axios from 'axios';
import dotenv from 'dotenv'

import { getCustomFieldsQuery } from '../graphql/customfields/getAllCustomFields.js';
import { createCustomFieldMutation, createCustomFieldVariable } from '../graphql/customfields/createCustomField.js';
import { updateCustomFieldVariable, updateCustomFielMutation } from '../graphql/customfields/updateCustomField.js';

dotenv.config();

export const getGraphQLClient = (endpoint, token, realmId) => new GraphQLClient(endpoint, {
    headers: {
        authorization: `Bearer ${token}`,
        'intuit-realm-id': realmId
    }
});

export const getAxiosClient = (baseUrl, token) => axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
    }
});

const makeHttpRequest = async(client, url, method, body) => {
    try{
        if(method === 'get') {
            const response = await client.get(url);
            return response;
        } else if(method === 'post') {
            const response = await client.post(url, body);
            return response;
        }
    } catch(err) {
        console.log('err', err?.response?.data || err?.message || err);
        throw err;
    }
}

const makeRequest = async (client, queryData, variables) => {
    try{
        const query = gql`${queryData}`;
        const response = await client.request(query, variables);
        return response;
    } catch(error) {
        try {
            console.log('an error is here', error);
            const detailed = error?.response || error;
            console.log('An Error Occured', JSON.stringify(detailed, null, 2));
        } catch (e) {
            console.log('An Error Occured', error);
        }
        throw error;
    }
}

export const getCustomFields = async (client) => {
    const response = await makeRequest(client, getCustomFieldsQuery, {});
    return response;
}

export const createCustomField = async (client, body) => {
    const response = await makeRequest(client, createCustomFieldMutation, createCustomFieldVariable(body));
    return response;
}

export const updateCustomField = async (client, id, body) => {
    const response = await makeRequest(client, updateCustomFielMutation, updateCustomFieldVariable(id, body));
    return response;
}