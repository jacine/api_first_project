
if (process.argv.length < 6) {
  console.error('You have to specify the HOSTNAME client_id username and password');
  process.exit(1);
}

const hostname = process.argv[2];
const client_id = process.argv[3];
const username = process.argv[4];
const password = process.argv[5];

const postData = {
  client_id: client_id,
  username: username,
  password: password,
  grant_type: 'password',
  scope: 'authenticated',
  // @fixme this should use the same password ¯\_(ツ)_/¯.
  client_secret: password,
};

oAuthTokenRequest(hostname, postData)
  .then((oauthResult) => {
    const bearerToken = BearerToken.create(oauthResult);

    return fetchFormDisplay(hostname, 'node', 'article', 'default', bearerToken);
  });



