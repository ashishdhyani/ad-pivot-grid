'use strict';
import React, {Component, PropTypes} from 'react';
import ChipListControl from '../control/droppable-chip-list-control';

export default class PivotOptionsView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            pivotBy: []
        };

        this.removeFromCollection = this.removeFromCollection.bind(this);
        this.addToCollection = this.addToCollection.bind(this);
    }

    addToCollection(arr, id, name) {
        if(arr != null) {
            var cnt = {field: id, Caption: name};
            if(cnt < 0) {
                var obj = {field: id, Caption: name};
                arr.push(obj);
            }
        }
    }

    removeFromCollection(arr, id) {
        if(arr != null) {
            var cnt = arr.map((item) => item.field).indexOf(id);
            if(cnt >= 0) {
                arr.splice(cnt, 1);
            }
        }
    }

    onDeletePivotBy(id) {
        this.removeFromCollection(this.state.pivotBy, id);
        this.setState({pivotBy: this.state.pivotBy});

        var tempPivotBy = [];
        for(var i = 0; i < this.state.pivotBy.length; i++) {
            tempPivotBy.push(this.state.pivotBy[i].field);
        }

        if(this.props.onPivotByChanged !== undefined) {
            this.props.onPivotByChanged(tempPivotBy);
        }
    }

    onDeleteColumns(id) {
        this.removeFromCollection(this.state.columns, id);
        this.state({columns: this.state.columns});

        if(this.props.onColumnChanged !== undefined) {
            this.props.onColumnChanged(this.state.columns);
        }
    }

    onDeletePivotBy(item) {
        this.addToCollection(this.state.pivotBy, item.id, item.name);

        var tempPivotBy = [];
        for(var i = 0; i < this.state.pivotBy.length; i++) {
            tempPivotBy.push(this.state.pivotBy[i].field);
        }

        if(this.props.onPivotByChanged !== undefined) {
            this.props.onPivotByChanged(tempPivotBy);
        }
    }

    onDropColumns(item) {
        this.removeFromCollection(this.state.pivotBy, item.id);
        this.setState({pivotBy: this.state.pivotBy});

        var tempPivotBy = [];
        for(var i = 0; i < this.state.pivotBy.length; i++) {
            tempPivotBy.push(this.state.pivotBy[i].field);
        }

        if(this.props.onPivotByChanged !== undefined) {
            this.props.onPivotByChanged(tempPivotBy);
        }
    }

    componentWillMount() {
        
        var pivotRows = [];
        for(var i = 0; i < this.props.pivotBy.length; i++) {
            var idx = this.props.colums.map((item) => item.field).indexOf(this.props.pivotBy[i]);
            if(idx >= 0) {
                pivotRows.push({field: this.props.columns[idx].field, Caption: this.props.columns[idx].Caption});
            }
        }

        this.setState({
            columns: this.props.columns,
            pivotBy: pivotRows
        });
    }

    componentWillReceiveProps(nextProps, nextState) {
        var pivotRows = [];
        for(var i = 0; i < nextProps.pivotBy.length; i++) {
            var idx = nextProps.colums.map((item) => item.field).indexOf(nextProps.pivotBy[i]);
            if(idx >= 0) {
                pivotRows.push({field: nextProps.columns[idx].field, Caption: nextProps.columns[idx].Caption});
            }
        }

        this.setState({
            columns: nextProps.columns,
            pivotBy: pivotRows
        });
    }

    render() {
        return (
            <div>
                <div style={{width: "200px", display: "inline-block", marginLeft: "10px", fontSize: "12px"}}>
                    &nbsp;All Columns
                    <ChipListControl
                        items={this.state.columns}
                        onDropped={this.onDropColumns.bind(this)}
                        onDelete={this.onDeleteColumns.bind(this)}
                        height="160px" />
                </div>
                <div id="ad-pivot-grid-pivot-settings" style={{width: "200px", display: this.props.pivotDisplay, marginLeft: "10px", fontSize: "12px"}}>
                    &nbsp;Pivot By
                    <ChipListControl
                        items={this.state.pivotBy}
                        onDropped={this.onDropPivotBy.bind(this)}
                        onDelete={this.onDeletePivotBy.bind(this)}
                        height="160px" />
                </div>
            </div>
        );
    }
}

PivotOptionsView.propTypes = {
    pivotBy: PropsTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    onPivotByChanged: PropTypes.func,
    onColumnChanged: PropsTypes.func,
    pivotDisplay: PropTypes.string
};