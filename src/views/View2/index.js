import React, { Component } from 'react';
import './view2.css';
import ViolinChart from '../../charts/ViolinChart';

export default class View2 extends Component {
    render() {
        const {data} = this.props;
        const width = 800;
        const height = 1500;
        return (
            <div id='view2' className='pane'>
                <div className='header'>Gender</div>
                <ViolinChart data={data} width={width} height={height} />
            </div>
        )
    }


}

