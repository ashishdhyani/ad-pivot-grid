'use strict';
import React, {Component, PropTypes} from react;
import 'font-awesome/css/font-awesome.min.css';
import '../../styles/ad-pivot-grid-toggle-control.scss';
import ToggleControl from '../control/ad-pivot-grid-toggle-control';
import PivotOptionsView from './ad-pivot-grid-pivot-options';
import * as ExportHelper from '../helpers/ad-pivot-grid-export-helper';

export default class AdToolbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filterChecked: true,
            pivotingChecked: false,
            gridModeChecked: true,
            chartModeChecked: false,
            settingDisplay: "node",
            toolbarHeight: "31px",
            columnsSettingsDisplay: "none",
            columnSettingsHeight: "0px",
            pivotSettingsDisplay: "none"
        };

        this.onPivottingSettingChanged = this.onPivottingSettingChanged.bind(this);
        this.onFilterSettingChanged = this.onFilterSettingChanged.bind(this);
        this.onGridModeChanged = this.onGridModeChanged.bind(this);
        this.onChartModeChanged = this.onChartModeChanged.bind(this);
    }

    onExtractToExcel(event) {
        ExportHelper.tableToExcel("ad-pivot-grid-table-header", "ad-pivot-grid-table-body", "data", "export.xls");
    }

    onSettings(event) {
        if(this.state.settingDisplay == "none") {
            this.setState({settingDisplay: "block", tollbarHeight: "265px", columnsSettingsDisplay: "block", columnSettingsHeight: "200px"});
            if(this.state.pivotingChecked) {
                this.setState({pivotSettingsDisplay: "inline-block"});
            }
            this.props.onSettingsOpen(true);
        }
        else {
            this.setState({settingDisplay: "none", tollbarHeight: "31px", columnsSettingsDisplay: "none", columnSettingsHeight: "0px"});
            this.props.onSettingOpen(false);
        }
    }

    componentWillMount() {
        this.setState({chartModeChecked: !this.props.isGridMode, gridModeChecked: this.props.isGridMode});
        if(this.props.settingsOpen) {
            this.setState({settingDisplay: "block", toolbarHeight: "265px", columnsSettingsDisplay: "block", columnSettingsHeight: "200px"});
            if(this.state.pivotingChecked) {
                this.setState({pivotSettingsDisplay: "inline-block"});
            }
        }
        else {
            this.setState({settingDisplay: "none", tollbarHeight: "31px", columnsSettingsDisplay: "none", columnSettingsHeight: "0px"});
            this.props.onSettingOpen(false);
        }
    }

    onFilter(event) {

    }

    onPivotingSettingChanged(value) {
        if(value) {
            this.setState({pivotSettingDisplay: "inline-block", pivotingChecked: value});
        }
        else {
            this.setState({pivotSettingDisplay: "none", pivotingChecked: value});
        }

        this.props.onSetPivotEnabled(value);
    }

    onFilterSettingChanged(value) {
        this.setState({filterChecked: false});
        this.props.onSetFilterEnalbed(value);
    }

    onGridModeChanged(value) {
        this.state.chartModeChecked = !value;
        this.state.gridModeChecked = value;
        this.setState({gridModeChecked: value, chartModeChecked: !value});
        this.props.onSetGridMode(value);
    }

    
    onChartModeChanged(value) {
        this.state.chartModeChecked = value;
        this.state.gridModeChecked = !value;
        this.setState({gridModeChecked: !value, chartModeChecked: value});
        this.props.onSetChartMode(value);
    }

    onPivotByChanged(value) {
        if(this.props.onPivotByChanged !== undefined) {
            this.props.onPivotByChanged(value);
        }
    }

    onColumnsChanged(value) {
        if(this.props.onColumnsChanged !== undefined) {
            this.props.onColumnsChanged(value);
        }
    }

    onSave(value) {
        if(this.props.onSaveData !== undefined) {
            this.props.onSaveData();
        }
    }

    render() {

        var style = {"fontSize":"20px", marginTop: "5px", marginLeft: "10px", width:"25px",cursor:"pointer"};
        return (
            <div id="ad-pivot-grid-toolbar" style={{height: this.state.toolbarHeight}}>
                <div style={{marginBottom: "3px"}}>
                    <a id="dlink" style={{display: "none"}}></a>
                    <div className="fa fa-file-excel-o" style={style} onclick={this.onExtractToExcel}></div>
                    <div className="fa fa-gears" style={style} onclick={this.onSettings.bind(this)}></div>
                    <div className="fa fa-save" style={style} onclick={this.onSave.bind(this)}></div>
                </div>
                <div id="ad-pivot-grid-settings" style={{height: "31px", display: this.state.settingDisplay, border: "1px solid lightgrey", marginLeft: "5px"}}>
                    <ToggleControl label="Pivoting" onChange={this.onPivotingSettingChanged} checked={this.state.pivotingChecked} />
                    <ToggleControl label="Filters" onChange={this.onFilterSettingChanged} checked={this.state.filterChecked} />
                    <ToggleControl label="Grid Mode" onChange={this.onGridModeChanged} checked={this.state.gridModeChecked} />
                    <ToggleControl label="Chart Mode" onChange={this.onChartModeChanged} checked={this.state.chartModeChecked} />
                </div>
                <div id="ad-pivot-grid-column-settings" style={{height: this.state.columnSettingsHeight, display: this.state.columnSettingsDisplay, border: "1px solid lightgrey", marginLeft: "5px"}}>
                    <PivotOptionsView pivotBy={this.props.pivotBy}
                                    columns={this.props.columns}
                                    onPivotByChanged={this.onPivotByChanged.bind(this)}
                                    onColumnsChanged={this.onColumnsChanged.bind(this)}
                                    pivotDisplay={this.state.pivotSettingsDisplay}
                                    />
                </div>
            </div>
        );
    }
}

AdToolbar.propTypes = {
    pivotBy: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    onSetPivotEnabled: PropTypes.func,
    onSetFilterEnalbed: PropTypes.func,
    onPivotByChanged: PropTypes.func,
    onColumnsChanged: PropTypes.func,
    onSetChartMode: PropTypes.func,
    onSetGridMode: PropTypes.func,
    onSaveData: PropTypes.func,
    settingsOpen: PropTypes.bool,
    isGridMode: PropTypes.bool,
    onSettingOpen: PropTypes.func,
    uniqueName: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    enableSettings: PropTypes.bool
};