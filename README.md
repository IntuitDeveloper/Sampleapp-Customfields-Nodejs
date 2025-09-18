# QuickBooks Custom Fields API - Node.js

A Node.js Express API for managing QuickBooks Custom Field Definitions using the App Foundations GraphQL API and the Intuit Node.js SDK.

## Features

- **Complete CRUD Operations**: Create, Read, Update, Delete (soft delete) for QuickBooks custom field definitions
- **App Foundations API Integration**: Full implementation using QuickBooks App Foundations GraphQL API
- **Advanced Association Management**: Complex entity relationships (Transactions, Contacts, Vendors, Customers)
- **Production-Ready Soft Delete**: Safe deactivation-based deletion preserving data integrity
- **Schema Compliance**: Complete `AppFoundations_CustomFieldDefinitionInput` schema support
- **Automatic Field Management**: Auto-retrieval of required fields (`legacyIDV2`, field preservation)
- **Business Rule Enforcement**: Association validation and mutual exclusivity checking
- **OAuth 2.0 with App Foundations Scopes**: Secure authentication with granular permissions
- **RESTful API**: Clean REST endpoints for seamless integration
- **Comprehensive Error Handling**: GraphQL error parsing and detailed validation messages
- **Interactive Web Interface**: Simple HTML interface for testing API operations

## API Endpoints

### **Core Custom Field Operations (Essential)**
- `GET /api/quickbook/custom-fields` - Get all custom field definitions with associations
- `POST /api/quickbook/custom-fields` - Create a new custom field definition
- `PUT /api/quickbook/custom-fields/:id` - Update an existing custom field definition
- `DELETE /api/quickbook/custom-fields/:id` - Delete (deactivate) a custom field definition

### **OAuth Authentication (Required)**
- `GET /api/auth/login` - Initiate OAuth flow
- `GET /api/auth/callback` - OAuth callback handler
- `POST /api/auth/retrieveToken` - Get current token information

## Configuration

Update your `.env` file with your QuickBooks app credentials:

**Note**: The App Foundations Custom Field Definitions API uses the **production environment by default** as it's not available in sandbox mode.

```env
PORT=8080

CLIENT_ID=YOUR_CLIENT_ID
CLIENT_SECRET=YOUR_CLIENT_SECRET
ENVIRONMENT=production
REDIRECT_URI=https://your-ngrok-url.ngrok-free.app/api/auth/callback
```

## Prerequisites

Before running this application, ensure you have the following:

- **Node.js 18.0.0 or higher** - [Download Node.js](https://nodejs.org/)
- **npm 8.0.0 or higher** - Comes with Node.js
- **ngrok** - For OAuth callback handling - [Download ngrok](https://ngrok.com/)
- A [QuickBooks Online Developer Account](https://developer.intuit.com/)
- An application created in the [Intuit Developer Portal](https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0)

### Check Your Node.js Version
```bash
node --version
npm --version
```

**Required Versions:**
- Node.js: 18.0.0 or higher
- npm: 8.0.0 or higher

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure QuickBooks App**
   - Create a QuickBooks app at [Intuit Developer](https://developer.intuit.com/)
   - Update `.env` with your app credentials
   - Set redirect URI to your ngrok URL: `https://your-ngrok-url.ngrok-free.app/api/auth/callback`

3. **Start ngrok (Required for OAuth)**
   ```bash
   ngrok http 8080
   ```
   Copy the ngrok URL and update your `.env` file and QuickBooks app settings.

4. **Run the Application**
   ```bash
   npm start
   ```

5. **Access the Application**
   - Open your browser to `http://localhost:8080`
   - Click "Connect to QuickBooks" to authenticate
   - Use the interface to manage custom fields

## Custom Field Definition Features

The App Foundations API provides advanced custom field capabilities:

### Data Types
- **STRING**: Text values
- **NUMBER**: Numeric values (decimal)
- **DATE**: Date values
- **BOOLEAN**: True/false values
- **DROPDOWN**: Predefined options (future support)

### Entity Associations

Custom fields can be associated with different QuickBooks entities and their sub-types. The API supports flexible association configurations:

#### **Supported Entity Types**
- **Transactions**: `/transactions/Transaction`
  - `SALE_INVOICE` - Sales invoices
  - `SALE_ESTIMATE` - Sales estimates/quotes  
  - `PURCHASE_ORDER` - Purchase orders
  - And more transaction types...
- **Contacts**: `/network/Contact`
  - `CUSTOMER` - Customer contacts
  - `VENDOR` - Vendor contacts
  - `EMPLOYEE` - Employee contacts

#### **Association Configuration**
```json
{
  "name": "Custom Field Name",
  "type": "STRING",
  "associations": [
    {
      "associatedEntity": "/transactions/Transaction",
      "active": true,
      "required": false,
      "associationCondition": "INCLUDED",
      "subAssociations": ["SALE_INVOICE", "SALE_ESTIMATE"]
    }
  ]
}
```

#### **Association Features**
- **✅ Multiple Sub-Entities**: Associate with multiple sub-types within the same entity
- **✅ Required/Optional Fields**: Control field validation per association
- **✅ Active State Management**: Enable/disable associations dynamically
- **✅ Conditional Logic**: `INCLUDED` or `EXCLUDED` association conditions
- **❌ Mixed Entity Types**: Cannot combine Contact and Transaction associations in one field

#### **Business Rules**
- **Single Entity Type**: Each custom field can only associate with one main entity type
- **Multiple Sub-Associations**: Within an entity type, you can associate with multiple sub-types
- **Mutual Exclusivity**: Some sub-associations are mutually exclusive (API will return specific errors)

## App Foundations GraphQL Operations

The service uses the App Foundations API with complete CRUD support:

### **Queries**
- **`appFoundationsCustomFieldDefinitions`**: Primary query for retrieving all custom field definitions
- **Association Data**: Complex entity relationships with sub-associations
- **Legacy ID Support**: Handles both `legacyID` and `legacyIDV2` formats
- **Edge-based Results**: GraphQL edges/nodes pattern for pagination

### **Mutations**

#### **Create: `appFoundationsCreateCustomFieldDefinition`**
- **Input**: `AppFoundations_CustomFieldDefinitionCreateInput!`
- **Required**: `label`, `dataType`, `active`, `associations`
- **Returns**: Complete field definition with generated ID
- **Features**: Default associations, custom entity relationships

#### **Update: `appFoundationsUpdateCustomFieldDefinition`**
- **Input**: `AppFoundations_CustomFieldDefinitionUpdateInput!`
- **Required**: `id`, `legacyIDV2`, `label`, `active`, `dataType`
- **Returns**: Updated field definition
- **Features**: Partial updates, field preservation, association modification

#### **Delete: Soft Delete via Update**
- **Implementation**: Uses update mutation with `active: false`
- **Reason**: App Foundations API doesn't provide direct delete mutation
- **Benefits**: Data preservation, audit trails, reversibility
- **Schema**: Same as update but sets inactive status

### **Schema Compliance**
- **Production Environment**: App Foundations API requires production endpoints
- **GraphQL Endpoint**: `https://qb.api.intuit.com/graphql`
- **Required Scopes**: `app-foundations.custom-field-definitions.read`, `app-foundations.custom-field-definitions`
- **Authentication**: OAuth 2.0 Bearer tokens

## CRUD Operations Guide

The QuickBooks CustomFields API provides complete Create, Read, Update, and Delete (CRUD) operations using the App Foundations GraphQL API.

### **CREATE - Custom Field Definitions**

Creates new custom fields with flexible association configurations using `AppFoundations_CustomFieldDefinitionCreateInput`.

#### **Required Fields**
- `name` (String): Field name/label
- `type` (String): `STRING`, `NUMBER`, `DATE`, `BOOLEAN`
- `associations` (Array): Entity associations (optional, defaults to Transaction/SALE_INVOICE)

#### **Examples:**

**Default Association (Backward Compatibility)**
```bash
curl -X POST "http://localhost:8080/api/quickbook/custom-fields" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Default Field",
    "type": "STRING"
  }'
```
*Creates: Transaction/SALE_INVOICE association (default behavior)*

**Contact/Vendor Association**
```bash
curl -X POST "http://localhost:8080/api/quickbook/custom-fields" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vendor Contact Field",
    "type": "STRING",
    "associations": [
      {
        "associatedEntity": "/network/Contact",
        "active": true,
        "required": false,
        "associationCondition": "INCLUDED",
        "subAssociations": ["VENDOR"]
      }
    ]
  }'
```

**Multiple Transaction Types**
```bash
curl -X POST "http://localhost:8080/api/quickbook/custom-fields" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Multi Transaction Field",
    "type": "STRING",
    "associations": [
      {
        "associatedEntity": "/transactions/Transaction",
        "active": true,
        "required": false,
        "associationCondition": "INCLUDED",
        "subAssociations": ["SALE_INVOICE", "SALE_ESTIMATE"]
      }
    ]
  }'
```

#### **Business Rules**
- ✅ **Single Entity Type**: Each field can only associate with one main entity type
- ✅ **Multiple Sub-Associations**: Within an entity, multiple sub-types are supported
- ❌ **Mixed Entity Types**: Cannot combine Contact and Transaction associations in one field
- ⚠️ **Mutual Exclusivity**: Some sub-associations are mutually exclusive (API returns specific errors)

---

### **READ - Custom Field Definitions**

Retrieves custom field definitions with full association details.

#### **Endpoints:**
- `GET /api/quickbook/custom-fields` - All definitions with associations

#### **Examples:**
```bash
# Get all definitions with associations
curl -X GET "http://localhost:8080/api/quickbook/custom-fields"

# Verify associations
curl -X GET "http://localhost:8080/api/quickbook/custom-fields" | jq '.[] | {name, active, associations}'
```

---

### **UPDATE - Custom Field Definitions**

Updates existing custom fields using `AppFoundations_CustomFieldDefinitionUpdateInput`.

#### **Required Fields (Auto-Retrieved)**
- `id` (ID): Custom field identifier
- `legacyIDV2` (ID): Legacy identifier (automatically retrieved)
- `label` (String): Current or new label (preserved if not provided)
- `active` (Boolean): Current or new status (preserved if not provided)
- `dataType` (String): Current or new data type (preserved if not provided)

#### **Examples:**

**Simple Name Update**
```bash
curl -X PUT "http://localhost:8080/api/quickbook/custom-fields/{id}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Field Name"}'
```

**Deactivate Field**
```bash
curl -X PUT "http://localhost:8080/api/quickbook/custom-fields/{id}" \
  -H "Content-Type: application/json" \
  -d '{"active": false}'
```

**Update Associations**
```bash
curl -X PUT "http://localhost:8080/api/quickbook/custom-fields/{id}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Field",
    "associations": [
      {
        "associatedEntity": "/network/Contact",
        "active": true,
        "required": true,
        "associationCondition": "INCLUDED",
        "subAssociations": ["CUSTOMER"]
      }
    ]
  }'
```

---

### **DELETE - Custom Field Definitions**

Deletes (deactivates) custom fields using the update schema as a soft delete.

#### **Implementation: Soft Delete**
Since the App Foundations API doesn't provide a direct delete mutation, deletion is implemented as an update operation that sets `active: false`. This is a safe, production-ready approach that preserves data integrity.

#### **Examples:**

**Delete Custom Field**
```bash
curl -X DELETE "http://localhost:8080/api/quickbook/custom-fields/{id}"
```

**Verify Deletion**
```bash
# Check field is now inactive
curl -X GET "http://localhost:8080/api/quickbook/custom-fields" | jq '.[] | select(.id == "{id}") | .active'
```

#### **Delete Behavior**
- ✅ **Soft Delete**: Sets `active: false` instead of permanent removal
- ✅ **Data Preservation**: All field data, associations, and metadata preserved
- ✅ **Audit Trail**: Maintains history of deleted fields
- ✅ **Reactivation**: Fields can be restored by updating `active: true`
- ✅ **Error Handling**: Non-existent fields return proper 404 errors
- ✅ **Association Preservation**: Complex associations remain intact

---

### **Error Handling & Validation**

#### **HTTP Status Codes**
- `200 OK` - Successful operation
- `400 Bad Request` - Invalid request data or GraphQL errors
- `401 Unauthorized` - Missing or invalid OAuth token
- `404 Not Found` - Custom field not found (delete operations)
- `500 Internal Server Error` - Server-side errors

#### **Best Practices**
- Always check OAuth token validity before operations
- Test association combinations in development before production
- Monitor for GraphQL-specific error messages for debugging
- Use soft delete for production safety

## Authentication

The application uses OAuth 2.0 with App Foundations scopes:

### Required Scopes
- `app-foundations.custom-field-definitions.read` - Read custom field definitions
- `app-foundations.custom-field-definitions` - Full custom field definition management
- `com.intuit.quickbooks.accounting` - General QuickBooks access

### Security Features
- Automatic token refresh
- Session-based state management
- Secure token storage
- CSRF protection with state parameter
- Production/sandbox environment support

## API Testing

Use the web interface or curl commands for testing all API operations:

### **Complete CRUD Testing Guide**

#### **1. Authentication Setup**
```bash
# Get OAuth authorization URL
curl -X GET "http://localhost:8080/api/auth/login"

# Open returned URL in browser to authorize with QuickBooks
# Or visit http://localhost:8080 and click "Connect to QuickBooks"
```

#### **2. CREATE Testing**
```bash
# Test default association
curl -X POST "http://localhost:8080/api/quickbook/custom-fields" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Field", "type": "STRING"}'

# Test custom associations
curl -X POST "http://localhost:8080/api/quickbook/custom-fields" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Contact Field",
    "type": "STRING",
    "associations": [{
      "associatedEntity": "/network/Contact",
      "subAssociations": ["VENDOR"]
    }]
  }'
```

#### **3. READ Testing**
```bash
# Get all definitions
curl -X GET "http://localhost:8080/api/quickbook/custom-fields"

# Get summaries with associations
curl -X GET "http://localhost:8080/api/quickbook/custom-fields" | jq '.[] | {name, active, associations}'
```

#### **4. UPDATE Testing**
```bash
# Simple name update
curl -X PUT "http://localhost:8080/api/quickbook/custom-fields/{id}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name"}'

# Deactivate field
curl -X PUT "http://localhost:8080/api/quickbook/custom-fields/{id}" \
  -H "Content-Type: application/json" \
  -d '{"active": false}'
```

#### **5. DELETE Testing**
```bash
# Soft delete (deactivate)
curl -X DELETE "http://localhost:8080/api/quickbook/custom-fields/{id}"

# Verify deletion
curl -X GET "http://localhost:8080/api/quickbook/custom-fields" | jq '.[] | select(.id == "{id}") | .active'
```

#### **6. Web Interface Testing**
1. Navigate to `http://localhost:8080`
2. Click "Connect to QuickBooks" to initiate QuickBooks connection
3. Use the web interface to:
   - View all custom fields
   - Create new custom fields with associations
   - Update existing fields
   - Delete (deactivate) fields
4. Test different data types and association combinations

## Development

### Project Structure
```
sampleapp-customfields-nodejs/
├── graphql/
│   └── customfields/
│       ├── createCustomField.js
│       ├── getAllCustomFields.js
│       └── updateCustomField.js
├── routes/
│   ├── customfields-route.js
│   └── oauth-route.js
├── services/
│   ├── auth-service.js
│   └── customfields-service.js
├── pages/
│   ├── index.html
│   └── styles.css
├── logs/
│   └── oAuthClient-log.log
├── index.js
├── package.json
└── .env
```

### Dependencies
- `express` - Web framework
- `intuit-oauth` - QuickBooks OAuth SDK
- `graphql-request` - GraphQL client for App Foundations API
- `dotenv` - Environment variable management
- `body-parser` - Request parsing middleware

### Key Features
- **App Foundations Integration**: Native support for the latest QuickBooks API
- **Smart Association Management**: Handle complex entity relationships
- **Dual ID Support**: Handle both legacy encoded and V2 numeric IDs
- **Extension Methods**: Rich helper methods for data manipulation

## Error Handling

The API includes comprehensive error handling:
- **App Foundations GraphQL**: Advanced error parsing and reporting
- **OAuth Error Handling**: User-friendly messages for authentication issues
- **Association Validation**: Errors for invalid entity associations
- **Network and Timeout**: Robust error handling for API calls

## Security

- **OAuth 2.0 with App Foundations Scopes**: Granular permission control
- **State Parameter Validation**: CSRF protection for OAuth flows
- **Secure Token Storage**: Automatic refresh with proper scope management
- **Session-based State Management**: Secure OAuth state handling
- **Environment Isolation**: Separate sandbox/production configurations

## Troubleshooting

### Common Issues

#### **1. Node.js Version Compatibility Issues**

**Error: `Cannot find module 'node:events'`**
```
Error: Cannot find module 'node:events'
Require stack:
- /path/to/node_modules/express/lib/express.js
```

**Solution:**
- This error occurs when using Node.js version 12.x or lower
- Express 5.x requires Node.js 18.0.0 or higher
- Update to Node.js 18+ from [nodejs.org](https://nodejs.org/)

**Check your Node.js version:**
```bash
node --version
```

**If you need to use an older Node.js version:**
Update `package.json` to use Express 4.x:
```json
{
  "dependencies": {
    "express": "^4.19.2"
  }
}
```
Then run:
```bash
npm install
```

#### **2. Missing Dependencies**

**Error: `Cannot find package 'graphql'`**
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'graphql' imported from 
/Users/.../node_modules/graphql-request/build/legacy/lib/graphql.js
```

**Solution:**
The `graphql-request` package requires `graphql` as a peer dependency. Install it:
```bash
npm install graphql
```

**Complete dependency installation:**
```bash
# Clean install to ensure all dependencies are properly installed
rm -rf node_modules package-lock.json
npm install
npm install graphql  # Required peer dependency for graphql-request
```

#### **3. Module Resolution Issues**

**Error: `ERR_MODULE_NOT_FOUND`**
- Ensure you're using Node.js 18+ 
- Check that all dependencies are installed
- Verify the `package.json` has `"type": "module"` for ES modules

**Solution:**
```bash
# Verify package.json has ES module support
cat package.json | grep '"type"'

# Should show: "type": "module"

# If missing, add it:
npm pkg set type=module
```

#### **4. Authentication Issues**

**"Not authenticated" Error**
- Ensure you've completed the OAuth flow
- Check that your QuickBooks app has the required scopes
- Verify your ngrok URL is correctly configured

**Solution:**
```bash
# Check authentication status
curl -X POST "http://localhost:8080/api/auth/retrieveToken"

# Verify OAuth flow
curl -X GET "http://localhost:8080/api/auth/login"
```

#### **5. GraphQL 400 Errors**
- Check that required fields are provided
- Verify association configurations are valid
- Ensure data types match the schema requirements

#### **6. ngrok URL Issues**
- Make sure ngrok is running: `ngrok http 8080`
- Update your `.env` file with the current ngrok URL
- Update your QuickBooks app settings with the new redirect URI

#### **7. Association Validation Errors**
- Check that you're not mixing entity types in one field
- Verify sub-associations are valid for the entity type
- Some sub-associations may be mutually exclusive

### Installation Troubleshooting

#### **Step-by-Step Clean Installation**

1. **Check Node.js Version**
   ```bash
   node --version  # Should be 18.0.0 or higher
   npm --version   # Should be 8.0.0 or higher
   ```

2. **Clean Install**
   ```bash
   # Remove existing installation
   rm -rf node_modules package-lock.json
   
   # Fresh install
   npm install
   
   # Install required peer dependencies
   npm install graphql
   ```

3. **Verify Installation**
   ```bash
   # Check that all dependencies are installed
   npm list --depth=0
   
   # Should show all packages without "UNMET DEPENDENCY" warnings
   ```

4. **Test Installation**
   ```bash
   # Try to start the application
   npm start
   
   # Should start without module errors
   ```

#### **Alternative: Use Express 4.x for Older Node.js**

If you must use Node.js 12-17, modify `package.json`:

```json
{
  "dependencies": {
    "express": "^4.19.2",
    "body-parser": "^1.20.2",
    "dotenv": "^16.4.5",
    "ejs": "^3.1.10",
    "graphql": "^16.8.1",
    "graphql-request": "^6.1.0",
    "intuit-oauth": "^4.2.0",
    "axios": "^1.6.0"
  }
}
```

Then run:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Debug Steps

1. **Check Authentication Status**
   ```bash
   curl -X POST "http://localhost:8080/api/auth/retrieveToken"
   ```

2. **Verify Server Logs**
   - Check the console output for detailed error messages
   - Review `logs/oAuthClient-log.log` for OAuth issues

3. **Test with Simple Requests**
   - Start with basic field creation
   - Test associations one at a time
   - Use the web interface for visual debugging

4. **Verify Environment Setup**
   ```bash
   # Check .env file exists and has correct values
   cat .env
   
   # Verify ngrok is running
   curl -s http://localhost:4040/api/tunnels
   ```

### System Requirements Summary

| Component | Minimum Version | Recommended |
|-----------|----------------|--------------|
| Node.js | 18.0.0 | 20.x LTS |
| npm | 8.0.0 | 10.x |
| Express | 5.1.0 | 5.1.0 |
| graphql-request | 7.2.0 | 7.2.0 |
| graphql (peer dep) | 16.8.0 | 16.8.0 |

## Support

For issues or questions:
1. **Check API Responses**: Use the web interface or curl to inspect detailed responses
2. **Verify App Configuration**: Ensure `.env` has correct App Foundations scopes
3. **OAuth Setup**: Confirm app has `app-foundations.custom-field-definitions` permissions
4. **Review Logs**: Check application logs for detailed error messages
5. **Test Authentication**: Use the web interface to verify OAuth flow
6. **Association Issues**: Check entity associations in the web interface
7. **ngrok Issues**: Ensure ngrok is running and URL is updated

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.