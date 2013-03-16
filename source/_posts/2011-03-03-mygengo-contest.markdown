---
layout: post
title: myGengo Api Labs Contest
categories: [ruby]
date: 2011-03-03 14:53
comments: true
---

Starting from a new years holidays I have participated in [myGengo Api Labs](http://mygengo.com/services/api/lab/)

3 Things I have developed so far:

__Mugen__ - ruby wrapper for myGengo API, based on <code>httparty</code>. Also include generators of nested rails app that provides basic interface. I have took a look on existing wrapper provided by myGengo Team, which was not very clear and rubyish way. Also it's been a while since I wanted to try <code>httparty</code> gem by John Nunemaker. [GitHub](<https://github.com/shell/mugen>)
[Mygengo Plugin page](<http://mygengo.com/services/api/plugins/details/ruby-on-rails/>)

<!-- more -->

  Install it now with :
``` bash
$ gem install mugen
$ rails generate mugen
```
<br />
<img src="/images/screen-mugen.png" alt="mugen" class="post-img" />

__Radiant-cms extension__ - Is also using <code>mugen</code> to talk to myGengo servers. This extension integrates to your administration interface to set up jobs for translation. Translations can easily be stored in your database and inserted in your content. [Extension page](<http://ext.radiantcms.org/extensions/260-mygengo>), [GitHub](<https://github.com/shell/radiant-mygengo-extension>)
[Mygengo Plugin page](<http://mygengo.com/services/api/plugins/details/radiant/>)

  Radiant installation:
``` bash
$ script/extension install mygengo
```

<br />
<img src="/images/screen-radiant-extension.png" alt="mugen" class="post-img"/>

__Zend Framework plugin__ - it took 2 days of hardcore digging in ZF documentation and coding all that classes in PHP. But I nailed it. Installation instructions for existing zf apps as well as quickstart guide available in [readme](<https://github.com/shell/zf-mygengo/blob/master/README.md>). [GitHub](<https://github.com/shell/zf-mygengo>)
[Mygengo Plugin page](<http://mygengo.com/services/api/plugins/details/zend-framework/>)

Check out [Winners page](<http://mygengo.com/services/api/lab/winners/>)
