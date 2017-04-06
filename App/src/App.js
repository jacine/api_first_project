import React, {Component} from 'react';

import Form from './Form-Example';
import View from './View-Example';

class App extends Component {
  render() {
    return (
      <div>
        <Form />
        <View field_number="1"/>
      </div>
    );
  }
}

export default App;
