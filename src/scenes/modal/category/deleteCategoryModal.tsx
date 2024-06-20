import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Slide } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteCategoryModal ({ open, onClose, onDelete }) {
  return (
    <React.Fragment>
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
            Are you sure to delete this Category?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="error" onClick={onDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
