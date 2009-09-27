#!/usr/bin/bash
# This script performs some operations to make KFM release ready

# Remove .svn directories
find . -name .svn -exec rm -rf {} \;

# Remove some plugins
for plugin in codepress return_thumbnail
do
	rm -rf plugins/$plugin
done

# Remove some jquery files
rm -f j/jquery/jquery.impromptu.js

# And last but not least, remove the release scripts
rm -f release.sh release.rb
