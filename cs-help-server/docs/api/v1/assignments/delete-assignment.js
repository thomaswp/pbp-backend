module.exports = {
    delete:{
        tags:['assignment'],
        description: "Delete an assignment",
        operationId: "deleteAssignment",
        parameters:[
            {
                name:"id",
                in:"path",
                schema:{
                    $ref:"#/components/schemas/id"
                },
                required: true,
                description: "An assignment unique id"
            }
        ],
        responses:{
            '200':{
                description:"Assignment is deleted"
            },
            '500':{
                description: "Assignment failed to be deleted"
            }
        }
    }
}