# bower-art-resolver
A custom Bower resolver dedicated to allow integration of Bower with Artifactory

## Installation
`npm install -g bower-art-resolver`

In order to use Bower with Artifactory you need 2 components (npm packages):

1. [bower-art-resolver](https://www.npmjs.com/package/bower-art-resolver) - A custom, pluggable Bower resolver which is dedicated to allow integratione of Bower with Artifactory.
2. [bower](https://www.npmjs.com/package/bower) - Bower version 1.5.0 and above.

## Client Configuration
Edit your ~/.bowerrc and add Artifactory Bower Resolver
```json
{
  "resolvers": [
    "bower-art-resolver"
  ]
}
```
Edit your ~/.bowerrc and point the registry to Artifactory:
```json
{
  "registry": "http://<domain>/artifactory/api/bower/<bower-repo>"
}
```

For authenticatednon access
```json
{
  "registry": "http://user:password@<domain>/artifactory/api/bower/<bower-repo>"
}
```
You can also use an encrypted Artifactory password.

## Artifactory Configuration

### Bower remote repository
1. Create a new remote repository and set its Package Type to be “Bower”. You might call it “bower-remote”
2. Set the Repository Key value, and enter the SCM URL e.g. https://github.com, https://bitbucket.org, http://remote.org/artifactory/api/vcs/vcs-repo, or enter your own custom VCS.
3. In the Bower Settings section, select GitHub as the Git Provider, and leave the default Registry URL (https://bower.herokuapp.com).
5. Finally, click "Save & Finish"

### Bower local/virtual repository
1. Create a new local/virtual repository and enter a repository key. For example, "bower-local" or "bower-virtual".
2. Packages -> Check "Enable Bower Support" and enter your bower registry url (by default https://bower.herokuapp.com)
3. Save

## Usage

Use the client to install packages from Artifactory, For example, `bower install bootstrap`

For more information, please refer to the [Artifactory User Guide](http://www.jfrog.com/confluence/display/RTF/Bower+Repositories)
