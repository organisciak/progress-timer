#!/bin/sh

### CHROME EXTENSION BUILD SCRIPT ###
# Requirements:
# * Closure Compiler - Download from https://docs.google.com/viewer?url=http%3A%2F%2Fclosure-compiler.googlecode.com%2Ffiles%2Fcompiler-latest.zip and extract full folder to lib/
# * SASS - http://sass-lang.com/

#Exit Shell Script on fail
set -e

## 1. Compile JS using Closure compiler
echo "Checking for errors and compiling progress.js..."
mkdir -p extension/js/
#Set progress.js debugging flag to false
sed -i.bak "s/debug\: true/debug\: false/g" js/progress.js
rm js/progress.js.bak

#Array of all javascript files to compile
javascripts=(js/lib/jquery-1.8.2.min.js js/lib/jquery-ui.js js/lib/d3.v2.min.js js/lib/json2.js js/delta/modernizr-2.0.6.min.js js/globalize-master/lib/globalize.js js/lib/jquery-ui-timepicker-addon.js js/delta/custom.js js/progress.js)

commands=$(for file in "${javascripts[@]}"; do echo "--js $file"; done)
java -jar lib/compiler-latest/compiler.jar --js_output_file extension/js/progress.js $commands

## 2. Copy HTML to extension folder and modify to use compiles JS
echo "Preparing HTML..."
cp progress.html extension/progress.html
#Remove <script> tags for all compiled JS (except js/progress.js)
for file in "${javascripts[@]}"; do 
	if [ "$file" != "js/progress.js" ]; then
	  sed -i.bak "s:^.*<script.*src=\"$file\".*::g" extension/progress.html;
	fi
done
rm extension/progress.html.bak

## 3. Compile SCSS to compress CSS
echo "Compiling SCSS to CSS..."
mkdir -p extension/css/images
sass --style compressed dev/style.scss:extension/css/style.css

# Move CSS Files to extension folder
rm -rf extension/css/images/*
cp -r css/images/* extension/css/images

#Set progress.js debugging flag back to true
sed -i.bak "s/debug\: false/debug\: true/g" js/progress.js

echo "Chrome extension compiled successfully."
exit 0

