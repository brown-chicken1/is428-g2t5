import React, {Component} from "react";

// import data from './data';
import {Layout} from 'antd';
import View1 from './views/View1';
import View2 from './views/View2';

// import * as d3 from "d3";
import "./App.css";
import {default as ReactSelect} from "react-select";

import {components} from "react-select";

const {Content} = Layout;

function App(things) {
    const [data, setData] = React.useState([]);
    const [optionSelected, setoptionSelected] = React.useState([]);

    // console.log(optionSelected);

    let handleChange = (selected) => {
        let currentSports = selected.map(x => x.value);
        setoptionSelected(
            {
                optionSelected: selected
            })
        setData(
            passData.things.filter(function (d) {
                    return currentSports.includes(d.Sport);
                }
            ))
    };

    let passData = things;
    let dataSport = new Set()


    for (let i = 0; i < passData.things.length; i++) {
        dataSport.add(passData.things[i].Sport);
    }
    let dataSportArray = Array.from(dataSport);
    let dataSportObject = [];

    for (let i = 0; i < dataSportArray.length; i++) {
        dataSportObject.push({
            "value": dataSportArray[i],
            "label": dataSportArray[i],
            "color": "#FF0000"
        });
    }

    const Option = (props) => {
        return (
            <div>
                <components.Option {...props}>
                    <input
                        type="checkbox"
                        checked={props.isSelected}
                        onChange={() => null}
                    />{" "}
                    <label>{props.label}</label>
                </components.Option>
            </div>
        );
    };


// js stuff goes inside the curly braces
    return (

        // dropdown list refernced from https://codesandbox.io/s/interesting-torvalds-whuz3?from-embed=&file=/src/MySelect.js:0-1011 -->
        // https://codesandbox.io/s/determined-tereshkova-ygbzs?file=/src/index.js:750-758
        <div>
            <ReactSelect
                options={dataSportObject}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                onChange={handleChange}
                components={{
                    Option
                }}
                allowSelectAll={true}
                value={optionSelected.value}
            />

            <div className='title'>Visualising Olympics Data</div>
            <Layout style={{height: 600}}>
                <Layout>
                    <Content style={{height: 200, width: 300}}>
                        <View1 data={data}/>
                    </Content>
                    <Content style={{height: 800, width: 1500}}>
                        <View2 data={data}/>
                    </Content>
                </Layout>
            </Layout>
        </div>
    );

}

export default App;
