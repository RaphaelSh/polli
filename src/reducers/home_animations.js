const windowHeight = window.innerHeight,
num_to_add = +((windowHeight/10000).toFixed(3));

export default (state = { lastPos: 0 , op: 1 }, { type, curPos }) => {
    const { op } = state;
    switch( type ){
        case 'PAGE_SCROLL_UP': return { lastPos: curPos, op: +((op + num_to_add+0.2).toFixed(3)) };
        case 'PAGE_SCROLL_DOWN': return { lastPos: curPos, op: +((op - num_to_add).toFixed(3))};
        case 'PAGE_CROSSED_LIMIT': return { lastPos: curPos, op: 1 };
        default: return { lastPos: 0, op: 1 };
    }
};