export const updateCustomFielMutation = 
`
mutation UpdateCustomFieldDefinition($input: AppFoundations_CustomFieldDefinitionUpdateInput!) {
    appFoundationsUpdateCustomFieldDefinition(input: $input) {
        id
        legacyIDV2
        label
        dataType
        active
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
            }
        }
        dropDownOptions {
            id
            value
            active
            order
        }
    }
}
`;

export const updateCustomFieldVariable = (id, params) => {
    const { associations, legacyIDV2, name, active, type, dropDownOptions } = params;
    const input = {
        id: id
    };
    if(associations) {
        input.associations = associations;
    }

    if(name) {
        input.label = name;
    }

    if(active !== undefined && active !== '') {
        input.active = active;
    }

    if(type) {
        input.dataType = type;
    }

    if(dropDownOptions) {
        input.dropDownOptions = dropDownOptions;
    }

    if(legacyIDV2) {
        input.legacyIDV2 = legacyIDV2;
    }
    return { input };
};
