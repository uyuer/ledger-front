import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import defaultTheme from './theme/default';

echarts.registerTheme('default', defaultTheme);

const EchartBase = forwardRef((props, ref) => {
    const { style = {
        width: '100%',
        height: '100%'
    } } = props;
    return (
        <ReactEcharts
            ref={ref}
            theme="default"
            {...props}
            style={style}
        />
    );
});

EchartBase.propTypes = {
    style: PropTypes.object
};

export default EchartBase;