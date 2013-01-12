#!/bin/sh

### CHROME EXTENSION BUILD SCRIPT ###
# Requirements:
# * Closure Compiler - Download from https://docs.google.com/viewer?url=http%3A%2F%2Fclosure-compiler.googlecode.com%2Ffiles%2Fcompiler-latest.zip and extract full folder to lib/
# * SASS - http://sass-lang.com/

if [ "$1" == "-d" ]; then
	echo "Compiling DEV extension"
else
	echo "Compiling extension"
fi

#Exit Shell Script on fail
set -e

echo "Checking for errors and compiling progress.js..."
rm -rf extension/js/
mkdir -p extension/js/

echo "Setting progress.js flags..."
sed -i.bak "s/chrome\: false/chrome\: true/g" js/progress.js
if [ "$1" != "-d" ]; then
	sed -i.bak "s/debug\: true/debug\: false/g" js/progress.js
fi
rm js/progress.js.bak

if [ "$1" != "-d" ]; then
	sed -i.bak 's/"name"\:.*/"name"\: "Progress Bar Timer",/g' extension/manifest.json
else
	sed -i.bak 's/"name"\:.*/"name"\: "\[DEV\] Progress Bar Timer",/g' extension/manifest.json
fi
rm extension/manifest.json.bak

echo "Compiling Javascript files..."
if [ "$1" != "-d" ]; then
	javascripts=(js/lib/jquery-1.8.2.min.js js/lib/jquery-ui.js js/lib/d3.v2.min.js js/lib/json2.js js/delta/modernizr-2.0.6.min.js js/globalize-master/lib/globalize.js js/lib/jquery-ui-timepicker-addon.js js/delta/custom.js js/progress.js)
	commands=$(for file in "${javascripts[@]}"; do echo "--js $file"; done)
java -jar lib/compiler-latest/compiler.jar --jscomp_off=suspiciousCode --js_output_file extension/js/progress.js $commands
else
	cp -rf js/* extension/js
	#java -jar lib/compiler-latest/compiler.jar --js_output_file extension/js/progress.js --js js/progress.js
fi

echo "Preparing progress.html..."
cp progress.html extension/progress.html
if [ "$1" != "-d" ]; then
	#Remove <script> tags for all compiled JS (except js/progress.js)
	for file in "${javascripts[@]}"; do 
		if [ "$file" != "js/progress.js" ]; then
		  sed -i.bak "s:^.*<script.*src=\"$file\".*::g" extension/progress.html;
		fi
	done
	rm extension/progress.html.bak
fi

echo "Compiling SCSS to CSS..."
mkdir -p extension/css/images
sass --style compressed dev/style.scss:extension/css/style.css

echo "Moving CSS files to extension folder..."
rm -rf extension/css/images/*
cp -r css/images/* extension/css/images


if [ "$1" != "-d" ]; then
	echo "Resetting progress.js debugging flag to true and chrome flag to false..."
	sed -i.bak "s/debug\: false/debug\: true/g" js/progress.js
	sed -i.bak "s/chrome\: true/chrome\: false/g" js/progress.js
	rm js/progress.js.bak
fi

echo "Moving images to extension folder..."
rm -rf extension/images/*
cp -r images extension/

echo "Cleaning filesystem..."
rm -f extension/.DS_Store
rm -f extension/manifest.json~

echo "Compressing extension to progress.zip..."
zip -r progress extension/*

echo "Chrome extension compiled successfully to progress.zip."
exit 0

