export const createCustomFieldMutation = 
`
mutation CreateCustomFieldDefinition($input: AppFoundations_CustomFieldDefinitionCreateInput!) {
    appFoundationsCreateCustomFieldDefinition(input: $input) {
        id
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

export const createCustomFieldVariable = (params) => {
    const { associations, name, type, dropDownOptions } = params;
    
    // Default associations if none provided
    const defaultAssociations = associations || [
        {
            associatedEntity: "/transactions/Transaction",
            active: true,
            validationOptions: {
                required: false
            },
            allowedOperations: [],
            associationCondition: "INCLUDED",
            subAssociations: [
                {
                    associatedEntity: "SALE_INVOICE",
                    active: true,
                    allowedOperations: []
                }
            ]
        }
    ];
    
    return {
        input: {
            associations: defaultAssociations,
            label: name,
            dataType: type,
            active: true,
            dropDownOptions: dropDownOptions || []
        }
    };
};

            // object[] associations;
            
            // if (request.Associations?.Any() == true)
            // {
            //     associations = request.Associations.Select(assoc => new 
            //     {
            //         associatedEntity = assoc.AssociatedEntity,
            //         active = assoc.Active,
            //         validationOptions = new { required = assoc.Required },
            //         allowedOperations = new string[0],
            //         associationCondition = assoc.AssociationCondition,
            //         subAssociations = assoc.SubAssociations?.Select(sub => new 
            //         {
            //             associatedEntity = sub,
            //             active = true,
            //             allowedOperations = new string[0]
            //         }).ToArray() ?? new object[0]
            //     }).ToArray();
            // }
            // else 
            // {
            //     associations = new[] 
            //     {
            //         new 
            //         {
            //             associatedEntity = "/transactions/Transaction",
            //             active = true,
            //             validationOptions = new { required = request.Required ?? false },
            //             allowedOperations = new string[0],
            //             associationCondition = "INCLUDED",
            //             subAssociations = new[] 
            //             {
            //                 new { 
            //                     associatedEntity = "SALE_INVOICE", 
            //                     active = true,
            //                     allowedOperations = new string[0]
            //                 }
            //             }
            //         }
            //     };
            // }

            // var variables = new 
            // { 
            //     input = new
            //     {
            //         label = request.Name,
            //         dataType = request.Type,
            //         active = true,
            //         associations = associations,
            //         dropDownOptions = new object[0]
            //     }
            // };