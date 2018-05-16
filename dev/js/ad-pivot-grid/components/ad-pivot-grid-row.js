'use strict';
import React, {Component, PropTypes} from 'react';
import 'font-awesome/css/font-awesome.min.css';
import '../../styles/ad-pivot-grid-styles.scss';

export default class AdPivotGridRow extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rowCount: 0,
            isExpanded: false,
            key: {}
        }
    }

    renderItem(item) {
        return (
            <AdPivotGridColumn 
            column={item} />
        )
    }

    onClick(event) {

        if(event.target.className == "fa fa-pencil"
            || event.target.className == "fa fa-trash-o") {
                return;
            }

        if(event.target.parentNode.parentNode.className === "ad-pivot-grid-table-tr") {
            event.target.parentNode.parentNode.className === "ad-pivot-grid-table-selected-tr";
            this.props.onRowClick(event.target.parentNode.parentNode.id);
        }
        else if(event.target.parentNode.parentNode.parentNode.className === "ad-pivot-grid-table-tr") {
            event.target.parentNode.parentNode.parentNode.className = "ad-pivot-grid-table-selected-tr";
            this.props.onRowClick(event.target.parentNode.parentNode.parentNode.id);
        }
    }

    getNestedChildCount(children) {
        var count = children.length;
        for(var i = 0; i < children.length; i++) {
            if(children[i].children !== undefined && children[i].children.length > 0) {
                count = count + this.getNestedChildCount(children[i].children);
            }
        }

        return count;
    }

    getChildredRowIds(children, rowId) {
        var arr = [];

        var cnt = rowId + 1;
        for(var i = 0; i < children.length; i++) {

            arr.push(cnt);
            if(children[i].children !== undefined && children[i].children.length > 0) {
                cnt = cnt + this.getNestedChildCount(children[i].children);
            }

            cnt = cnt + 1;
        }

        return arr;
    }

    onExpand(event) {

        var element = this.refs[this.props.rowId+'|'+this.props.uniqueName];

        var childArry = this.getChildredRowIds(this.props.row.children, this.props.rowId);
        var nestChildrenCount = this.getNestedChildrenCount(this.props.row.children);

        console.log(event.target);
        if(this.state.isExpanded == false) {
            this.props.onExpandRow(this.props.prnRowId, element.id, childArry, nestChildrenCount, true, this.props.row.groupByIndex);
            this.state.isExpanded = true;
        }
        else {
            this.props.onExpandRow(this.props.prnRowId, element.id, childArry, nestChildrenCount, false, this.props.row.groupByIndex);
            this.state.isExpanded = false;
        }
    }

    onInput(event) {
        var id = event.target.parentNode.id;
        var row = id.split("|")[0];
        var col = id.split("|")[1];

        var newValue = Object.assign({}, this.props.row);
        newValue[col] = event.target.innerHTML;



        this.props.onRowChanged({row: row, column: col, oldValue: this.props.row[col], newValue: event.target.innerHTML});
    }

    onSuggest(event) {
        var id =- event.target.parentNode.id;
        var col = id.split("|")[1];

    }

    onDeleteRow(event) {
        var id = event.target.parentNode.id;
        var row = id.split("|")[0];
        this.props.onRowsDeleted({key: this.state.key, row: row});
    }

    render() {

        var clsName = "ad-pivot-grid-table-td";
        if(!this.props.isExpanded) {
            clsName = "ad-pivot-grid-table-collapsed-td";
        }

        var delSuggest = null;
        if(!this.props.isReadOnly) {
            delSuggest = <div className="fa fa-trash-o" onClick={this.onDeleteRow.bind(this)}></div>
        }

        var values = [];
        values.push(
            <td className="ad-pivot-grid-row-choice"
                key={this.props.rowId + "|choice|" + this.props.uniqueName}
                id={this.props.rowId + "|choice|" + this.props.uniqueName}
                ref={this.props.rowId + "|choice|" + this.props.uniqueName}
            >
            {delSuggest}
            </td>
        );
        if(this.props.row !== undefined) {

            for(var i = 0; i < this.props.gridColumns.length; i++) {
                var field = this.props.gridColumns[i].field;
                var isnum = this.props.gridColumns[i].isnum;
                var colWidth = (this.props.gridColumns[i].width) + "px";
                var editable = this.props.gridColumns[i].editable;
                var decimal = this.props.gridColumns[i].decimal !== undefined ? this.props.gridColumns[i].decimal : 2;

                if(this.props.gridColumns[i].isKey) {
                    this.state.key[field] = this.props.row[field];
                }

                var suggest = null;
                if(editable && !this.props.isReadOnly) {
                    suggest = <div className="fa fa-pencil" onClick={this.onSuggest.bind(this)}></div>
                }

                if(parseInt(field) === parseInt(this.props.row.groupByIndex)
                    && (this.props.row.children !== undefined && this.props.row.children.length > 0)) {

                    value.push(
                        <td className={clsName}
                            key={this.props.rowId + '|' + field}
                            id={this.props.rowId + '|' + field}
                            ref={this.props.rowId + '|' + field}
                        >
                            <div id={this.props.rowId + '|' + field + '|div'} ref={this.props.rowId + '|' + field + '|div'} style={{width: colWidth}}>
                                <img src="image/plus.png" alt=""
                                        id ={this.props.rowId + '|' + field + "|expand"}
                                        ref={this.props.rowId + '|' + field + "|expand"}
                                        className="ad-pivot-grid-table-td-div-span"
                                        style={{width: "12px", height: "12px", cursor: "pointer", marginLeft: "5px", marginRight: "5px"}}
                                        onClick={this.onExpand.bind(this)} />

                                <span className="ad-pivot-grid-table-td-div-span">{this.props.row[field]}</span>
                                <span className="ad-pivot-grid-table-td-div-span">{"(" + this.props.row.children.length + ")"}</span>
                            </div>
                        </td>
                    );
                }
                else if(parseInt(field) <= parseInt(this.props.parentGroupByIndex)) {
                    //do nothing
                }
                else {
                    if(isnum) {
                        values.push(
                            <td className={clsName}
                                key={this.props.rowId + '|' + field+'|'+this.props.uniqueName}
                                id={this.props.rowId + '|' + field+'|'+this.props.uniqueName}
                                ref={this.props.rowId + '|' + field+'|'+this.props.uniqueName}
                            >
                                <div id={this.props.rowId + '|' + field + '|div'+'|'+this.props.uniqueName} ref={this.props.rowId + '|' + field + '|div'} style={{width: colWidth}}>
                                    <span contentEditable={editable} suppressContentEditableWarning={true} style={{float: "right", marginLeft:"5px"}} onInput={this.onInput.bind(this)}>&nbsp;{this.props.row[field] !== undefined && this.props.row[field] !== null ? this.props.row[field].toFixed(decimal) : ""}</span>
                                    {suggest}
                                </div>
                            </td>
                        );
                    }
                    else {
                        values.push(
                            <td className={clsName}
                                key={this.props.rowId + '|' + field+'|'+this.props.uniqueName}
                                id={this.props.rowId + '|' + field+'|'+this.props.uniqueName}
                                ref={this.props.rowId + '|' + field+'|'+this.props.uniqueName}
                            >
                                <div id={this.props.rowId + '|' + field + '|div'} ref={this.props.rowId + '|' + field + '|div'} style={{width: colWidth}}>
                                    <span contentEditable={editable} suppressContentEditableWarning={true} style={{float: "right", marginLeft:"5px"}} onInput={this.onInput.bind(this)}>&nbsp;{this.props.row[field]}</span>
                                    {suggest}
                                </div>
                            </td>
                        );
                    }
                }
            }
        }

        return (
            <tr className={this.props.className}
                key={this.props.rowId+"|"+this.props.uniqueName}
                id={this.props.rowId+"|"+this.props.uniqueName}
                ref={this.props.rowId+"|"+this.props.uniqueName}
                onClick={this.onClick.bind(this)}
            >
                {values}
            </tr>
        );
    }
}

AdPivotGridRow.propsTypes = {
    row: PropTypes.object.isRequired,
    rowId: PropTypes.number.isRequired,
    prnRowId: PropsTypes.number.isRequired,
    gridColumns: PropTypes.array.isRequired,
    onRowClick: PropTypes.func,
    onExpandRow: PropTypes.func,
    className: PropTypes.string.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    parentGroupByIndex: PropTypes.string.isRequired,
    onRowsChanged: PropTypes.func.isRequired,
    onRowsDeleted: PropTypes.func.isRequired,
    uniqueName: PropTypes.string.isRequired,
    isReadOnly: PropTypes.bool
};