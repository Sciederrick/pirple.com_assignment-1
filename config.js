let environments = {}

environments.staging = {
  httpPort:3000,
  httpsPort:3001,
  envName:'staging'
}

environments.production = {
  httpPort:5000,
  httpsPort:5001,
  envName:'production'
}

//which environment was passed in the CLI?
let currentEnvironment = typeof process.env.NODE_ENV == 'string' ? process.env.NODE_ENV.toLowerCase():''

//Validate the input environment
let environmentToExport = typeof environments[currentEnvironment] == 'object'?environments[currentEnvironment]:environments.staging

module.exports = environmentToExport
