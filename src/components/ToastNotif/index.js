import { toast } from 'react-toastify'

export const warningToast = (message, id) => {
    toast.warn(`${message}`, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      toastId:`${id}`
    })
  }

export const successToast = (message, id) => {
    toast.success(`${message}`, {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      toastId:`${id}`
      });
  }

export const errorToast = (message, id) => {
    toast.error(`${message}`, {
      position: "top-center",
      autoClose: 7000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
      toastId:`${id}`
      });
  }

  export const infoToast = (message, id) => {
    toast.info(`${message}`, {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      toastId:`${id}`
      });
  }

  export const defaultToast = (message, id) => {
    toast(`${message}`, {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      toastId:`${id}`
      });
  }
