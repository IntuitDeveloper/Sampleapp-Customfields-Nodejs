import { Router } from 'express';
import dotenv from 'dotenv';

import {getClient} from '../services/auth-service.js';
import {
    getGraphQLClient,
    getAxiosClient,
    getCustomFields,
    createCustomField,
    updateCustomField
} from '../services/customfields-service.js';

dotenv.config();

const router = Router();

const sandBoxUrl = 'https://qb-sandbox.api.intuit.com/graphql';
const prodUrl = 'https://qb.api.intuit.com/graphql';

const getUrl = () => 
    process.env.ENVIRONMENT === 'sandbox'
      ? sandBoxUrl
      : prodUrl;

const baseHttpUri = process.env.ENVIRONMENT === 'sandbox'
                    ? "https://sandbox-quickbooks.api.intuit.com" 
                    : "https://quickbooks.api.intuit.com";
      
const getCustomFieldsClient = () => {
    const clientInstance = getClient?.() || null;
    const tokenObj = clientInstance?.getToken?.()?.getToken?.();
    if (!tokenObj?.access_token || !tokenObj?.realmId) {
        return null;
    }
    const token = tokenObj.access_token;
    const realmId = tokenObj.realmId;
    const graphqlUrl = getUrl();
    const client = getGraphQLClient(graphqlUrl, token, realmId);
    return client;
};

router.get('/', async function (req, res) {
    try {
        const client = getCustomFieldsClient();
        if (!client) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const response = await getCustomFields(client);
        if (!response || !response.appFoundationsCustomFieldDefinitions) {
            return res.status(500).json({ message: 'Invalid response from GraphQL' });
        }
        res.send(response);
    } catch (error) {
        console.error('Error fetching custom fields', error?.response?.errors || error?.message || error);
        res.status(500).json({ message: 'Failed to fetch custom fields', error: error?.response?.errors || error?.message });
    }
});

router.post('/', async function (req, res) {
    try {
        const client = getCustomFieldsClient();
        if (!client) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const response = await createCustomField(client, req.body);
        if (!response || !response.appFoundationsCreateCustomFieldDefinition) {
            return res.status(500).json({ message: 'Invalid response from GraphQL' });
        }
        res.send(response);
    } catch (error) {
        console.log('yup', error);
        console.error('Error creating custom field', error?.response?.errors || error?.message || error);
        res.status(500).json({ message: 'Failed to create custom field', error: error?.response?.errors || error?.message });
    }
});

router.put('/:id', async function (req, res) {
    try {
        const client = getCustomFieldsClient();
        if (!client) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const response = await updateCustomField(client, req.params.id, req.body);
        if (!response || !response.appFoundationsUpdateCustomFieldDefinition) {
            return res.status(500).json({ message: 'Invalid response from GraphQL' });
        }
        res.send(response);
    } catch (error) {
        console.error('Error updating custom field', error?.response?.errors || error?.message || error);
        res.status(500).json({ message: 'Failed to update custom field', error: error?.response?.errors || error?.message });
    }
});

router.delete('/:id', async function (req, res) {
    try {
        const client = getCustomFieldsClient();
        if (!client) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const response = await updateCustomField(client, req.params.id, {active: false});
        if (!response || !response.appFoundationsUpdateCustomFieldDefinition) {
            return res.status(500).json({ message: 'Invalid response from GraphQL' });
        }
        res.send(response);
    } catch (error) {
        console.error('Error deleting custom field', error?.response?.errors || error?.message || error);
        res.status(500).json({ message: 'Failed to delete custom field', error: error?.response?.errors || error?.message });
    }
});

export default router;
