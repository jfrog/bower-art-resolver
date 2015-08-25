# bower-art-resolver
Artifactory resolver for Bower, a custom resolver dedicated to integrate with Artifactory.

## Installation
`npm install -g bower-art-resolver`

This resolver depends on [bower-art](https://github.com/JFrogDev/bower-art/tree/bower-poc); a temporary custom bower with the **pluggable resolvers mechanism** currently in [pending pull request](https://github.com/bower/bower/pull/1686).  

## Client Configuration

Edit your ~/.bowerrc and point the registry to Artifactory:
```json
{
  "registry": "http://<domain>/artifactory/api/bower/<bower-repo>"
}
```

For non Anonymous access:
```json
{
  "registry": "http://user:password@<domain>/artifactory/api/bower/<bower-repo>"
}
```
You can also use Artifactory encrypted password 

## Artifactory Configuring 

### Bower remote repository
1. Create a new remote repository and enter a repository key, e.g. bower-remote
2. Basic Settings -> URL e.g. https://github.com, https://bitbucket.org, http://remote.org/artifactory/api/vcs/vcs-repo, or enter your own custom vcs
3. Packages -> Check "Enable Bower Support" and enter your own bower registry url (by default https://bower.herokuapp.com)
4. Packages -> Check "Enable VCS Support", select git provider according to the relevant vcs from step 2
5. Save

### Bower local/virtual repository
1. Create a new local/virtual repository and enter a repository key, e.g. bower-local, bower-virtual
2. Packages -> Check "Enable Bower Support" and enter your bower registry url (by default https://bower.herokuapp.com)
3. Save

## Usage

Use the client to install packages from Artifactory, e.g. `bower install bootstrap`
