import { Employee } from "@prisma/client";
import { atom } from "recoil";

export const showCreateEmployeeModalAtom = atom({
  key: "showCreateEmployeeModal",
  default: false,
});

export const currentEmployeeAtom = atom<Employee | null>({
  key: "currentEmployeeId",
  default: null,
});
