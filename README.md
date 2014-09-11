G.A.V.E.L
============

You'll need:

- node
- compass
- sass


Gulp must be installed globally in order to use the command line tools. *You may need to use `sudo`*


```
npm install -g gulp
```


The gulp-compass module relies on Compass already being installed on your system.

If you have bundler installed, simply run bundle to install dependencies from the `Gemfile`


```
bundle
```

Otherwise,


```
gem install sass
gem install compass --pre
```

### Install npm dependencies

```
npm install
```

This runs through all dependencies listed in `package.json` and downloads them
to a `node_modules` folder in your project directory.


## Launch

```
gulp
```
