#!/usr/bin/env ruby
# This script performs some operations to make KFM release ready

require 'fileutils'
include FileUtils
# Remove .svn directories
rm_rf Dir.["**/.svn/"]

# Remove some plugins
chdir("plugins"){ rm_rf(%w{codepress return_thumbnail})

# And last but not least, remove this script
rm_rf $0