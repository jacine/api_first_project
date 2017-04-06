import React, {PropTypes} from 'react';

const NumberInteger = (props) => {
  return (
    <span>
      {props.value}
    </span>
  );
};

NumberInteger.proptypes = {
  value: PropTypes.number
};

export default NumberInteger;
