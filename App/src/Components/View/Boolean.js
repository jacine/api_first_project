import React, {PropTypes} from 'react';

const Boolean = () => {
  if (this.props.value) {
    return '✔';
  }
  else {
    return '✖';
  }
};

Boolean.proptypes = {
  value: PropTypes.bool,
};

export default Boolean;
