module.exports = {
    get:{
        tags:['user'],
        description: "Get a User",
        operationId: "getLoggedUser",
        responses:{
            '200':{
                description:"User is retrieved"
            },
            '500':{
                description: "User is not found"
            }
        }
    }
}