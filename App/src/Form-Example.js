import React, {Component} from 'react';


import IntegerTextField from './Components/Form/IntegerTextField';

import StringTextField from './Components/Form/StringTextField';


export default class extends Component {
  render() {
    return (
    <form>
    
      <div>
        <IntegerTextField name="field_number" />
      </div>
    
      <div>
        <StringTextField name="title" />
      </div>
    
 
      <input type="submit" value="Submit" />
    </form>
    );
  }
}
