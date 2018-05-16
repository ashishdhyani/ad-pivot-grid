'use strict';
import React, {Component, PropTypes} from 'react';
import 'font-awesome/css/font-awesome.min.css';

export default class ToggleControl extends Component {

    constructor(props) {
        super(props);
    }

    onClick(event) {
        this.props.onChange(event.target.checked);
    }

    onChange(event) {

    }

    render() {
        return (
            <div style={{height:"31px", width:"150px", fontSize:"12px", fontWeight:"normal", display:"inline-block", marginLeft:"5px"}}>
                <label style={{verticalAlign:"top", marginTop:"6px"}}>{this.props.label}</label>
                <label className="switch" style={{marginTop:"3px", marginLeft:"10px"}}>
                    <imput type="checkbox" onClick={this.onClick.bind(this)} checked={this.props.checked} onChange={this.onChange} />
                </label>
            </div>
        );
    }
}