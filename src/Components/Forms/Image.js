import React from "react";
import CatImage from "../../images/default-image.jpeg";
const ImageComponent = () => {
  return (
    <div>
      <img
        src={CatImage}
        alt="cat"
      />
    </div>
  );
};

export default ImageComponent;
