import { useEffect, useRef, useCallback } from "react";
import { useAppSelector } from "../redux/hooks";


export default function LoadingModal() {
    const modal = useRef<HTMLDialogElement>(null);
    const isLoading = useAppSelector((state) => state.users.isLoading)
    useEffect(() => {
        if (isLoading) {
            // modal.current?.close()
            modal.current?.showModal();
        }
        else {
            modal.current?.close();
        }
    }, [isLoading])


    useEffect(() => {
        let modalRef: HTMLDialogElement | undefined;

        if (modal.current) {
            modalRef = modal.current;
        }

        modalRef?.addEventListener('cancel', (event: any) => {
            event.preventDefault();
        });

        return () => {
            modalRef?.removeEventListener('cancel', (event: any) => {
                event.preventDefault();
            });
        };
    }, []);

    return (
        <div className="">
            <dialog id="loadind-modal"
                ref={modal}
                className="z-10 rounded-2xl w-72 h-80  backdrop:bg-gray-500 backdrop:bg-opacity-30 
            open:flex flex-col justify-center items-center hidden"
            >
                <div className="z-20 rounded-full border-t-4 border-4 border-indigo-200 border-t-indigo-500 border-indigo-200 w-14 h-14  animate-spin"></div>
                <p>Please wait...</p>
            </dialog >
        </div>
    );
}