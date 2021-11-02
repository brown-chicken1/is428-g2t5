import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import * as d3 from "d3";

const data = "thinasdasdasdasdg";

d3.csv("athlete_events.csv", (row, i) => {
    return {
        ID: row.ID,
        Name: row.Name,
        Sex: row.Sex,
        Age: row.Age,
        Height: row.Height,
        Weight: row.Weight,
        Team: row.Team,
        NOC: row.NOC,
        Games: row.Games,
        Year: row.Year,
        Season: row.Season,
        City: row.City,
        Sport: row.Sport,
        Event: row.Event,
        Medal: row.Medal,
        //avg: (+row.min_temperature + +row.max_temperature) /2,
    };
}).then(rows => {
    const allData = rows;
    makeChart(rows);
}).catch(error => {
    console.log(error);
});


function makeChart(data) {


    ReactDOM.render(

    <React.StrictMode>
        <App things={data}/>
    </React.StrictMode>,
        document.getElementById('root')
)
    ;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

}

reportWebVitals();
