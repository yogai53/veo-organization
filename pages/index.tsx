import { CreateNodeModal, EmployeesTree } from "@/components";
import CreateEmployeeForm from "@/components/CreateEmployeeForm";
import { IEmployeeDetails } from "@/types/employee";
import { PrismaClient } from "@prisma/client";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { RecoilRoot } from "recoil";

interface IProps {
  employees: IEmployeeDetails[];
}

const buildEmployeeHash = (employees: IEmployeeDetails[]) => {
  let employeeHash: {
    [key: number]: IEmployeeDetails;
  } = {};
  for (const employee of employees) {
    employeeHash[employee.id] = employee;
  }

  return employeeHash;
};

export default function Home({ employees }: IProps) {
  const router = useRouter();

  const employeeHash = React.useMemo(
    () => buildEmployeeHash(employees),
    [employees]
  );

  const roots = React.useMemo(
    () => employees.filter((employee) => employee.parentId == null),
    [employees]
  );

  const onSubmit = () => {
    router.push(router.asPath);
  };

  return (
    <>
      <Head>
        <title>Veo Organization</title>
      </Head>
      <RecoilRoot>
        <div className="p-5">
          {roots.map((root) => (
            <div
              key={root.id}
              className="p-5 border-solid border border-slate-500 my-5"
            >
              <EmployeesTree root={root.id} employeeHash={employeeHash} />
            </div>
          ))}
          <CreateNodeModal>
            <CreateEmployeeForm handleSubmitPayload={onSubmit} />
          </CreateNodeModal>
        </div>
      </RecoilRoot>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const prisma = new PrismaClient({
    // log: [
    //   {
    //     emit: "event",
    //     level: "query",
    //   },
    // ],
  });
  // prisma.$on("query", async (e) => {
  //   console.log(`${e.query} ${e.params}`);
  // });
  const employees = await prisma.employee.findMany({
    include: { employees: { select: { id: true } } },
  });
  return { props: { employees: JSON.parse(JSON.stringify(employees)) } };
};
