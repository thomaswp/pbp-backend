module.exports = {
  // operation's method
  post: {
    tags: ["assignment"], // operation's tag
    description: "Create assignment. This method allows admin to create an assignment by providing assignment name and rete data", // short desc
    operationId: "createAssignment", // unique operation id
    parameters: [], // expected params
    requestBody: {
      // expected request body
      content: {
        // content-type
        "application/json": {
          schema: {
            $ref: "#/components/schemas/ProjectID", 
          },
        },
      },
    },
    // expected responses
    responses: {
      // response code
      201: {
        description: "Assignment created successfully", // response desc
      },
      // response code
      500: {
        description: "Server error", // response desc
      },
      401: {
        description: "Unauthenticated", // response desc
      },
    },
  },
};
