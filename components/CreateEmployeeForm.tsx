import { nodeCreateSchema } from "@/pages/api/nodes";
import {
  currentEmployeeAtom,
  showCreateEmployeeModalAtom,
} from "@/recoil/atom";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import * as yup from "yup";
interface IProps {
  handleSubmitPayload: (
    payload: yup.InferType<typeof nodeCreateSchema>
  ) => void;
}

export default function CreateEmployeeForm({ handleSubmitPayload }: IProps) {
  const router = useRouter();
  const [form, setForm] = React.useState<
    yup.InferType<typeof nodeCreateSchema>
  >({
    name: "",
    role: "",
    extra: {
      department: "",
      domain: "",
    },
  });
  const [error, setError] = React.useState<yup.ValidationError | null>(null);
  const currentEmployee = useRecoilValue(currentEmployeeAtom);
  const setShowCreateEmployeeModal = useSetRecoilState(
    showCreateEmployeeModalAtom
  );
  const handleSubmit = async () => {
    if (!currentEmployee) return;
    try {
      const createEmployeeValidation = await nodeCreateSchema.validate(form);
      setError(null);

      axios
        .post("/api/nodes", {
          ...createEmployeeValidation,
          parentId: currentEmployee.id,
        })
        .then((r) => {
          setShowCreateEmployeeModal(false);
          router.push(router.asPath);
        })
        .catch((e) => alert("Something went wrong"));
    } catch (error: any) {
      if (error instanceof yup.ValidationError) {
        setError(error);
      } else {
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="w-full">
      <form className="bg-whiterounded">
        <div className="mb-10">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Employee Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Employee Name"
              onChange={(e: any) => setForm({ ...form, name: e.target.value })}
            />
            {error?.path == "name" && (
              <p className="text-red-500 text-xs italic">{error?.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="role"
            >
              Role
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="role"
                onChange={(e: any) =>
                  setForm({
                    ...form,
                    role: e.target.value,
                    extra: {
                      domain: e.target.value == "DEVELOPER" ? "" : null,
                      department: e.target.value == "MANAGER" ? "" : null,
                    },
                  })
                }
              >
                <option value="">Select</option>
                <option value="MANAGER">MANAGER</option>
                <option value="DEVELOPER">DEVERLOPER</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
              {error?.path == "role" && (
                <p className="text-red-500 text-xs italic">{error?.message}</p>
              )}
            </div>
          </div>

          {form.role == "MANAGER" && (
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="department"
              >
                Department
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="department"
                type="text"
                placeholder="Department"
                onChange={(e: any) =>
                  setForm({
                    ...form,
                    extra: { ...form.extra, department: e.target.value },
                  })
                }
              />
              {error?.path == "extra.department" && (
                <p className="text-red-500 text-xs italic">{error?.message}</p>
              )}
            </div>
          )}

          {form.role == "DEVELOPER" && (
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="domain"
              >
                Domain
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="domain"
                placeholder="Domain"
                onChange={(e: any) =>
                  setForm({
                    ...form,
                    extra: { ...form.extra, domain: e.target.value },
                  })
                }
              />
              {error?.path == "extra.developer" && (
                <p className="text-red-500 text-xs italic">{error?.message}</p>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-row-reverse items-center gap-3">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleSubmit}
          >
            Create
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => setShowCreateEmployeeModal(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
