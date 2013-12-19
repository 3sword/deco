# deco

Deep Cooperation

## For developers:

### Requirement

**Deco** is mainly build with [`ruby`](https://www.ruby-lang.org/), we use `2.0.0`, so you need to [install](https://www.ruby-lang.org/en/downloads/) it first.

Also, some front end libraries is used, we use [`nodejs`](http://nodejs.org/), please also [install](http://nodejs.org/download/) it.

After finish installation. then we need to install some useful tools:

~~~bash
$ bundle install
$ npm install -g bower grunt-cli
$ npm install
~~~

### Build Deco

build front end:

~~~
$ bower install
$ grunt build
~~~

run backend:

~~~bash
$ rake db:migrate
$ rackup
~~~

If you want to auto reload all contents for every request:

~~~bash
gem install shotgun
shotgun config.ru
~~~
