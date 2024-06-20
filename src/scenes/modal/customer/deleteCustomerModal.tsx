import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Slide } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteCustomerModal({ open, handleClose, handleDelete }) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to delete this Customer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color='error' onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
