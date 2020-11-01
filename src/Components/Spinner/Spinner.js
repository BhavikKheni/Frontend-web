import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

const Spinner = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root,'spinner_loading'}>
      <CircularProgress size={props.size} />
    </div>
  );
};

export default Spinner;