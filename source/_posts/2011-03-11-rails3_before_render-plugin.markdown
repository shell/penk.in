---
layout: post
title: rails3_before_render plugin
categories: [rails plugin]
date: 2011-03-11 14:53
comments: true
---

  I've just released small plugin [rails3_before_render](<https://github.com/shell/rails3_before_render>). It adds a hook like <code>before_filter</code> to your controllers that gets executed between when your action is completed and the template is rendered.  It can really DRY up loading some data.

  Please be carefull using that. Regular <code>before/after/around</code> filters is enough for **most** of the tasks that you can imagine. If not you always call method directly, that will increase readability of your code. Use <code>before_render</code> in exceptional cases.

  [Here](<http://blog.davidchelimsky.net/wp-content/uploads/2010/11/duplication.pdf>) is good presentation by David Chelimsky about code duplication and DRY concept.

## Use case
  Mostly I've needed that plugin for my <code>mugen</code> gem.
``` ruby
class Mygengo::JobsController < Mygengo::MygengoController
  . . .
  def show
    @job = Mugen::Job.find(params[:id])
    @preview = Mugen::Job.preview(@job['job_id'])
    @comments = Mugen::Job.comments(@job['job_id'])
  . . .
end
```

  There is error check after each api request that populate <code>Mugen.errors</code> variable with messages. Every action of controller after all requests has been sent need to check that variable and populate flash messages with that. Without having plugin I used wrapper function like this:
``` ruby

# mygengo_controller.rb
def mygengo_requests
  yield
  parse_errrors
end

# jobs_controller
mygengo_requests do
  @job = Mugen::Job.find(params[:id])
  @preview = Mugen::Job.preview(@job['job_id'])
  @comments = Mugen::Job.comments(@job['job_id'])
end
```

<!-- more -->

  After 5-th action code duplication seems unreasonable. Regular filters like <code>before_filter</code> and <code>after_filter</code> didn't fit here. Errors parsing clearly needs to be executed right before rendering.

``` ruby
class Mygengo::MygengoController < ApplicationController
  before_render :parse_errrors
  . . .
```

  With that I could remove <code>mygengo_request</code> method along with wrapping each action in controller.

## before_render

  Before writing this plugin I have found [before_render](<https://github.com/xtoddx/before_render>) plugin by Todd Willey. Sadly it worked for rails 2.x only. Rails 3 brought us completely new architecture of ActionPack and as I have found even ActiveSupport had major changes. Callbacks module is now more efficient that is was before.

  New <code>ActiveSupport::Callbacks</code> methods were used, in analogy with ActionDispatch. That allowed me to escape reimplementing callback filter chains.

