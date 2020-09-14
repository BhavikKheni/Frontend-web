import React from "react";
import Rating from "@material-ui/lab/Rating";
import clsx from 'clsx';
export default function RatingComponent(props) {
  const {
    defaultValue,
    precision,
    name,
    readOnly,
    emptyIcon,
    disabled,
    icon,
    max,
    onChange,
    onChangeActive,
    value,
    size,
    className
  } = props;
  return (
    <div>
      <Rating
        name={name}
        defaultValue={defaultValue}
        precision={precision}
        readOnly={readOnly}
        emptyIcon={emptyIcon}
        icon={icon}
        disabled={disabled}
        max={max}
        onChange={onChange}
        onChangeActive={onChangeActive}
        value={value}
        size={size}
        className={clsx(className)}
      />
    </div>
  );
}
