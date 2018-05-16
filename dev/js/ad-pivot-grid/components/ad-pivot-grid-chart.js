'use strict';
import React, {Component, PropTypes} from 'react';
import C3Chart from 'react-c3js';
import 'c3/c3.css';

export default class AdPivotGridchart extends Component {
    constructor(props) {
        super (props);
        this.state = {
            chartData: [],
            axis: [],
            chartType: 'line'
        }
    
        this.generateChart =  this.generateChart.bind(this);
    }

    generateChart(data, columns, chartType) {
        if(chartType !== undefined) {
            this.state.chartType = chartType;
        }
        var cols = [];
        //var yAxis = [];
        var xAxis = [];
        for(var i = 0; i < columns.length; i++) {
            console. log(columns[i]);
            if(columns[1].aggregate !== undefined) {
                var tempCols = [];
                tempCols.push(columns[i].Caption);
                for(var j = 0; j < data. length; j++) {
                    tempCols.push(data[j][i] !== undefined ? data[j][i] : 0);
                }
                cols.push (tempCols);
            }
            else {
                for(var j = 0; j < data.length; j++) {
                    if(xAxis [j+1] === undefined) {
                        xAxis.push(data[j][i]);
                    }
                    else if(data[j][i] !== undefined){
                        xAxis[j+1] = xAxis[j+1] +"|"+ data[j][i];
                    }
                }
            }
        }

        this.setState({
            chartData: {
                columns: cols,
                type: this.state.chartType
            },
            axis: {
                X: {
                    type: 'category',
                    categories: xAxis
                }
            },
            chartType: this.state.chartType
        });
    }

    componentWillMount() {
        this.generateChart(this.props.data, this.props.columns, this.props.chartType);
    }

    componentWillReceiveProps(nextProps, nextState) {
        this.generateChart(nextProps.data, nextProps.columns, nextProps.chartType);
        this.forceUpdate();
    }

    render() {
        return (
            <div>
                <C3Chart data={this.state.chartData} axis={this.state.axis} />
            </div>
        );
    }
}

PivotGridChart.propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    chartType: PropTypes.string
}        

