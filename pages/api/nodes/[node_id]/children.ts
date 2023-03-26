import { Employee, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

interface ISuccess {
  employeeWithChildren: Employee;
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
    case "GET":
      if (!node_id)
        return res.status(400).json({ error: "Employee ID required" });
      const employeeId = Array.isArray(node_id) ? +node_id[0] : +node_id;

      const prisma = new PrismaClient();
      const employeeWithChildren = await prisma.employee.findFirst({
        where: {
          id: employeeId,
        },
        include: {
          employees: true,
        },
      });
      if (!employeeWithChildren) {
        return res.status(400).json({ error: "Employee not found" });
      }
      return res.status(200).json({ employeeWithChildren });
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
