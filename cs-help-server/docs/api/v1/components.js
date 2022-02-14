// import schemas from each part of the API docs
const userSchemas = require('./users/user.schemas.js')

module.exports = {
    components:{
        schemas:{

            // Unique identifier across system
            id: {
                type: 'string',
                description: "An ID of a User, Project, or other entity in the system.",
                example: "<todo>"
            },

            // Error response code
            Error: {
                type: 'object',
                required: ['status', 'message'],
                properties: {
                    status: {
                        type: 'integer',
                        description: "HTTP Response Status returned along with this response.",
                        example: 404
                    },
                    message: {
                        type: 'string',
                        description: "Quick summary of the error that was encountered.",
                        example: "User not found, could not satisfy GET."
                    },
                    details: {
                        description: "Any and all details that the server deems useful in analyzing this error.",
                        // type omitted, can be any
                        example: [
                            "Error accessing MongoDB, msg was: 'Database unavailable at specified port.'",
                            { endpoint: "/api/v1/users/:id", method: "GET", id: "<todo>" }
                        ]
                    }
                }
            },
            ...userSchemas
        }
    }
}