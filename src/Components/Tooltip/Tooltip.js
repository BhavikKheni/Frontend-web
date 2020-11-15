import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Fade from "@material-ui/core/Fade";

const TooltipComponent = (props) => {
  return (
    <Tooltip
      title={props.title || ""}
      placement={props.placement || "bottom"}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 600 }}
      arrow
    >
      {props.children}
    </Tooltip>
  );
};

export default TooltipComponent;
