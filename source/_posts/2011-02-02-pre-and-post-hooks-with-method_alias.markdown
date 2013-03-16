---
layout: post
title: Pre and post hooks for external libraries
categories: [ruby]
date: 2011-02-02 14:53
comments: true
---

Ever missing hooks in your favorite libraries? <code>before_filter</code> and <code>after_fileter</code> is not working outside rails?
Thanks to ruby awesomness it's never been an issue for programmers who know how to use <code>alias</code> or <code>alias_method</code>.

## Problem

Here I am, sitting in front of laptop, writing yet another API wrapper. As I get tired of ruby native [NET::HTTP](http://www.ruby-doc.org/stdlib/libdoc/net/http/rdoc/classes/Net/HTTP.html) requests and wanted to try something more explicit and gave a shot to [HTTParty](http://github.com/jnunemaker/httparty) by John Nunemaker. Syntax is very simple and I came with following code:

``` ruby
class Account < Client
  def stats(options={})
    self.get "/account/stats", :query => options
  end

  def balance(options={})
    self.get "/account/balance", :query => options
  end
  ...
```

But apparently interaction is not so easy as it seems. All authenticated calls must be signed. The process of signing include arguments that was passed to current method. So in every method that called, it needs sign data before sending:

``` ruby
class Account
  def stats(options={})
    self.get "/account/stats", :query => Mugen.set_params(options)
  end
  ...
  def balance(options={})
    self.get "/account/balance", :query => Mugen.set_params(options)
  end
  ...
```

Seems like unnecessary code duplication. Isn't this kind of thing that pre-hook is made for?
To solve this problem you diffinetly [shouldn't google](http://railstips.org/blog/archives/2010/10/14/stop-googling/) for that.

After digging httparty source code I haven't found some pre- or post- hooks. Seems like we need to do it ourselves.

<!-- more -->

## Cooking hooks with alias_methiod

Thanks to greatness of ruby, I can open and modify native or external classes:

``` ruby
# lib/mugen/httparty_extensions.rb
module HTTParty
  module ClassMethods
    alias :original_get :get

    # Inject pre GET hook
    def get(path, options={})
      path, options = before_get(path, options) if respond_to?(:before_get)
      original_get(path, options)
    end

  end
end
```

Ok now we have self-cooked <code>before_get</code> method that will be called before original HTTParty.get and will do the work:

``` ruby
class Client
  include HTTParty
  ...
  def self.before_get(path, options)
    options[:query] = Mugen.set_params(options[:query]) if options.has_key? :query
    [path, options]
  end
  ...
```


Remember to put <code>original_get</code> arguments back with last line

## Things to watch out

Be aware <code>alias</code> is keyword so there is no comma after name of new method. But <code>alias_method</code> is method version of alias.

Also do not crush others code. If I put <code>Mugen.set_params</code> in __<code>httparty_extensions.rb</code>__ this can easily break other code that rely on HTTParty.


<!-- Discovering new tricks in ruby is always fun. -->
