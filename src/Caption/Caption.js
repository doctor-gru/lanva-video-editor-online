import { useVideoConfig } from "remotion";

function Caption(props) {
  const titleData = props.titleData;
  const titleStyle = titleData.titleStyle;
  const { height } = useVideoConfig();

  let textAlign = titleStyle.alignment;

  if (titleStyle.alignment === "flex-start") textAlign = "left";
  else if (titleStyle.alignment === "center") textAlign = "center";
  else if (titleStyle.alignment === "flex-end") textAlign = "right";

  return (
    <div
      style={{
        position: `absolute`,
        width: '100%',
        top: `${(height * titleStyle.positionY) / 100}px`,
        fontFamily: `${titleStyle.fontName}`,
        color: `${titleStyle.textColor}`,
        fontSize: `${titleStyle.fontSize}px`,
        lineHeight: `${titleStyle.fontSize}px`,
        fontWeight: `${titleStyle.bold ? "bold" : `normal`}`,
        fontStyle: `${titleStyle.italic ? `italic` : `normal`}`,
        textDecoration: `${titleStyle.underline ? `underline` : `none`}`,
        textAlign: `${textAlign}`,
      }}
    >
      {titleStyle.title}
    </div>
  );
}

export default Caption;
