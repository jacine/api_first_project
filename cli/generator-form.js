const chalk = require('chalk');
const Generator = require('yeoman-generator');

const yeoman = require('yeoman-environment');
const env = yeoman.createEnv();
const _ = require('lodash');
require('dotenv').config();

const formMapping = require('./form.mapping');
const Drapi = require('./lib/Drapi');
const fs = require('fs');


// @todo Suggest a better temlate engine.
const Markup = require('markup-js');

class ApiFirstGenerator extends Generator {

  constructor(args, options) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, options);

    this.entityType = options.entityType;
    this.bundle = options.bundle;
    this.formMode = options.formMode;
  }

  prompting() {
    const done = this.async();
    const prompts = [
      // {
      //   type: 'input',
      //   name: 'message',
      //   message: 'Please put something',
      //   default: 'hello world!'
      // }
    ];

    this.prompt(prompts).then((props) => {
      this.props = props;
      // To access props later use this.props.someOption;

      const postData = {
        client_id: process.env.OAUTH_CLIENT_ID,
        username: process.env.OAUTH_USERNAME,
        password: process.env.OAUTH_PASSWORD,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        grant_type: 'password',
        scope: 'authenticated',
      };
      const hostname = "http://127.0.0.1:8888";
      Drapi.oAuthTokenRequest(hostname, postData)
        .then((bearerToken) => {
            return Drapi.fetchFormDisplay(hostname, this.options.entityType, this.options.bundle, this.options.formMode, bearerToken);
          }
        )
        .then((result) => {

            // @Fixme take into account the order.
            const FormComponent = `import React, {Component} from 'react';

{{requires}}
import {{name}} from '{{from}}';
{{/requires}}

export default class extends Component {
  render() {
    return (
    <form>
    {{components}}
      <div>
        <{{componentName}} name="{{name}}" />
      </div>
    {{/components}}
 
      <input type="submit" value="Submit" />
    </form>
    );
  }
}
`;

            const context = {};

            context.components = _.map(result.content, (value, key) => {
              if (formMapping.hasOwnProperty(value.type)) {
                return {
                  componentName: _(formMapping[value.type]).split('/').last(),
                  name: key,
                };
              }
            });

            context.requires = _.map(result.content, (value, key) => {
              const name = _(formMapping[value.type]).split('/').last();
              if (formMapping.hasOwnProperty(value.type)) {
                return {
                  name: name,
                  from: './Components/Form/' + name,
                };
              }
            });


            fs.writeFileSync(`../App/src/Form-${this.entityType}-${this.bundle}-${this.formMode}-Example.js`, Markup.up(FormComponent, context));
          }
        )
        .catch(console.error);

      done();
    });
  }

}

if (process.argv.length < 5) {
  console.error('You need to specify an entity type, bundle and form mode');
  process.exit(1);
}

const entityType = process.argv[2];
const bundle = process.argv[3];
const formMode = process.argv[4];

env.registerStub(ApiFirstGenerator, 'api-first:generator');
env.run('api-first:generator', {entityType, bundle, formMode}, () => {
});

