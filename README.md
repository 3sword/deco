# DECO

Deep Cooperation

## For developers:

### Requirement

**DECO** is mainly build with [`ruby`](https://www.ruby-lang.org/), we use `2.0.0`, so you need to [install](https://www.ruby-lang.org/en/downloads/) it first.

Also, some front end libraries is used, we use [`nodejs`](http://nodejs.org/), please also [install](http://nodejs.org/download/) it.

After finish installation. then we need to install some useful tools:

~~~bash
$ bundle install --without production
$ npm install -g bower grunt-cli
$ npm install
~~~

**Notice**: we use PostgreSQL as production DB, and use sqlite3 as development DB. Also, we use [Redis](http://redis.io/) as the requirement of [Sidekiq](http://sidekiq.org/) for background tasks.

### Build DECO

**Build front end:**

~~~bash
$ bower install
$ grunt build
~~~
or for short:
~~~bash
$ sh buildfront.sh
~~~

**Set up Sidekiq for email sending tasks:**

(You can skip this part if you do not use or work with related feature)

Make sure you have Redis installed and its server running at default port.
~~~bash
$ sh sidekiq_start.sh
~~~
To stop:
~~~bash
$ sh sidekiq_stop.sh
~~~
You may need to create folders `log/` `tmp/pids/`

#### Development mode

**Setup database:**

~~~bash
$ rake db:migrate
~~~

**Run web server:**

~~~bash
$ rackup
~~~

If you want to auto reload all contents for every request:

~~~bash
$ shotgun config.ru
~~~

#### Production mode

**At first:**

~~~bash
$ bundle install #you can use '--without development' to skip development gems
~~~

**Setup database:**

In `config/environments.rb`, you can find:

~~~ruby
configure :production do
    set :database, "postgres://postgres:postgres@localhost/deco"
end
~~~

In this case you need a Postgresql server with username `postgres` and password `postgres`, then create a database named "deco" in this Postgresql server. You may also modify this connection string to adjust to your environment.

**Then:**

~~~bash
$ RACK_ENV=production rake db:migrate
~~~

**Run web server:**

You have many choices to run deco with a production server. Here is an easy way using [Thin](http://code.macournoyer.com/thin/):

~~~bash
$ thin start -e production -d #port will be 3000 by default, you can check thin usage to change it
~~~

The pid and log files will be created under `tmp` and `log` directories. To stop the Thin server:

~~~bash
$ thin stop
~~~

### Tips

~~~bash
$ shotgun config.ru
~~~
is very useful when developing, after you save some modification on the code, just refresh the webpage, all changes will be applied.

~~~bash
$ irb
2.0.0p353 :001 > require './decoapp.rb'
 => true 
2.0.0p353 :002 > 
~~~
This command will open interactive mode, you can then input some ruby statements like:
~~~bash
2.0.0p353 :002 > User.all
~~~
to execute some ruby codes, you can also do this when `shotgun` is running, using this to change some data and refresh the page, or check something after click some buttons on the web page, it is so easy.
