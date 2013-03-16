---
layout: post
author: "Vladimir Penkin"
title: "Rake interactive"
date: 2012-09-09 23:13
comments: true
categories:
published: false
---

### Motivation
Motivation behind this task is something that bothers me for a long time.

I bet you running in this situation fairly often. I even find this in lines in [installation instructions](https://github.com/search?q=rake+db%3Acreate+%26%26+rake+db%3Amigrate&type=Everything&repo=&langOverride=&start_value=1) for ruby(rails) projects.

```bash
rake db:drop && rake db:create && rake db:migrate && rake db:seed
```

How many times rails environment is getting loaded? Let's count!

```bash
echo "puts 'oh, hai!'" >> config/application.rb
(rake db:drop && rake db:create && rake db:migrate && rake db:seed) | grep "oh, hai!" | wc -l
-> 4
```

4 times we are loading rails environment. But do we really need to load it all the time? what if we forgot to do 'rake stats'?

<!-- more -->

```bash
time rails runner ''
-> rails runner ''  11.57s user 1.48s system 97% cpu 13.324 total
```

Rails environment loads up for 11 seconds. 11 * 5 = 55. It is minute of waiting and staring at screen.

Can we do better? Of course!

### Rake interactive

Here is simple rake task that waiting for commands to execute.

```ruby
desc "Interactive rake console"
# Example
#   > db:create
task :interactive => :environment do
  puts "Please do not use in environments other than development" unless Rails.env.development?

  str = ''
  while str != 'exit'
    STDOUT.print '> '
    begin
      str = STDIN.gets
      str.gsub!(/\s+$/, '')
      if str == 'exit'
        break
      else
        Rake::Task[str].invoke
      end
    rescue RuntimeError => e
      STDOUT.puts "Don't know how to build task '#{str}'"
    end
  end
end
```

Of course this is very simple script, there is no support of history or chain execution. Can we do better?

```ruby
desc "Interactive rake console"
# Example
#   > db:create
task :interactive, [:script] => :environment do |t, args|
  puts "Please do not use in environments other than development" unless Rails.env.development?

  if args[:script].present?
    commands = args[:script].split("&&")
    commands.each do |command|
      command.strip!
      begin
        STDOUT.puts "Executing: #{command}"
        Rake::Task[command].invoke
      rescue RuntimeError => e
        STDOUT.puts "Don't know how to build task '#{command}'"
      end
    end
  end

  str = ''
  while str != 'exit'
    STDOUT.print '> '
      str = STDIN.gets
      str.strip!
      if str == 'exit'
        break
      else
        begin
          Rake::Task[str].invoke
        rescue RuntimeError => e
          STDOUT.puts "Don't know how to build task '#{str}'"
        end
      end
  end
end
```

This version accepts optional parameter - string of commands separated by &&

```bash
echo "puts 'oh, hai!'" >> config/application.rb
noglob rake interactive["db:drop && db:create && db:migrate",1]  | grep "oh, hai" | wc -l
  -> 1
time noglob rake interactive["db:drop && db:create && db:migrate",1]
  -> 13.14s user 1.60s system 94% cpu 15.646 total
```

Good eh? 11 seconds for rails to start and 2 more seconds for execute database tasks. Instead of 55 seconds.


### Is it the end?

There are few questions left with this script.
**Model or Tasks caching** - might be we need to implement something like **reload!** function in interactive console to reload rails models.

But the bigger question is that you might don't want to run **yet another rails instance** when you already running __rails server__ and __rails console__. There seems no problem with running Rake::Task['TASKNAME'].invoke from console. But you know what would be really cool? Run that from rails server!

I am not sure if this can be implemented. **gets** is blocking operation so while waiting for user input, we will block whole server. It might be possible with experimental rails projects like [async-rails](https://github.com/igrigorik/async-rails) or servers like unicorn or thin.

So if you have some idea how to do that, just let us know!


