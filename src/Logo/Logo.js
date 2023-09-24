import { Img, useVideoConfig } from "remotion";

function Logo(props) {
  const logoData = props.logoData;
  const logoStyle = logoData.logoStyle;
  const { width, height } = props.metaData
  return (
    <>
      {logoStyle.url !== "" && (
        <Img
          src={logoStyle.url}
          style={{
            left: `${(width * logoStyle.positionX) / 100}px`,
            top: `${(height * logoStyle.positionY) / 100}px`,
            width: `${
              logoData.logoRect._width +
              (logoData.logoRect._width * logoStyle.scaleFactor) / 50
            }px`,
            height: `${
              logoData.logoRect._height +
              (logoData.logoRect._height * logoStyle.scaleFactor) / 50
            }px`,
            objectFit: "contain",
            position: "absolute",
          }}
        />
      )}
    </>
  );
}

export default Logo;
