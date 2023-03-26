import {
  currentEmployeeAtom,
  showCreateEmployeeModalAtom,
} from "@/recoil/atom";
import { Prisma } from "@prisma/client";
import React from "react";
import { useSetRecoilState } from "recoil";

interface IProps {
  employeeHash: {
    [key: number]: Prisma.EmployeeGetPayload<{
      include: { employees: { select: { id: true } } };
    }>;
  };
  root: number;
  depth: number;
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
        className={`p-1 h-15 rounded-md cursor-pointer flex items-center gap-5`}
        style={{ marginLeft: depth * 40 }}
        onMouseEnter={() => setShowAddChild(true)}
        onMouseLeave={() => setShowAddChild(false)}
      >
        <div
          className="flex items-center"
          onClick={() => setShowChildren((showChildren) => !showChildren)}
        >
          {employee.employees.length > 0 ? (
            <div className="text-xl mr-2">{showChildren ? "-" : "+"}</div>
          ) : (
            <div className="ml-5"></div>
          )}
          <div>
            <div>{employee.name}</div>
            <div className="flex">
              <small className="text-slate-500">
                <>{employee.role} | </>
                <>{employee.role == "MANAGER" ? department : domain}</>
              </small>
              {showAddChild && (
                <button
                  className="px-2 flex items-center rounded-md hover:bg-slate-300 ml-5 text-sm border"
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
