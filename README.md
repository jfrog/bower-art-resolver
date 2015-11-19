# bower-art-resolver
A custom Bower resolver dedicated to allow integration of Bower with Artifactory

## Installation
`npm install -g bower-art-resolver`

In order to use Bower with Artifactory you need 2 components (npm packages):

1. [bower-art-resolver](https://www.npmjs.com/package/bower-art-resolver) - A custom, pluggable Bower resolver which is dedicated to allow integratione of Bower with Artifactory.
2. [bower](https://www.npmjs.com/package/bower) - Bower version 1.5.0 and above.

## Client Configuration
Edit your ~/.bowerrc and add:
1. The *bower-art-resolver*.
2. The Artifactory URL as the first search URL.

```json
{
	"registry": {
	  "register": "https://bower.herokuapp.com",
	  "search": [
		"http://<domain>/artifactory/api/bower/<bower-repo>"
	  ]
	},
	"resolvers": [
	  "bower-art-resolver"
	]
}
```

For authenticated access, please add the user and password to Artifactory URL as follows:
```json
"search": [
  "http://user:password@<domain>/artifactory/api/bower/<bower-repo>"
]
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
