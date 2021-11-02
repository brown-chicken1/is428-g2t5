import React, { Component } from 'react';
import './view1.css';
import PieChart from '../../charts/PieChart';
import componentDidUpdate from '../../charts/PieChart/vis.js'

export default class View1 extends Component {
    // returns the elements that will be created by react
    // typically described using JSX
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

