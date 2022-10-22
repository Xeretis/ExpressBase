import { GeneralError } from "shared";
import { IconX } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";

export const handleFormErrors = (error: any, handler: (errors: GeneralError[]) => void) => {
    switch (error.status) {
        case 400:
            handler(error.data.errors as GeneralError[]);
            break;
        case 429:
            showNotification({
                title: "Error (429)",
                color: "red",
                icon: <IconX />,
                message: "Too many requests. Please try again later.",
            });
            break;
        case 500:
            showNotification({
                title: "Error (500)",
                color: "red",
                icon: <IconX />,
                message: "Error with the server. Please try again later.",
            });
            break;
        default:
            showNotification({
                title: "Error",
                color: "red",
                icon: <IconX />,
                message: "An unknown error occurred.",
            });
            break;
    }
};
