import { useEffect, useMemo, useRef, useState } from 'react';
import {
    useCurrentFrame,
    useVideoConfig,
} from 'remotion';
import { ensureFont } from '../Libraries/ensure-font';
import parseSRT from '../Libraries/parse-srt';
import { Word } from './Word';

function useWindowedFrameSubs(src, options) {
    const { windowStart, windowEnd } = options;
    const config = useVideoConfig();
    const { fps } = config;
    const parsed = useMemo(() => parseSRT(src), [src]);

    return useMemo(() => {
        return parsed.map((item) => {
            const start = Math.floor(item.start * fps);
            const end = Math.floor(item.end * fps);
            return { item, start, end };
        })
            .filter(({ start }) => {
                return start >= windowStart && start <= windowEnd;
            })
            .map(({ item, start, end }) => {
                return {
                    ...item,
                    start,
                    end,
                };
            });
    }, [fps, parsed, windowEnd, windowStart]);
}

const ZOOM_MEASURER_SIZE = 10;
const LINE_HEIGHT = 49;

export function PaginatedSubtitles(props) {
    const startFrame = props.startFrame;
    const endFrame = props.endFrame;
    const subtitles = props.subtitles;
    const linesPerPage = props.linesPerPage;
    const subTitleData = props.subTitleData;
    const subTitleStyle = subTitleData.subTitleStyle;

    const frame = useCurrentFrame();
    const windowRef = useRef(null);
    const zoomMeasurer = useRef(null);
    // const handleState = useState(() => delayRender());
    // const handle = handleState[0];
    // const setHandle = handleState[1];
    // const fontHandleState = useState(() => delayRender());
    // const fontHandle = fontHandleState[0];
    // const setFontHandle = fontHandleState[1];
    // const fontLoadedState = useState(false);
    // const fontLoaded = fontLoadedState[0];
    // const setFontLoaded = fontLoadedState[1];
    const windowedFrameSubs = useWindowedFrameSubs(subtitles, {
        windowStart: startFrame,
        windowEnd: endFrame,
    });
    const lineOffsetState = useState(0);
    const lineOffset = lineOffsetState[0];
    const setLineOffset = lineOffsetState[1];

    const onlyCurrentSentence = useMemo(() => {
        const indexOfCurrentSentence = windowedFrameSubs.findLastIndex((w, i) => {
            const nextWord = windowedFrameSubs[i + 1];
            return (
                nextWord &&
                (w.text.endsWith('?') ||
                    w.text.endsWith('.') ||
                    w.text.endsWith('!')) &&
                nextWord.start < frame
            );
        }) + 1;

        return windowedFrameSubs.slice(indexOfCurrentSentence);
    }, [frame, windowedFrameSubs]);

    useEffect(() => {
        // if (!fontLoaded) {
        //     return;
        // }
        const zoom = zoomMeasurer.current?.getBoundingClientRect().height /
            ZOOM_MEASURER_SIZE;
        const linesRendered = windowRef.current?.getBoundingClientRect().height /
            (subTitleStyle.fontSize * 1.25 * zoom);
        const linesToOffset = Math.max(0, linesRendered - linesPerPage);
        setLineOffset(linesToOffset);
        // continueRender(handle);
    }, [/*fontLoaded, */frame, linesPerPage]);

    // useEffect(() => {
    //     ensureFont(subTitleData.fontName, subTitleData.fontUrl)
    //         .then(() => {
    //             continueRender(fontHandle);
    //             setFontLoaded(true);
    //         })
    //         .catch((err) => {
    //             cancelRender(err);
    //         });
    // }, [fontHandle, fontLoaded]);

    const lineSubs = onlyCurrentSentence.filter((word) => {
        return word.start < frame;
    });



    return (
        <div
            style={{
                display: 'flex',
                position: 'relative',
                overflow: 'hidden',
                textAlign: `${subTitleStyle.alignment}`
            }}
        >
            <div
                ref={windowRef}
                style={{
                    transform: `translateY(-${lineOffset * subTitleStyle.fontSize * 1.25}px)`,
                }}
            >
                {lineSubs.map((item) => (
                    <span key={item.id} id={String(item.id)}>
                        <Word frame={frame} item={item} subTitleStyle={subTitleStyle} />{' '}
                    </span>
                ))}
            </div>
            <div
                ref={zoomMeasurer}
                style={{ height: ZOOM_MEASURER_SIZE, width: ZOOM_MEASURER_SIZE }}
            />
        </div >
    )
};

export default PaginatedSubtitles;
