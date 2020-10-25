import React from "react";
import CatImage from "../../images/default-image.jpeg";
const ImageComponent = () => {
  return (
    <div>
      <img
        src={CatImage}
        alt="cat"
        style={{
          width: "200px",
          height: "200px",
          borderRadius: "100%",
        }}
      />
    </div>
  );
};

export default ImageComponent;
