export const getCustomFieldsQuery = `
query GetCustomFieldDefinitions {
    appFoundationsCustomFieldDefinitions {
        edges {
            node {
                id
                legacyIDV2
                label
                associations {
                    associatedEntity
                    active
                    validationOptions {
                        required
                    }
                    allowedOperations
                    associationCondition
                    subAssociations {
                        associatedEntity
                        active
                        allowedOperations
                        validationOptions {
                            required
                        }
                    }
                }
                dataType
                dropDownOptions {
                    id
                    value
                    active
                    order
                }
                active
                customFieldDefinitionMetaModel {
                    suggested
                }
            }
        }
    }
}
`;