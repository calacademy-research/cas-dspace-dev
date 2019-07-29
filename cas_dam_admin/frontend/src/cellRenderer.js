import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// Make empty cells grey
export default class customCellRenderer extends PureComponent {
  render () {
    const {
          cell, row, col, attributesRenderer,
          className, style, onMouseDown, onMouseOver, onDoubleClick, onContextMenu
        } = this.props;

    const {colSpan, rowSpan} = cell;
    const attributes = attributesRenderer ? attributesRenderer(cell, row, col) : {};
    let cellStyle = style;
    if(this.props.cell.verified === true){
        //cellStyle = {backgroundColor: 'green'}
        //cellStyle = {backgroundColor: '#00c851'}
        cellStyle = {backgroundColor: '#28a745'}
    } else if (this.props.row === 0) {
      cellStyle = {backgroundColor: '#e3e3e3'}
    } else if (cell.value === '') {
      cellStyle = {backgroundColor: '#d7d7b2'}
    } else {
      cellStyle = this.props.style;
    }

    return (
      <td
        className={className}
        onMouseDown={onMouseDown}
        onMouseOver={onMouseOver}
        onDoubleClick={onDoubleClick}
        onTouchEnd={onDoubleClick}
        onContextMenu={onContextMenu}
        colSpan={colSpan}
        rowSpan={rowSpan}
        style={cellStyle}
        {...attributes}
      >
        {this.props.children}
      </td>
    )
  }
}

customCellRenderer.propTypes = {
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  editing: PropTypes.bool,
  updated: PropTypes.bool,
  attributesRenderer: PropTypes.func,
  onMouseDown: PropTypes.func.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};

customCellRenderer.defaultProps = {
  selected: false,
  editing: false,
  updated: false,
  attributesRenderer: () => {}
};