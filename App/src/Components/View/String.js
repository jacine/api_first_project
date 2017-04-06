import React, {PropTypes} from 'react';

const String = () => {
  return this.props.value;
};

String.proptypes = {
  value: PropTypes.string,
};

export default String;
