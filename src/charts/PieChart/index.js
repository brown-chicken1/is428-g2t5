import React, {Component} from 'react';
import draw from './vis';


// this thing https://reactjs.org/docs/state-and-lifecycle.html
export default class PieChart extends Component {

    componentDidMount() {
        draw(this.props);
    }

    componentDidUpdate(prevProps) {
       draw(this.props);

    }

    render() {

        return (
            <div>
                <div className='vis-piechart'/>
            </div>

        )
    }


}

