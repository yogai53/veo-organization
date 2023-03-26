import {
  currentEmployeeAtom,
  showCreateEmployeeModalAtom,
} from "@/recoil/atom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react"; // components
import { useRecoilState, useRecoilValue } from "recoil";

export default function CreateNodeModal({ children }: any) {
  const [showCreateEmployeeModal, setShowCreateEmployeeModal] = useRecoilState(
    showCreateEmployeeModalAtom
  );
  const currentEmployee = useRecoilValue(currentEmployeeAtom);
  return (
    <div id="modal">
      <Transition appear show={showCreateEmployeeModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setShowCreateEmployeeModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-80" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-90"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-90"
              >
                <Dialog.Panel className="w-full min-h-[200px] p-6 flex flex-col justify-between max-w-xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="flex text-xl font-semibold leading-6"
                  >
                    <div className="flex-auto  border-b border-solid border-slate-300 pb-3">
                      Create new Employee under {currentEmployee?.name}
                    </div>
                  </Dialog.Title>
                  <div className="my-4 sm:text-sm text-xs break-words">
                    {children}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
