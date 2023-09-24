
const CompLogoRect = {
    _x: number,
    _y: number,
    _width: number,
    _height: number,
    _objectFit: string
}

const CompLogoData = {
    _url: string,
    _logoRect: CompLogoRect
}

const CompVideoData = {
    _url: string,
    _width: number,
    _height: number
}

const CompAudioData = {
    _url: string,
    _startOffset: number,
    _length: number,
    _lineColor: string,
    _lineHeight: number,
    _gramRect: CompLogoRect
}

const CompTitleRect = {
    _x: number,
    _y: number,
    _width: number,
    _height: number
}

const CompTitleData = {
    _title: string,
    _fontSize: number,
    _fontColor: string,
    _fontUrl: string,
    _fontName: string,
    _titleRect: CompTitleRect
}

const CompSubTitleData = {
    _url: string,
    _fontSize: number,
    _fontColor: string,
    _fontUrl: string,
    _fontName: string,
    _subTitleRect: CompTitleRect
}

const CompAudioGramData = {
    _audioData: CompAudioData,
    _subTitleData: CompSubTitleData
};

const RenderData = {
    logoData: CompLogoData,
    videoData: CompVideoData,
    titleData: CompTitleData,
    streamData: CompAudioGramData
};
