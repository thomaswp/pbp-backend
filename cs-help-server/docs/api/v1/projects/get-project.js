module.exports = {
  get: {
    tags: ["project"],
    description: "Get a project by ID",
    operationId: "getProject",
    parameters: [
      {
        name: "id",
        in: "path",
        schema: {
          $ref: "#/components/schemas/id",
        },
        required: true,
        description: "A project's unique id",
      },
    ],
    responses: {
      200: {
        description: "Project is retrieved",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Project",
            },
          },
        },
      },
      404: {
        description: "Project is not found",
      },
    },
  },
};
