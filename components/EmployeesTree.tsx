import { Prisma } from "@prisma/client";
import React from "react";

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
  return (
    <>
      <div
        className={`p-3 h-16 rounded-md mt-3 cursor-pointer flex items-center gap-5`}
        style={{ marginLeft: depth * 50 }}
        onClick={() => setShowChildren((showChildren) => !showChildren)}
        onMouseEnter={() => setShowAddChild(true)}
        onMouseLeave={() => setShowAddChild(false)}
      >
        <div className="flex items-center">
          {employeeHash[root].employees.length > 0 && (
            <div className="text-3xl mr-2">{showChildren ? "-" : "+"}</div>
          )}
          <div>{employeeHash[root].name}</div>
        </div>
        {showAddChild && (
          <button className="border px-2 flex items-center">
            <div className="text-3xl mr-2">+</div>
            <div>Add Child</div>
          </button>
        )}
      </div>
      {showChildren &&
        employeeHash[root].employees.map((employee) => (
          <>
            {employeeHash[employee.id].employees && (
              <EmployeesTree
                employeeHash={employeeHash}
                root={employee.id}
                depth={depth + 1}
              />
            )}
          </>
        ))}
    </>
  );
}
