import { nodeCreateSchema } from "@/pages/api/nodes";
import { Prisma } from "@prisma/client";
import * as yup from "yup";

export type IEmployeeDetails = Prisma.EmployeeGetPayload<{
  include: { employees: { select: { id: true } } };
}>;

export type IEmployeeForm = yup.InferType<typeof nodeCreateSchema>;
