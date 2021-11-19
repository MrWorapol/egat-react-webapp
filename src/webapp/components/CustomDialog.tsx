import { Dialog } from "@mui/material";
import { useDialog } from "../hooks/useDialog";

export default function CustomDialog() {
    const { dialogContent, closeDialog } = useDialog();

    function onClose() {
        if (dialogContent?.onClose) {
            if (dialogContent.onClose()) {
                closeDialog();
            }
        } else {
            closeDialog();
        }
    }
    console.log(`get width dialog : ${dialogContent?.width}, fullWidth: ${dialogContent?.fullWidth}`);
    return (
        <Dialog open={dialogContent !== null} onClose={onClose} maxWidth={dialogContent?.width} fullWidth={dialogContent?.fullWidth ?? false}>
            {dialogContent?.content}
        </Dialog>
    )

}
