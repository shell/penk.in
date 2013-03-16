---
layout: post
author: "Vladimir Penkin"
title: "TomDoc package for SublimeText2"
date: 2012-09-07 00:26
comments: true
categories:
---

## TomDoc package for SublimeText2

**TomDoc** - is a code documentation specification that helps you write precise documentation that is nice to read in plain text, yet structured enough to be automatically extracted and processed by a machine.

**SublimeText2** - is very powerfull text editor that are taking over TextMate right now.

So to promote writing of documentation in your company, one approach is to build tools around helping programmers write it!

<!-- more -->

**Motivation** for this plugin was to have fully functional TomDoc plugin.

You can find source code <https://github.com/shell/sublime-tomdoc>

### Installation

Right now package is not accepted to package manager source, so only way to install it is to go SublimeText2 packages directory and do:

```bash
git clone git@github.com:shell/sublime-tomdoc.git
```

### Usage

Pressing **ctrl+enter** on the previous line of method definition

```ruby
def hello a, b
end
```

results to

```ruby
# Public: Duplicate some text an arbitrary number of times.
#
# a -
# b -
#
# Returns the duplicated String.
def hello a, b

end
```

Works respectfully for all other supported constructions

Other usage way is to type 'tom' and hit **TAB** to generate default TomDoc skeleton text.

Plugin supports following constructions for TomDoc:

  * Method Documentation
  * Initialize method Documentation
  * Class/Module Documentation
  * Constants Documentation
  * Attributes

### What do you think?

Shoot us email if you have some problems with this plugin or want specific features
