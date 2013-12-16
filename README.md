# deco

Deep Cooperation

## For developers:

### Environment Setup Instruction

install ruby 2.0.0 with rubygem and go to project directory

~~~bash
bundle install
rack db:migrate
rackup
~~~

If you want to auto reload all contents for every request:

~~~bash
gem install shotgun
shotgun config.ru
~~~
