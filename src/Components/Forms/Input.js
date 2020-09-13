import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import {
    fade,
    ThemeProvider,
    withStyles,
    makeStyles,
    createMuiTheme,
  } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing(1, "auto"),
    },
    marginBottom: {
        marginBottom: '20px'
    }
}));

const ValidationTextField = withStyles({
    root: {
        '& input:valid + fieldset': {
            borderColor: 'green',
            borderWidth: 2,
        },
        '& input:invalid + fieldset': {
            borderColor: 'red',
            borderWidth: 2,
        },
        '& input:valid:focus + fieldset': {
            borderLeftWidth: 6,
            padding: '4px !important', // override inline-style
        },
    },
})(TextField);

const InputTextComponent = (props) => {

    const classes = useStyles();

    return (
        <React.Fragment>
            <Box mt={1} mb={1}>
                <ValidationTextField
                    id={props.id}
                    className={classes.marginBottom}
                    m={2}
                    name={props.name}
                    label={props.label}
                    defaultValue={props.defaultValue}
                    placeholder={props.placeholder}
                    type={props.type}
                    required={props.required}
                    onChange={props.onChange}
                    autoFocus={props.autoFocus}
                    size="small"
                    margin="normal"
                    variant="outlined"
                />
            </Box>
        </React.Fragment>
    );
};

export default InputTextComponent;