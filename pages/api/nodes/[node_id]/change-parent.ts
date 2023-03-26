import { Employee, Prisma, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

interface ISuccess {
  updatedEmployee: Employee;
}

interface IError {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ISuccess | IError>
) {
  const {
    body,
    method,
    query: { node_id },
  } = req;

  switch (method) {
    case "PUT":
      const { parentId } = body;
      if (!parentId) return res.status(400).json({ error: "Parent required" });
      if (!node_id)
        return res.status(400).json({ error: "Employee ID required" });

      const employeeId = Array.isArray(node_id) ? +node_id[0] : +node_id;
      const prisma = new PrismaClient();

      const parentEmployee = await prisma.employee.findFirst({
        where: {
          id: parentId,
        },
      });

      if (!parentEmployee) {
        return res.status(400).json({ error: "Parent Employee not found" });
      }

      try {
        // Updating Parent
        const updatedEmployee = await prisma.employee.update({
          where: {
            id: employeeId,
          },
          data: {
            parentId: parentId,
          },
        });
        return res.status(200).json({ updatedEmployee });
      } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code == "P2025") {
            return res
              .status(400)
              .json({ error: "Employee record to be updated, not found" });
          }
        }
        return res.status(400).json({ error: "Something went wrong" });
      }

    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
