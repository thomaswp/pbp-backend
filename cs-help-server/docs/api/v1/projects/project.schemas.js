module.exports = {
  Project: {
    type: "object",
    required: ["id", "name", "email", "projects"],
    properties: {
      id: {
        $ref: "#/components/schemas/id",
      },
      name: {
        type: "string",
        description: "Project name.",
        example: "Project_1",
      },
      data: {
        type: "object",
        description: "Rete data",
        example: "Rete Data (JSON)",
      },
      owner: {
        type: "string",
        description: "Owner ID",
        example: "Qjs7_jsdgkjo",
      },
      isAssignment: {
        type: "boolean",
        description: "Is the project an assignment",
        example: "false",
      },
      isArchived: {
        type: "boolean",
        description: "Is the project archived",
        example: "false",
      },
    },
  },
};
