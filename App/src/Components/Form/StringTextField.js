import React, {Component, PropTypes} from 'react';

class StringTextField extends Component {

  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});

    if (this.props.onChange !== undefined) {
      this.props.onChange(event.target.value);
    }
  }

  render() {
    if (this.props.name !== undefined) {
      return (
        <label>
          {this.props.name}
          <input type="text" value={this.state.value} onChange={ this.handleChange }/>
        </label>
      )
    }
    else {
      return (
        <input type="text" value={this.state.value} onChange={ this.handleChange }/>
      );
    }
  }

}

StringTextField.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func
};

export default StringTextField;
