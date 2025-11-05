import { toast, ToastPosition } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface Props {
    type?: 'error' | 'success' | 'info' | 'warning';
    position?: ToastPosition;
    text: string;
    duration?: number;
}

const ToastComponent = ({
                            text,
                            position = "top-center",
                            duration = 5000,
                            type = 'success'
                        }: Props) => {

    const commonOptions = {
        position,
        autoClose: duration,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    };

    switch (type) {
        case 'error':
            toast.error(text, commonOptions);
            break;
        case 'info':
            toast.info(text, commonOptions);
            break;
        case 'warning':
            toast.warning(text, commonOptions);
            break;
        default:
            toast.success(text, commonOptions);
            break;
    }
};

export default ToastComponent;
