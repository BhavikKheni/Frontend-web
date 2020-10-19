import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MuiSelect from "@material-ui/core/Select";
import { InputLabel } from "@material-ui/core";
const Select = withStyles((theme) => ({
  root: {
    border: "1px solid rgba(25, 25, 25, 0.9)",
    borderRadius: "10px",
    backgroundColor: "transparent",
  },
}))(MuiSelect);
export default function SelectComponent(props) {
  const {
    value,
    onChange,
    children,
    name,
    native,
    multiple,
    renderValue,
    MenuProps,
    label,
  } = props;

  return (
    <div>
      <Select
        native={native}
        multiple={multiple}
        value={value}
        name={name}
        onChange={onChange}
        inputProps={{
          name: name,
          id: name,
        }}
        renderValue={renderValue}
        MenuProps={MenuProps}
        IconComponent={(props) => (
          <ExpandMoreIcon className={`material-icons ${props.className}`} />
        )}
      >
        {children}
      </Select>
    </div>
  );
}
