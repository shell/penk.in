---
layout: post
author: "Vladimir Penkin"
title: "Sinatra template"
date: 2012-07-27 18:18
comments: true
categories: sinatra
---

Recently I found myself doing a couple of very simple services for my cliens with Sinatra. Just some basic authentication, <code>active_record</code> and <code>mysql2</code> database, few forms, rails view helpers. There is a lot of guides and tutorials around internet. But it seems that there is no good Sinatra template  with testing coverate, basic files structure, etc.

So I made one! [Sinatra Template](<https://github.com/shell/sinatra-template>)

## Features

    * HTTP basic authentication
    * ActiveRecord orm
    * Sqlite3 for development, Mysql2 for production
    * 2 very basic but associated models
    * HAML, blueprint, jquery
    * User and Admin interfaces
    * Scroller with products
    * Full rake tasks for db management(hacked sinatra-activerecord gem)
    * Testing suite out of the box(RSpec)
    * Some essential Rails helpers
    * Ready for deploy with passenger(config/setup_load_paths.rb)

Some prefer to extract controllers, models and helpers in corresponding folders and split them over files. It is a matter of taste. If you have that much code, consider using Rails instead.

Enjoy
