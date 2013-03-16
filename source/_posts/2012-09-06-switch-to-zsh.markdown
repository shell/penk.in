---
layout: post
author: "Vladimir Penkin"
title: "Switching to zsh and why you should do it now"
date: 2012-09-06 23:13
comments: true
categories:
---

## Switching to zsh and why you should do it now

If you working with ruby or rails, there is big chance that you spending lots of time in console. Yeah you probably using already this wonderful project that helps you everyday called [iTerm2](http://www.iterm2.com/). But why don't make your work even more comfortable?!

*zsh* - is a shell designed for interactive use, although it is also a powerful scripting language. Many of the useful features of bash, ksh, and tcsh were incorporated into zsh; many original features were added

*oh-my-zsh!* - A community-driven framework for managing your zsh configuration. Includes 40+ optional plugins (rails, git, OSX, hub, capistrano, brew, ant, macports, etc), over 80 terminal themes to spice up your morning, and an auto-update tool so that makes it easy to keep up with the latest updates from the community

There is no reason why not to try it, automatic script will install everything for you. If you decide to stick up with good old configured bash, just run uninstallation script.

<!-- more -->

### Installation

Installation is deadly easy:

####  via `curl`

``` bash
curl -L https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh | sh
```

####  via `wget`

``` bash
wget --no-check-certificate https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | sh
```

If you have some troubles - manual installation is available.
After installation open up new console window and say "OH-MY-ZSH!"

All configuration is done via __.zshrc__ file.

### Features

*zsh* comes with a bunch of nifty functionality built in and  *oh-my-zsh* comes with handful of interesting plugins.

I will not explain how to enable them here, but roughly will go through best. You can find plugins in _~/.oh-my-zsh/plugins_ folder.

#### bundler

Plugin adds nifty shortcuts like:

* *bi* for 'bundle install'
* *be* for 'bundle exec'
* *bu* for 'bundle update'

Also it wrapps all regular commands that can require 'bundle exec' before them and add it for you. Now you will never need to run command twice, just because bundle wasn't setted up properly.

#### cloudapp by Zach Holman

[CloudApp](http://getcloudapp.com/) allows you to share images, links, music, videos and files. Usually you just drop files to icon and app automatically uploads them to cloud and drops short link into your clipboard. It automatically uploads screenshots from your desktop.

Plugin allows you to upload a file from the command line to CloudApp.

#### git

Adds lots of aliases to type less while using git. Something that you probably already setted up is: *ga*(git add), *gb*(git branch), *gc*(git commit).

One of my favorites are:

  * _ggpull_ - pulls current branch from server. Like 'git pull' but with current branch name
  * _ggpush_ - same as previous but for push
  * _ggpnp_ - doing pull and then push for current branch.


#### github!

Plugin adds nifty commands to manage your github repositories:

  * empty_gh - creates new repo from scratch. Adds README file and pushes to your account
  * new_gh - Used for directory not setted up for git yet. creates .gitignore and README files and pushes to github
  * exist_gh - use this one when github repo is setted up already you just want to add remote and push updates from here

#### osx

Some commands to rule your system:

  * tab() - opens up new tab in your terminal of choise(Terminal.app or iTerm2)
  * pfs() - returns path for selected item in finder
  * cdf() - cd's to selected item in finder
  * quick-look() - opens up file with quick-look

#### pow

[Pow](http://pow.cx/) is a zero-config Rack server for Mac OS X.

So this plugin adds few commands to rule that doomsday device:

  * kapow - a command that will restart an app
  * powit - makes symlink from current directory so it will be served by pow
  * kaput - view the standard out (puts) from any pow app

#### rails and rails3

Some aliases:

  * rc   - rails console
  * rg   - rails generate
  * rgm  - rails generate migration
  * rs   - rails server
  * rsd  - rails server --debug
  * mig='rake db:migrate'
  * roll='rake db:rollback'

#### textmate

Some aliasses:

  * et   - 'mate .'
  * mr   - Edit Ruby app in TextMate

#### vi-mode

One of my favorite plugins. Brings power of vim move/edit commands in console


But wait, it's not all! Most of plugins for particular tools(git, github, bundler, brew...) adds autocompletion for this commands.


### More information

Ryan Bates have wonderful screencast about oh-my-zsh
<http://railscasts.com/episodes/308-oh-my-zsh>

---
layout: post
author: "Vladimir Penkin"
title: "Switching to zsh and why you should do it now"
date: 2012-09-06 23:13
comments: true
categories:
---

## Switching to zsh and why you should do it now

If you working with ruby or rails, there is big chance that you spending lots of time in console. Yeah you probably using already this wonderful project that helps you everyday called [iTerm2](http://www.iterm2.com/). But why don't make your work even more comfortable?!

*zsh* - is a shell designed for interactive use, although it is also a powerful scripting language. Many of the useful features of bash, ksh, and tcsh were incorporated into zsh; many original features were added

*oh-my-zsh!* - A community-driven framework for managing your zsh configuration. Includes 40+ optional plugins (rails, git, OSX, hub, capistrano, brew, ant, macports, etc), over 80 terminal themes to spice up your morning, and an auto-update tool so that makes it easy to keep up with the latest updates from the community

There is no reason why not to try it, automatic script will install everything for you. If you decide to stick up with good old configured bash, just run uninstallation script.

### Installation

Installation is deadly easy:

####  via `curl`

``` bash
curl -L https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh | sh
```

####  via `wget`

``` bash
wget --no-check-certificate https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | sh
```

If you have some troubles - manual installation is available.
After installation open up new console window and say "OH-MY-ZSH!"

All configuration is done via __.zshrc__ file.

### Features

*zsh* comes with a bunch of nifty functionality built in and  *oh-my-zsh* comes with handful of interesting plugins.

I will not explain how to enable them here, but roughly will go through best. You can find plugins in _~/.oh-my-zsh/plugins_ folder.

#### bundler

Plugin adds nifty shortcuts like:

* *bi* for 'bundle install'
* *be* for 'bundle exec'
* *bu* for 'bundle update'

Also it wrapps all regular commands that can require 'bundle exec' before them and add it for you. Now you will never need to run command twice, just because bundle wasn't setted up properly.

#### cloudapp by Zach Holman

[CloudApp](http://getcloudapp.com/) allows you to share images, links, music, videos and files. Usually you just drop files to icon and app automatically uploads them to cloud and drops short link into your clipboard. It automatically uploads screenshots from your desktop.

Plugin allows you to upload a file from the command line to CloudApp.

#### git

Adds lots of aliases to type less while using git. Something that you probably already setted up is: *ga*(git add), *gb*(git branch), *gc*(git commit).

One of my favorites are:

  * _ggpull_ - pulls current branch from server. Like 'git pull' but with current branch name
  * _ggpush_ - same as previous but for push
  * _ggpnp_ - doing pull and then push for current branch.


#### github!

Plugin adds nifty commands to manage your github repositories:

  * empty_gh - creates new repo from scratch. Adds README file and pushes to your account
  * new_gh - Used for directory not setted up for git yet. creates .gitignore and README files and pushes to github
  * exist_gh - use this one when github repo is setted up already you just want to add remote and push updates from here

#### osx

Some commands to rule your system:

  * tab() - opens up new tab in your terminal of choise(Terminal.app or iTerm2)
  * pfs() - returns path for selected item in finder
  * cdf() - cd's to selected item in finder
  * quick-look() - opens up file with quick-look

#### pow

[Pow](http://pow.cx/) is a zero-config Rack server for Mac OS X.

So this plugin adds few commands to rule that doomsday device:

  * kapow - a command that will restart an app
  * powit - makes symlink from current directory so it will be served by pow
  * kaput - view the standard out (puts) from any pow app

#### rails and rails3

Some aliases:

  * rc   - rails console
  * rg   - rails generate
  * rgm  - rails generate migration
  * rs   - rails server
  * rsd  - rails server --debug
  * mig='rake db:migrate'
  * roll='rake db:rollback'

#### textmate

Some aliasses:

  * et   - 'mate .'
  * mr   - Edit Ruby app in TextMate

#### vi-mode

One of my favorite plugins. Brings power of vim move/edit commands in console


But wait, it's not all! Most of plugins for particular tools(git, github, bundler, brew...) adds autocompletion for this commands.


### More information

Ryan Bates have wonderful screencast about oh-my-zsh
<http://railscasts.com/episodes/308-oh-my-zsh>

---
layout: post
author: "Vladimir Penkin"
title: "Switching to zsh and why you should do it now"
date: 2012-09-06 23:13
comments: true
categories:
---

## Switching to zsh and why you should do it now

If you working with ruby or rails, there is big chance that you spending lots of time in console. Yeah you probably using already this wonderful project that helps you everyday called [iTerm2](http://www.iterm2.com/). But why don't make your work even more comfortable?!

*zsh* - is a shell designed for interactive use, although it is also a powerful scripting language. Many of the useful features of bash, ksh, and tcsh were incorporated into zsh; many original features were added

*oh-my-zsh!* - A community-driven framework for managing your zsh configuration. Includes 40+ optional plugins (rails, git, OSX, hub, capistrano, brew, ant, macports, etc), over 80 terminal themes to spice up your morning, and an auto-update tool so that makes it easy to keep up with the latest updates from the community

There is no reason why not to try it, automatic script will install everything for you. If you decide to stick up with good old configured bash, just run uninstallation script.

### Installation

Installation is deadly easy:

####  via `curl`

``` bash
curl -L https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh | sh
```

####  via `wget`

``` bash
wget --no-check-certificate https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | sh
```

If you have some troubles - manual installation is available.
After installation open up new console window and say "OH-MY-ZSH!"

All configuration is done via __.zshrc__ file.

### Features

*zsh* comes with a bunch of nifty functionality built in and  *oh-my-zsh* comes with handful of interesting plugins.

I will not explain how to enable them here, but roughly will go through best. You can find plugins in _~/.oh-my-zsh/plugins_ folder.

#### bundler

Plugin adds nifty shortcuts like:

* *bi* for 'bundle install'
* *be* for 'bundle exec'
* *bu* for 'bundle update'

Also it wrapps all regular commands that can require 'bundle exec' before them and add it for you. Now you will never need to run command twice, just because bundle wasn't setted up properly.

#### cloudapp by Zach Holman

[CloudApp](http://getcloudapp.com/) allows you to share images, links, music, videos and files. Usually you just drop files to icon and app automatically uploads them to cloud and drops short link into your clipboard. It automatically uploads screenshots from your desktop.

Plugin allows you to upload a file from the command line to CloudApp.

#### git

Adds lots of aliases to type less while using git. Something that you probably already setted up is: *ga*(git add), *gb*(git branch), *gc*(git commit).

One of my favorites are:

  * _ggpull_ - pulls current branch from server. Like 'git pull' but with current branch name
  * _ggpush_ - same as previous but for push
  * _ggpnp_ - doing pull and then push for current branch.


#### github!

Plugin adds nifty commands to manage your github repositories:

  * empty_gh - creates new repo from scratch. Adds README file and pushes to your account
  * new_gh - Used for directory not setted up for git yet. creates .gitignore and README files and pushes to github
  * exist_gh - use this one when github repo is setted up already you just want to add remote and push updates from here

#### osx

Some commands to rule your system:

  * tab() - opens up new tab in your terminal of choise(Terminal.app or iTerm2)
  * pfs() - returns path for selected item in finder
  * cdf() - cd's to selected item in finder
  * quick-look() - opens up file with quick-look

#### pow

[Pow](http://pow.cx/) is a zero-config Rack server for Mac OS X.

So this plugin adds few commands to rule that doomsday device:

  * kapow - a command that will restart an app
  * powit - makes symlink from current directory so it will be served by pow
  * kaput - view the standard out (puts) from any pow app

#### rails and rails3

Some aliases:

  * rc   - rails console
  * rg   - rails generate
  * rgm  - rails generate migration
  * rs   - rails server
  * rsd  - rails server --debug
  * mig='rake db:migrate'
  * roll='rake db:rollback'

#### textmate

Some aliasses:

  * et   - 'mate .'
  * mr   - Edit Ruby app in TextMate

#### vi-mode

One of my favorite plugins. Brings power of vim move/edit commands in console


But wait, it's not all! Most of plugins for particular tools(git, github, bundler, brew...) adds autocompletion for this commands.


### More information

Ryan Bates have wonderful screencast about oh-my-zsh
<http://railscasts.com/episodes/308-oh-my-zsh>

