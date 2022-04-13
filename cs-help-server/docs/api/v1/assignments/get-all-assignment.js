module.exports = {
    get:{
        tags:['assignment'],
        description: "Get all Assignments",
        operationId: "getAllAssignments",
        responses:{
            '200':{
                description:"Assignments are retrieved"
            },
            '500':{
                description: "Assignments not found"
            }
        }
    }
}