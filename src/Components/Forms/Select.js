import React from "react";
import { withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MuiSelect from "@material-ui/core/Select";
import InputBase from "@material-ui/core/InputBase";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
const BootstrapInput = withStyles((theme) => ({
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid rgba(25, 25, 25, 0.9)",
    fontSize: 16,
    padding: "27px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    fontFamily: ["rubik", "Roboto"].join(","),
    "&:focus": {
      borderRadius: 4,
    },
  },
}))(InputBase);

const Select = withStyles((theme) => ({
  root: {
    borderRadius: 10,
  },
}))(MuiSelect);
export default function SelectComponent(props) {
  const {
    value,
    onChange,
    children,
    name,
    multiple,
    renderValue,
    MenuProps,
    label,
  } = props;

  return (
    <React.Fragment>
      <InputLabel style={{ marginTop: 10 }}>{label}</InputLabel>
      <Select
        labelId={name}
        id={name}
        multiple={multiple}
        value={value}
        name={name}
        label={label}
        onChange={onChange}
        input={<BootstrapInput />}
        renderValue={renderValue}
        MenuProps={MenuProps}
        style={{ height: "100%" }}
        IconComponent={(props) => (
          <ExpandMoreIcon className={`material-icons ${props.className}`} />
        )}
        autoWidth={true}
      >
        {children}
      </Select>
    </React.Fragment>
  );
}
