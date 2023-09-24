import { Easing, interpolate } from 'remotion'

export function Word(props) {

    const item = props.item;
    const frame = props.frame;
    const subTitleStyle = props.subTitleStyle;


    const opacity = interpolate(frame, [item.start, item.start + 15], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });
    const translateY = interpolate(frame, [item.start, item.start + 10], [0.25, 0], {
        easing: Easing.out(Easing.quad),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    return <span style={{
        display: 'inline-block',
        opacity: opacity,
        transform: 'translate(0, ' + translateY + 'em)',
        fontFamily: `${subTitleStyle.fontName}`,
        color: `${subTitleStyle.textColor}`,
        fontSize: `${subTitleStyle.fontSize}px`,
        lineHeight: `${subTitleStyle.fontSize}px`,
        fontWeight: `${subTitleStyle.bold ? 'bold' : `normal`}`,
        fontStyle: `${subTitleStyle.italic ? `italic` : `normal`}`,
        textDecoration: `${subTitleStyle.underline ? `underline` : `none`}`
    }}> {item.text}</ span>
}

export default Word;