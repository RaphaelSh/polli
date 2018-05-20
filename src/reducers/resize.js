
export default (state = { windowHeight: window.innerHeight, windowWidth: window.innerWidth }, { type}) => {
    switch( type ){
        case 'RESIZE': return { windowHeight: window.innerHeight, windowWidth: window.innerWidth};
        default: return state;
    }
};