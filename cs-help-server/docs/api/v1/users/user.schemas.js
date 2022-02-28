module.exports = {
    User: {
        type: 'object',
        required: ["id", "name", "email", "projects"],
        properties: {
            id: {
                $ref: '#/components/schemas/id'
            },
            name: {
                type: 'string',
                description: "User's display name.",
                example: 'John Doe'
            },
            email: {
                type: 'string',
                description: "User's email address.",
                format: 'email',
                example: 'jdoe@gmail.com'
            },
            projects: {
                type: 'array',
                description: "List of objects describing a project's id and name.",
                items: {
                    type: 'object',
                    properties: {
                        id: {
                            $ref: '#/components/schemas/id'
                        },
                        name: {
                            type: 'string',
                            description: "A project's display name.",
                            example: "Verify Delimiters"
                        }
                    }
                }
            }
        }
    }
}
