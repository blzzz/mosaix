'use strict';

import React from 'react';

class FieldComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { value: props.value, counts: false };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.value !== this.state.value) {
      this.props.onFieldChange && this.props.onFieldChange(this.state.value);
      if (this.state.value === '') {
        this.setToUncountable();
      }
    }
  }

  setToCountable() {
    this.setState( {counts:true} );
  }

  setToUncountable() {
    this.setState( {counts:false} );
  }

  render() {
    return (
      <td className={`field-component ${this.state.counts ? 'counting' : ''}`}>
        <div>
          <select value={this.state.value} ref="select" onChange={ () => { this.setState({ value:this.refs.select.value }) } }>
            <option value=""></option>
            <option value="cross">&#10005;</option>
            <option value="circle">&#9711;</option>
            <option value="triangle">&#9653;</option>
          </select>
        </div>
      </td>
    );
  }
}

FieldComponent.displayName = 'FieldComponent';

// Uncomment properties you need
// FieldComponent.propTypes = {};
// FieldComponent.defaultProps = {};

export default FieldComponent;
