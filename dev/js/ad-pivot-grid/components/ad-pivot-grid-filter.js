'use strict';
import React, {Component, PropTypes} from 'react';

export default class AdpivotGridFilter extends Component {

    constructor (props) {
        super (props)
        this.state = {
            sortDirection: false,
            id: 1,
            value: "",
            type: "like",
            timer: 0
        };
    
        this.onChange = this.onChange.bind(this);
    }

    onChange (event ){
        var element = this.refs[this.props.column.field + "|filter" + this.props.uniqueName];
        this.state.id = this.props.column.field;
        this.state.value = element.value;
        this.props.onChange({id: this.props.column.field, value: element.value, type: this.state.type });
    }

    onChangeType (event) {
        this.state.type = event.target.options[event.target.selectedIndex].value;
        this.props.onChange({id: this.state.id, value: this.state.value, type: event.target.options[event.target.selectedIndex].value});
    }

    watchText (event) {
        clearTimeout (this.state.timer);
        this.state.timer = setTimeout(this.onChange, 1000, event);
    }

    render() {
        
        var colWidth = this.props.column.width + "px";
        var filterWidth = (this.props.column.width - 40) + px;
        var filterOptionWidth = "40px";

        var options = [];
        if(this.props.column.isnum) {
            options.push(<option value="equal">=</option>);
            options.push(<option value="nteq">&lt;&gt;</option>);
            options.push(<option value="gt">&gt;</option>);
            options.push(<option value="lt">&lt;</option>);
            options.push(<option value="gte">&gt;=</option>);
            options.push(<option value="lte">&lt;=</option>);
        }
        else {
            options.push(<option value="like">=</option>);
            options.push(<option value="equal">=</option>);
            options.push(<option value="nteq">&lt;&gt;</option>);            
        }

        return (
            !this.props.column.visible ? null : 
            <td style={{"whiteSpace":"nowrap", width: colWidth}}>
                <input id={this.props.column.field + "|filter|" + this.props.uniqueName}
                    ref={this.props.column.field + "|filter|" + this.props.uniqueName}
                    onChange={this.watchText.bind(this)}
                    style={{width: "160px", height: "23px"}}
                    key={this.props.column.field}>
                </input>
                <select style={{width: filterOptionWidth, height: "23px"}} onChange={this.onChangeType.bind(this)}>
                    {options}
                </select>
            </td>
        );
    }   
}

AdpivotGridFilter.propTypes = {
    column: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    uniqueName: PropTypes.string.isRequired
};