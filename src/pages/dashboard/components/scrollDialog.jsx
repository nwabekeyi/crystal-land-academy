import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { tokens } from '../theme';
import { useTheme } from "@mui/material";

const ScrollDialog = ({
  confirm,
  buttonLabel,
  dialogTitle,
  dialogContent,
  scrollType = 'paper',
  actionText1 = 'Cancel',
  actionText2 = 'Confirm',
  open = false,
  onClose,
  onConfirm,
  maxWidth = 'sm' // Default maxWidth, can be changed when needed
}) => {
  const [scroll, setScroll] = React.useState(scrollType);
  const descriptionElementRef = React.useRef(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // Focus on description element when dialog is opened
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <React.Fragment>
      <Button onClick={() => onClose()}>{buttonLabel}</Button>
      <Dialog
        open={open}
        onClose={onClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth={maxWidth} // Set the maxWidth here
        fullWidth={true} // Make dialog take full width of the maxWidth
      >
        <DialogTitle id="scroll-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: colors.redAccent[500], border: `solis 2px ${colors.redAccent[500]}` }} onClick={onClose}>{actionText1}</Button>
          {confirm && <Button sx={{ color: colors.greenAccent[500], border: `solis 2px ${colors.greenAccent[500]}` }} onClick={onConfirm} >{actionText2}</Button>}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ScrollDialog;
