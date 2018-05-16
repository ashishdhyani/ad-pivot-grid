'use strict';
import React, {Component, PropTypes} from 'react';
import { DragSource } from 'react-dnd';
import '../../styles/ad-pivot-grid-chip-list-style-scss';

const source = {
    beginDrag(props) {
        return { id: props.id, name: props.label };
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging
    }
}

class ChipListItem extends Component {

    handleRequestDelete(key) {
        this.props.onDelete(this.props.id);
    }

    render() {
        const { connectDragSource, isDragging } = this.props;

        return connectDragSource(
            <div key={this.props.id} className="chip-list-item">
                &nbsp;&nbsp;{this.props.label}
                <div className="chip-list-item.close" onClick={this.handleRequestDelete.bind(this)}>x</div>
            </div>
        );
    }
}

ChipListItem.propsType = {
    connectDragSource: PropTypes.fucn.isRequired,
    isDragging: PropTypes.bool.isRequired
}

export default DragSource('ChipListItem', source, collect)(ChipListItem);