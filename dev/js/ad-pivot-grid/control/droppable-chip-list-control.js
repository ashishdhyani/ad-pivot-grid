'use strict';
import React, {Component, PropTypes} from 'react';
import ChipListItem from './dragagle-chip-list-item';

const target = {
    drop(props, monitor) {
        props.onDropped(monitor.getItem);
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

class ChipListControl extends Component {

    constructor(props) {
        super(props);
        this.onDelete = this.onDelete.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    onDelete(item) {
        this.props.onDelete(item);
    }

    renderItem(item) {
        return (
            <ChipListItem
                key={item.field}
                label={item.caption}
                id={item.field}
                onDelete={this.onDelete} />
        );
    }

    render() {

        const { connectDropTarget, isOver } = this.props;

        var items = null;
        if(this.props.items != null) {
            items = this.props.items.map(this.renderItem);
        }

        return connectDropTarget(
            <div style={{border:"1px solic lightgrey", borderRadius:"5px",overflowY:"scroll", marginRight:"5px", height: this.props.height}}>
                <h6 />
                {item}
                <h6 />
            </div>
        );
    }
}

ChipListControl.propTypes = {
    isOver: PropTypes.bool.isRequired
};

export default DropTarget('ChipListItem', target, collect)(ChipListControl);