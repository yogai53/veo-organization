import {
  currentEmployeeAtom,
  showCreateEmployeeModalAtom,
} from "@/recoil/atom";
import { IEmployeeDetails } from "@/types/employee";
import { Prisma } from "@prisma/client";
import React from "react";
import { useSetRecoilState } from "recoil";

interface IProps {
  employeeHash: {
    [key: number]: IEmployeeDetails;
  };
  root: number;
  depth?: number;
}

export default function EmployeesTree({
  employeeHash,
  root,
  depth = 0,
}: IProps) {
  const [showChildren, setShowChildren] = React.useState(true);
  const [showAddChild, setShowAddChild] = React.useState(false);
  const setShowCreateEmployeeModal = useSetRecoilState(
    showCreateEmployeeModalAtom
  );
  const setcurrentEmployeeAtom = useSetRecoilState(currentEmployeeAtom);

  const employee = employeeHash[root];
  const { department, domain } = employee.extra as Prisma.JsonObject;
  return (
    <>
      <div
        className={`h-15 cursor-pointer flex items-center gap-5 `}
        // style={{ marginLeft: depth * 40 }}
        onMouseEnter={() => setShowAddChild(true)}
        onMouseLeave={() => setShowAddChild(false)}
        onClick={() => setShowChildren((showChildren) => !showChildren)}
      >
        <div className="flex">
          <div
            className="border-l border-solid border-slate-500"
            style={{ marginLeft: 40 }}
          ></div>
          {Array.from({ length: depth })
            .fill(1)
            .map((d, i) => (
              <div
                className={
                  i < depth - 1 ? `border-l border-solid border-slate-500` : ""
                }
                style={{ marginLeft: 60 }}
                key={i}
              ></div>
            ))}
          <div>
            <div className="flex items-center">
              <div>{employee.name}</div>
              {showAddChild && (
                <button
                  className="flex items-center rounded-md hover:bg-slate-300 ml-5 text-sm border"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    setShowCreateEmployeeModal(true);
                    setcurrentEmployeeAtom(employee);
                  }}
                >
                  Add Child
                </button>
              )}
            </div>
            <div className="flex h-7 items-center">
              <small className="text-slate-500">
                <>{employee.role} | </>
                <>{employee.role == "MANAGER" ? department : domain}</>
              </small>
            </div>
          </div>
        </div>
      </div>
      {showChildren &&
        employee.employees.map((employee) => (
          <React.Fragment key={employee.id}>
            {employeeHash[employee.id].employees && (
              <EmployeesTree
                employeeHash={employeeHash}
                root={employee.id}
                depth={depth + 1}
              />
            )}
          </React.Fragment>
        ))}
    </>
  );
}
