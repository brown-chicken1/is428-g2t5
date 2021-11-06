import React, { Component } from 'react';
import draw from './vis';
import drawSubChart from './subchart';

export default class PieChart extends Component {

    componentDidMount() {
        draw(this.props);
        drawSubChart(this.props);
    }

    componentDidUpdate(preProps) {
        draw(this.props);
        // drawSubChart(this.props);
    }

    render() {
        return (
            <div>
            <div className='vis-ViolinChart'/>
                <svg className='vis-subPhysicalChart'></svg>
            </div>
        )
    }
}

