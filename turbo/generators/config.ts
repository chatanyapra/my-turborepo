import { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("react-component", {
    description:
      "creates a new file at the root of the project",
    prompts: [
      {
        type: "input",
        name: "file",
        message: "What is the name of the new file to create?",
        validate: (input: string) => {
          if (input.includes(".")) {
            return "file name cannot include an extension";
          }
          if (input.includes(" ")) {
            return "file name cannot include spaces";
          }
          if (!input) {
            return "file name is required";
          }
          return true;
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "packages/ui/src/components/{{ dashCase file }}.tsx",
        templateFile: "templates/turborepo-generators.hbs",
      },
    ],
  });
}
