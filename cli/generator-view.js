const chalk = require('chalk');
const Generator = require('yeoman-generator');

const yeoman = require('yeoman-environment');
const env = yeoman.createEnv();
const _ = require('lodash');

const viewMapping = require('./view.mapping');
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
    this.viewMode = options.viewMode;
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
        client_id: 'f9d83041-3012-4d65-b466-60bd6a48c747',
        username: 'admin',
        password: 'test',
        grant_type: 'password',
        scope: 'authenticated',
        client_secret: 'test',
      };
      const hostname = "http://127.0.0.1:8888";
      Drapi.oAuthTokenRequest(hostname, postData)
        .then((bearerToken) => {
            return Drapi.fetchViewDisplay(hostname, this.options.entityType, this.options.bundle, this.options.viewMode, bearerToken);
          }
        )
        .then((result) => {
            // @Fixme take into account the order.
            const ViewComponent = `import React, {Component} from 'react';

{{requires}}
import {{name}} from '{{from}}';
{{/requires}}

export default class extends Component {
  render() {
    return (
    <div>
    {{components}}
      <div>
        <{{componentName}} name="{{name}}" value={this.props.{{name}}}/>
      </div>
    {{/components}}
    </div>
    );
  }
}
`;

            const context = {};

            context.components = _.filter(_.map(result.content, (value, key) => {
              if (viewMapping.hasOwnProperty(value.type)) {
                return {
                  componentName: _(viewMapping[value.type]).split('/').last(),
                  name: key,
                };
              }
            }), (value) => value !== undefined);

            context.requires = _.filter(_.map(result.content, (value, key) => {
              const name = _(viewMapping[value.type]).split('/').last();
              if (viewMapping.hasOwnProperty(value.type)) {
                return {
                  name: name,
                  from: './Components/View/' + name,
                };
              }
            }), (value) => value !== undefined);


            fs.writeFileSync("../App/src/View-Example.js", Markup.up(ViewComponent, context));
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
const viewMode = process.argv[4];

env.registerStub(ApiFirstGenerator, 'api-first:generator');
env.run('api-first:generator', {entityType, bundle, viewMode}, () => {
});

