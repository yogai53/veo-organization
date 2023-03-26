import { Employee, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

interface ISuccess {
  employee: Employee;
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
    case "DELETE":
      if (!node_id)
        return res.status(400).json({ error: "Employee ID required" });
      const employeeId = Array.isArray(node_id) ? +node_id[0] : +node_id;

      const prisma = new PrismaClient();
      const employee = await prisma.employee.delete({
        where: {
          id: employeeId,
        },
      });

      return res.status(200).json({ employee });
    default:
      res.setHeader("Allow", ["DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
