// import React from "react";
// import { makeStyles } from "@material-ui/core/styles";
// import Input from "@material-ui/core/Input";
// import InputLabel from "@material-ui/core/InputLabel";
// import Select from "@material-ui/core/Select";
// import { themes } from "../../themes";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     "& .MuiFilledInput-input": {
//       backgroundColor: "#fff",
//       border: "1px solid rgba(25, 25, 25, 0.9)",
//       borderRadius: 3,
//     },
//   },
// }));

// const SelectComponent = (props) => {
//   const classes = useStyles();
//   const ITEM_HEIGHT = 48;
//   const ITEM_PADDING_TOP = 8;
//   const MenuProps = {
//     PaperProps: {
//       style: {
//         maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//         width: 250,
//       },
//     },
//   };
//   const {
//     value,
//     onChange,
//     id,
//     children,
//     name,
//     label,
//     multiple,
//     renderValue,
//   } = props;
//   return (
//     <React.Fragment>
//       <InputLabel id="demo-label">{label}</InputLabel>
//       <Select
//         labelId={id || "label1"}
//         id={id || "label1"}
//         multiple={multiple}
//         value={value}
//         name={name}
//         onChange={onChange}
//         input={<Input />}
//         renderValue={renderValue}
//         MenuProps={MenuProps}
//         style={{height:'100%'}}
//       >
//         {children}
//       </Select>
//     </React.Fragment>
//   );
// };
// export default SelectComponent;
import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";

import clsx from "clsx";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputBase from "@material-ui/core/InputBase";

const BootstrapInput = withStyles((theme) => ({
  root: {
    // "label + &": {
    //   marginTop: theme.spacing(3),
    // },
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid rgba(25, 25, 25, 0.9)",
    fontSize: 16,
    padding: "26px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    fontFamily: [
      "rubik",
      "Roboto",
    ].join(","),
    "&:focus": {
      borderRadius: 4,
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  margin: {},
  root: {
    maxWidth: 458,
    width: "100%",
  },
}));

export default function SelectComponent(props) {
  const classes = useStyles();
  const {
    value,
    onChange,
    children,
    name,
    multiple,
    renderValue,
    MenuProps,
  } = props;
  return (
    <React.Fragment>
      <Select
        labelId="customized-select-label"
        id="customized-select"
        label="Select country"
        value={value}
        onChange={onChange}
        input={<BootstrapInput />}
        renderValue={renderValue}
        name={name}
        multiple={multiple}
      >
        {children}
      </Select>
    </React.Fragment>
  );
}
