import React, { Component } from 'react';
import draw from './vis';
// import './view1.css';

export default class View1 extends Component {
    render() {
        const {data} = this.props;
        const width = 260;
        const height = 260;
        return (
            <div id='view1' className='pane'>
                <div className='header'>Gender</div>
                <PieChart data={data} width={width} height={height} />
            </div>
        )
    }


}

