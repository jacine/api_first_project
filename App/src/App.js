import React, {Component} from 'react';

import Form from './Form-node-simple_article-default-Example';
import View from './View-node-simple_article-default-Example';

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
