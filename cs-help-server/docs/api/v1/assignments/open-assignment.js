module.exports = {
  // operation's method
  post: {
    tags: ["assignment"], // operation's tag
    description: "Create project from assignment. This method allows user to create a project by providing assignment ID", // short desc
    operationId: "openAssignment", // unique operation id
    parameters: [], // expected params
    requestBody: {
      // expected request body
      content: {
        // content-type
        "application/json": {
          schema: {
            $ref: "#/components/schemas/AssignmentID", 
          },
        },
      },
    },
    // expected responses
    responses: {
      // response code
      201: {
        description: "Project created successfully from assignment", // response desc
      },
      401: {
        description: "Unauthenticated", // response desc
      },
      404: {
        description: "Could not find project or assignment"
      },
      // response code
      500: {
        description: "Server error", // response desc
      },
    },
  },
};
