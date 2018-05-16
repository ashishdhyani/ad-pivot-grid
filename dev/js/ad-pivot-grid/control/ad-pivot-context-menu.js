import React, {Component, PropTypes} from 'react';
import '../../styles/ad-pivot-context-menu-style.scss';

export default class ContextMenu extends React.Component {

    state = {
        visible: false
    };

    componentDidMount() {
        document.addEventListener('contextmenu', this._handleContextMenu);
        document.addEventListener('click', this._handleClick);
        document.addEventListener('scroll', this._handleScroll);
    }

    componentWillUnmount() {
        document.removeEventListener('contextmenu', this._handleContextMenu);
        document.removeEventListener('click', this._handleClick);
        document.removeEventListener('scroll', this._handleScroll);
    }

    _handleContextMenu = (event) => {
        event.preventDefault();

        this.setState({visible: true});

        const clickX = event.clientX;
        const clickY = event.clientY;
        const screenW = window.innerWidth;
        const screenH = windown.innerHeight;
        const rootW = this.root.offsetWidth;
        const rootH = this.root.offsetHeight;

        const right = (screenW - clickX) > rootW;
        const left = !right;
        const top = (screenH - clickY) > rootH;
        const bottom = !top;

        if(right) {
            this.root.style.left = `${clickX + 5}px`;
        }
        if(left) {
            this.root.style.left = `${clickX - rootW - 5}px`;
        }
        if(top) {
            this.toot.style.top = `${clickY + 5}px`
        }
        if(bottom) {
            this.root.style.top = `${clickY - rootH - 5}px`
        }
    };

    _handleClick = (event) => {
        const { visible } = this.state;
        const wasOutside = !(event.target.contains === this.root);

        if(wasOutside && visible) this.setState({visible: false});
    }

    _handleScroll = () => {
        const { visible } = this.state;

        if(visible) this.setState({visible: false});
    }

    onCopy(event) {
        this.pros.onCopy();
    }

    onCopyWithHeader(event) {
        this.props.onCopyWithHeader();
    }

    onExportToExcel(event) {
        this.props.onExportToExcel();
    }

    render() {
        const { visible } = this.state;

        return(visible || null) &&
            <div ref={ref => {this.root = ref}} className="contextMenu">
                <div className="contextMenu--option" onClick={this.onCopy.bind(this)}>Copy</div>
                <div className="contextMenu--option" onClick={this.onCopyWithHeader.bind(this)}>Copy with Header</div>
                <div className="contextMenu--seperator" />
                <div className="contextMenu--option" onClick={this.onExportToExcel.bind(this)}>Export To Excel</div>
            </div>
    };
}

ContextMenu.propTypes = {
    onCopy: PropTypes.func.isRequired,
    onCopyWithHeader: PropTypes.func.isRequired,
    onExportToExcel: PropTypes.func.isRequired
};