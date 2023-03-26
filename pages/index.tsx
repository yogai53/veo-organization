import { CreateNodeModal } from "@/components";
import EmployeesTree from "@/components/EmployeesTree";
import { Employee, PrismaClient } from "@prisma/client";
import type { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import React from "react";

interface IProps {
  employees: Employee[];
}

const buildEmployeeHash = (employees: Employee[]) => {
  let employeeHash: { [key: number]: Employee } = {};
  for (const employee of employees) {
    employeeHash[employee.id] = employee;
  }

  return employeeHash;
};

export default function Home({ employees }: IProps) {
  React.useState<Employee["id"]>();

  const employeeHash = React.useMemo(
    () => buildEmployeeHash(employees),
    [employees]
  );

  const roots = React.useMemo(
    () => employees.filter((employee) => employee.parentId == null),
    [employees]
  );

  return (
    <div className="p-5">
      {roots.map((root) => (
        <div
          key={root.id}
          className="p-5 border-solid border-2 border-slate-500 my-5"
        >
          <EmployeesTree root={root.id} employeeHash={employeeHash} />
        </div>
      ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const prisma = new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
    ],
  });
  prisma.$on("query", async (e) => {
    console.log(`${e.query} ${e.params}`);
  });
  const employees = await prisma.employee.findMany({
    include: { employees: { select: { id: true } } },
  });
  return { props: { employees: JSON.parse(JSON.stringify(employees)) } };
};
