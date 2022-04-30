module.exports = {
    // operation's method
    post: {
      tags: ["project"], // operation's tag
      description: "Reset project with the latest assignment", // short desc
      operationId: "resetProject", // unique operation id
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
          description: "Project Reset successfully", // response desc
        },
        // response code
        404: {
          description: "Assignment not found"
        },
        500: {
          description: "Server error", // response desc
        },
        401: {
          description: "Unauthenticated", // response desc
        },
      },
    },
  };
  