import React, {Component} from 'react';


import NumberInteger from './Components/View/NumberInteger';


export default class extends Component {
  render() {
    return (
    <div>
    
      <div>
        <NumberInteger name="field_number" value={this.props.field_number}/>
      </div>
    
    </div>
    );
  }
}
