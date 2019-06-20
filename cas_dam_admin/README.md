Initial commit for project

#Getting started:

Create virtual env:

`mkdir venv`
`cd venv`
`python3 venv -m .`

Before using/running:

`source ./venv/bin/activate`


#Third Party code
We're currently using Cory S.N. LaViska's jQuery file browser plugin (https://www.abeautifulsite.net/jquery-file-tree)
to manage browsing paths on slevin. (MIT License)

We are also using Lea Verou http://lea.verou.me's Stretchy.js to handle flexible text box sizes, using an MIT License

#Known issues:

Browsing the filesystem doesn't work in Safari if the browser sends a sessionid cookie. Delete it in the Storage tab of
the developer's console to fix the problem