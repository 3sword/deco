sidekiq -r ./decoapp.rb -C config/sidekiq.yml -d -L log/sidekiq.log -P tmp/pids/sidekiq.pid
