module.exports = {
    Assignment: {
        type: 'object',
        required: ["name", "data"],
        properties: {
            name: {
                type: 'string',
                description: "Assignment name.",
                example: 'Assignment_1'
            },
            data: {
                type: 'string',
                description: "Rete data",
                example: '{"id":"demo@0.1.0","nodes":{"57":{"id":57,"data":{"input_numerator":0,"input_denominator":0,"workerResults":{"value":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"numerator":{"connections":[{"node":134,"output":"value","data":{}}]},"denominator":{"connections":[]}},"outputs":{"value":{"connections":[]}},"position":[-218.9227463515642,-90.00275518364055],"name":"Divide"},"134":{"id":134,"data":{"input_numerator":0,"input_denominator":0,"workerResults":{"value":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"numerator":{"connections":[{"node":135,"output":"output","data":{}}]},"denominator":{"connections":[]}},"outputs":{"value":{"connections":[{"node":57,"input":"numerator","data":{}}]}},"position":[-504.85909535020494,-22.201741635794306],"name":"Divide"},"135":{"id":135,"data":{"workerResults":{"output":null}},"inputs":{"input":{"connections":[]}},"outputs":{"output":{"connections":[{"node":134,"input":"numerator","data":{}}]}},"position":[-817.4999393880009,0.5943779382173631],"name":"Store Variable"}}}'
            }
        }
    },
    ProjectID: {
        type: 'object',
        required: ["projectID"],
        properties: {
            projectID: {
                type: 'string',
                description: "Project ID where the assignment is based on.",
                example: 'Hujudhtgskp_45'
            }
        }
    },
    AssignmentID: {
        type: 'object',
        required: ["assignmentID"],
        properties: {
            assignmentID: {
                type: 'string',
                description: "Assignment ID",
                example: 'Aujudhtgskp_98'
            }
        }
    }
}
