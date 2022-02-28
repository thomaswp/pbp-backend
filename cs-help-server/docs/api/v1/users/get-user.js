module.exports = {
    get:{
        tags:['user'],
        description: "Get a User",
        operationId: "getUser",
        parameters:[
            {
                name:"id",
                in:"path",
                schema:{
                    $ref:"#/components/schemas/id"
                },
                required: true,
                description: "A user's unique id"
            }
        ],
        responses:{
            '200':{
                description:"User is retrieved",
                content:{
                    'application/json':{
                        schema:{
                            $ref:"#/components/schemas/User"
                        }
                    }
                }
            },
            '404':{
                description: "User is not found",
                content:{
                    'application/json':{
                        schema:{
                            $ref:'#/components/schemas/Error',
                            example:{
                                status: 404,
                                message:"User with id <todo> doesn't exist."
                            }
                        }
                    }
                }
            }
        }
    }
}