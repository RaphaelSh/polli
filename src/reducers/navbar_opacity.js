const d3 = require('d3-scale');

const op = d3.scaleLinear()
            .domain([0, window.innerHeight ])
            .range([0, 1]);
    
export default ( state, { type, pos }) => {
                                switch( type ){
                                    case 'PAGE_SCROLL_IN_HOME': {
                                        return typeof pos!==undefined ? op(pos) : 1;
                                    }
                                    case 'PAGE_SCROLL_OUT_OF_HOME': return 1;
                                    case 'MOUSE_ENTER_NAVBAR': return 1;
                                    case 'MOUSE_LEAVE_NAVBAR': return 0;                            
                                    default: return 0;
                            }
};