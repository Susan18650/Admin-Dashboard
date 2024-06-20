import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Slide } from '@mui/material';
import React from 'react';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteUserModal ({ open, onClose, onDelete }) {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure to delete this User?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" autoFocus onClick={onDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
