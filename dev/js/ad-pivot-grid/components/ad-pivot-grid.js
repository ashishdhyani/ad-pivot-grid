'use strict';
import React, {PureComponent, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import AdToolbar from 'ad-pivot-grid-toolbar';
import AdPivotGridChart from '/ad-pivot-grid-chart';
import './styles/ad-pivot-grid-styles.scss';
import '../../styles/loading.scss';
import ContextMenu from '../control/ad-pivot-context-menu';
import * as PivotHelper from './helpers/ad-pivot-grid-pivot-helper';
import * as RowsHelper from './helpers/ad-pivot-grid-rows-helper';
import * as HeaderHelper from './helpers/ad-pivot-grid-header-helper';
import * as FilterHelper from './helpers/ad-pivot-grid-fiter-helper';
import * as ColumnHelper from './helpers/ad-pivot-grid-column-helper';
import * as ExportHelper from '../helpers/ad-pivot-grid-export-helper';
import * as SortHelper from '../helpers/ad-pivot-grid-sort-helper';
import Spinner from 'react-splinkit';

export default class AdPivotGrid extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            rows: [],
            header: [],
            filter: [],
            gridColumns: [],
            pivotRows: [],
            pivotColumns: 0,
            index: -1,
            toggleBool: false,
            filtersAdded: 0,
            forcedUpdate: false,
            rowCount:-1,
            selectedRows: D,
            ctrlPressed: false,
            pivotingEnabled: false,
            filterEnabled: true,
            toolbarEnabled: true,
            gridMode: true,
            copiedText: null,
            visibleStart: 0,
            visibleEnd: 0,
            scroll: null,
            recordHeight: 20,
            settingsOpen: false,
            intervalId: null,
            sortBy: null
        }

        RowsHelper.createRows = RowsHelper.createRows.bind(this);
        RowsHelper.onRowClicked = RowsHelper.onRowClicked.bind(this);
        RowsHelper.resetSelection = RowsHelper.resetSelection.bind(this);
        FilterHelper.applyFilter = FilterHelper.applyFilter.bind(this);
        HeaderHelper.renderHeader = HeaderHealper.renderHeader.bind(this);
        SortHelper.sortDataTable = SortHelper.sortDataTable.bind(this);
        this.getSelectedRowData = this.getSelectedRowData.bind(this);
        this.scrollState = this.scrollState.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    handleKeyDown(e) {
        if (e.keyCode === 17) {
            this.state.ctrlPressed = true;
        }
        else {
            this.state.ctriPressed = false;
        }
    }

    handleKeyUp(e) {
        this.state.ctriPressed = false;
    }
    componentWillMount() {
        document.addEventistener("keydown", this.handleKeyDown.bind(this), false);
        document.addEventlistener("keyup", this.handleKeyUp.bind(this), false);
        document.addEventlistener("copy", this.modifyCopy.bind(this));
        
        this.setState({data: this.props.data, columns: this.props.columns, pwolRows: this.props.pivofRows, pivotColumns: this.props,pivotColumns});
        
        this.state.filterEnabled = this.props.enableFilter === undefined ? this.state.fiterEnabled : this.props.enableFiter;
        this.state.toolbarEnabled = this.props.enableToolbar === undefined ? this.state.toolbarEnabled : this.props.toolbarEnabled;
        
        this.createTable(this.props.data, this.props.groupedColumns, this.props.columns, this.state.pivotingEnabled ? this.props.pivotRows: 0, this.props.pivotColumns);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handlekeyDown.bind(this), false);
        document.removeEventListener("keyup", this.handleKeyUp.bind(this), false);
    }

    scrollState() {
        var scroll = this.refs['bodydiv'].scrollTop;
        var heightNum = parseInt(this.props.height.substring(0, this.props.height.length - 2));
        this.state.visibleStart = Math.floor(scroll / this.state.recordHeight);
        this.state.visibleEnd = this.state.visibleStart + Math.floor(heightNum / this.state.recordHeight);
        this.state.scroll = scroll;

        if(this.state.visibleEnd <= this.props.data.length) {
            this.state.visibleEnd = this.this.state.visibleEnd + 15 > this.props.data.length ? this.props.data.length : this.state.visibleEnd + 15;

            this.state.rows = [];
            RowsHelper.createRows(this.state.data, true, -1, "-1");
            clearInterval(this.state.intervalId);
            this.setState({intervalId: null});
        }
    }
        
    onScroll() {
        this.refs['headerdiv'].scrollleft = this.refs['bodydiv'].scrollleft;

        if(this.props.infiniteScroll && !this.state.pivotingEnabled && this.state.intervalId == null) {
            var intervalId = setInterval(this.scrollState, 10);
            this.setState({intervalId: intervalId});
        }
    }

    createTable (data, groupedColumns, columns, pivotRows, pivotColumns) {
        //var manipulateData ColumnHelper.manipulateData(data, columns, pivotRows, pivotColumns)

        RowsHelper.resetSelection();

        var datas = undefined;
        if(this.state.filterEnabled) {
            datas = FilterHelper.applyFilter(data);
        }
        else {
            datas = data;
        }
        //console.1og (columns);
        if(columns != undefined) {
            columns.sort( function(a,b) { return (a.gzpld > b.grpId) ? 1 : ((b.grpld > a.grpld) ? -1 : 0);});
        }
        
        if(groupedColumns !== undefined) {
            groupedColumns.sort( function (a,b) { return (a.grp1d > b.grpld) ? 1 : ((b.grpId> a.grpld) ? 1 : 0);} );
        }

        this.state.rowcount = -1;
        this.state.gridcolumns = [];

        var headers = [];
        for(var col in columns) {
            headers.push(HeaderHelper.renderHeader(columns[col], pivotRows.length > 0));
        }

        var groupedHeaders = [];
        if(groupedColumns !== undefined && groupedColumns.length > 0) {
            groupedHeaders = groupedColumns.map(HeaderHelper.renderGroupHeader.bind (this));
        }
        //console:1og (groupedHeadera):
        var processedData = [];
        if(pivotRows !== null && pívotRows.length > 0) {
            var pivotBy = pivotRows.slice();
            pivotBy.splice(0, 1);
            processedData = PivotHelper.pivotIable(datas, columns, pivotRows [0], pivotBy);
        }
        else {
            processedData = datas.slice(0);
        }
        //console.1og (processedData)
        var filters = [];
        if(this.state.filterEnabled) {
            filters = columns.map(FilterHelper.renderFilter.bind(this));
        }

        if(this.props.infiniteScroll && !this.state.pivotingEnabled && this.state.visibleEnd == 0) {
            this.state.visibleEnd = Math.ceil(this.props.height.substring(0, this.props.height.length - 2) / this.state.recordHeight);
        }
        else {
            this.state.visibleEnd = processedData.length;
        }

        if(this.state.sortBy !== null) {
            processedData = SortHelper.sortDataTable(processedData, this.state.sortBy);
        }

        this.state.rows = [];
        RowsHelper.createRows(processedData, true, -1, "-1");
        this.setState({data: processedData, columns: columns, filter: filters, groupedHeader: groupedHeaders, header: headers, row: this.state.rows});
        console.log(this.state.rows);
    }

    componentWillReceiveProps(nextProps) {
        this.setState ({data: nextProps.data, columns: nextProps.columns, pivotRows: nextProps.pivotRows, pivotColums: nextProps.pivotColumns, rowsChanged: []});

        this.createTable (nextProps.data, nextProps.groupedColumns, nextProps.columns, this.state.pivotingEnabled ? nextProps.pivotRows : [], nextProps.pivotColumns);
    }

    onSetPivotEnabled(value) {
        this.setState({pivotingEnabled: value});
        this.createTable(this.props.data, this.props.groupedColumns, this.props.columns, value ? this.props.pivotRows : [], this.props.pivotColumns);   
    }

    onPivotByChanged(value) {
        this.setState ({pivotRows: value});
        //console.log (value) :
        this.createTable (this.props.data, this.props.groupedColumns, this.props.columns, this.state.pivotingEnabled ? value : [], this.props.pivotColumns);
    }

    onColumnsChanged(value) {
        this.setState({columns: value});
        //console.log (value) :
        this.createTable (this.props.data, this.props.groupedColumns, value, this.state.pivotingEnabled ? this.props.pivotRows : [], this.props.pivotColumns);
    }

    onSetChartMode(value) {
        this.setState ({gridMode: value});
        this.forceUpdate();
    }

    onSetGridMode (value) {
        this.setState({gridMode: value});
        this.forceUpdate();
    }

    onSetFilterEnabled (value) {
        this.setstate({filterEnabled: value});
        var element = this.refs["ad-pivot-grid-table-filter"];
        if(value) {
            element.style.display = "";
        }
        else {
            element.style.display = "none";
        }
    }

    onExportToExcel(event) {
        ExportHelper.tableToExcel("ad-pivot-grid-table-header", "ad-pivot-grid-table-body", "data", "export.xls")
    }

    getSelectedRowData() {
        var data = "";
        for(var selRow in this.state.selectedRows) {
            var row = this.state.data[this.state.selectedRows[selRow]];
            for(var property in row) {
                if(row.hasOwnProperty(property)) {
                    data = data + row[property] + "\t";
                }
            }
            data = data + "\n";
        }
    }

    modifyCopy(event) {
        if(event.target.className === "contextMenu--option") {
            event.clipboardData.setData("text/plain", this.state.copiedText);
            event.preventDefault();
        }
    }

    onCopy(event) {
        this.state.copiedText = this.getSelectedRowData();

        document.exceCommand("copy");
    }

    onCopyWithHeader(event) {
        this.state.copiedText = "";
        for(var col in this.state.columns) {
            this.state.copiedText = this.state.copiedText + this.state.columns[col].caption + "\t";
        }
        this.state.copiedText = this.state.copiedText + "\n" + this.getSelectedRowData();

        document.exceCommand("copy");
    }

    onSaveData() {
        if(this.props.onSaveData !== undefined) {
            this.props.onSaveData(this.state.rowsChanged);
        }
    }

    onSettingsOpen(value) {
        this.setState({onSettingsOpen: value});
    }

    render() {
        var toolBar = undefined;
        if (this. state.toolbarEnabled) {
            toolBar = <AdToolbar
                            pivotBy = {this.state.pivotRows}
                            columns = {this. state.columns}
                            onSetPivotEnabled = {this.onSetPivotEnabled.bind(this) }
                            onSetFilterEnabled = {this.onSetFilterEnabled.bind(this)}
                            onPivotBychanged = {this.onPivotBychanged.bind(this)}
                            onColumnsChanged = {this.onColumnsChanged.bind(this)}
                            onSetChartMode = {this.onSetChartMode.bind(this)}
                            onSetGridMode = {this.onsetGridMode.bind (this)}
                            onSaveData= {this.onSaveData.bind(this)}
                            settingsOpen={this.state.settingsOpen}
                            isGridMode={this.state.gridMode}
                            onSettingsOpen={this.onSettingsOpen.bind(this)}
                            />
        }

        var spinner = null;
        var opacity = 1;
        var pointerEvents = "auto";
        if(this.props.isLoading) {
            spinner = <Spinner className="loading" name="ball-scale-multiple" color="#4682B4" />
            opacity = 0.5;
            pointerEvents = "none";
        }

        if(this.state.gridMode) {
            return (
                <div style={{opacity: opacity, poiterEvents: pointerEvents}}>
                    <ContextMenu onExportToExcel={this.onExportToExcel} onCopy={this.onCopy.bind(this)} onCopy={this.onCopy.bind(this)} onCopyWithHeader={this.onCopyWithHeader.bind(this)}/>
                    {toolBar}
                    <div ref="headerdiv" style={{marginLeft: "5px", border: "1px solid lightgrey", overflow: "hidden", background: "#F5F5F5", width: this.props.width}}>
                        <table className="ad-pivot-grid-table">
                            <thead>
                                <tr id="ad-pivot-grid-table-grouped-header">
                                    {this.state.groupedHeader}
                                </tr>
                                <tr id="ad-pivot-grid-table-grouped-header">
                                    {this.state.header}
                                </tr>
                                <tr>
                                    {this.state.filter}
                                </tr>
                            </thead>
                        </table>
                    </div>
                    {spinner}
                    <div ref="bodydiv" style={{marginLeft: "5px", border: "1px solid lightgrey", overflowY: "scroll", height: this.props.height, width: this.props.width}}
                        onscroll={this.onScroll.bind(this)}>
                    >
                        <table className="ad-pivot-grid-table" id="ad-pivot-grid-table-body">
                            <tbody>
                                {this.state.rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div>
                    {toolBar}
                    <AdPivotGridChart data={this.state.data} columns={this.state.columns} chartType="spline" />
                </div>
            );
        }
    }
}

AdPivotGrid.propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    groupedColumns: PropTypes.array,
    pivotRows: PropTypes.array,
    pivotColumns: PropTypes.array,
    height: PropTypes.string,
    width: PropTypes.string,
    onRowSelected: PropTypes.func,
    enableToolbar: PropTypes.bool,
    enableFilter: PropTypes.bool,
    onSaveData: PropTypes.func,
    infiniteScroll: PropTypes.bool,
    gridMode: PropTypes.bool.isRequired
}