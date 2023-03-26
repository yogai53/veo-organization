import { Employee, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

export const nodeCreateSchema = yup.object({
  name: yup.string().required("Name is required"),
  role: yup
    .mixed()
    .oneOf(["MANAGER", "DEVELOPER"])
    .required("Role is required"),
  extra: yup
    .object()
    .when("role", {
      is: "MANAGER",
      then: (schema) =>
        schema.shape({
          department: yup.string().required("Department needed for manager"),
        }),
    })
    .when("role", {
      is: "DEVELOPER",
      then: (schema) =>
        schema.shape({
          domain: yup.string().required("Domain needed for developer"),
        }),
    }),
  parentId: yup.number(),
});

type INode = yup.InferType<typeof nodeCreateSchema>;

interface ISuccess {
  newEmployee: Employee;
}

interface IError {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ISuccess | IError>
) {
  const { body, method } = req;

  switch (method) {
    case "POST":
      // Validation
      try {
        await nodeCreateSchema.validate(body);
      } catch (error: any) {
        if (error instanceof yup.ValidationError) {
          return res.status(400).json({
            error: error?.message ?? "Something went wrong",
          });
        } else {
          return res.status(500).json({
            error: "Something went wrong",
          });
        }
      }

      const prisma = new PrismaClient();
      const { parentId, name, extra, role } = body;
      // Insertion at root if parent is empty
      if (!parentId) {
        const newEmployee = await prisma.employee.create({
          data: { name, extra, role },
        });

        return res.status(200).json({ newEmployee });
      }

      // Insertion as a child to a parent
      if (parentId) {
        const parentEmployee = await prisma.employee.findFirst({
          where: {
            id: parentId,
          },
        });
        if (!parentEmployee) {
          return res.status(400).json({ error: "Parent Employee not found" });
        }
        const newEmployee = await prisma.employee.create({
          data: { name, extra, role, parentId },
        });
        return res.status(200).json({ newEmployee });
      }
      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
