#!/bin/sh

set -eu

# Make sure that the postinstall script has run correctly
test -d tasks/lib/nose
grunt

# Okay, seems to be good. Lets test that the installation procedure works as well
# first, remove any artifacts
grunt clean
rm -rf tasks/lib/nose

# Okay, now this is how the stuff should seem when it's downloaded from npm
# Let's try to do a local install and check that it works
cp -r test/fixtures/exampleNewProject ../
cd ../exampleNewProject
npm install ../grunt-nose grunt

# that should have installed everything needed, lets test that!

# test that local version of nose was installed
test -d node_modules/grunt-nose/tasks/lib/nose

# test that a nose task can be run
grunt nose:exampleProject

# test that it generated a result file
test -f nosetests.xml

# ...and that the correct number of tests was run (and no failures)
grep tests=\"1\" nosetests.xml
grep errors=\"0\" nosetests.xml

# test that virtualenv works
virtualenv venv -p `which python`
. venv/bin/activate

# install the venv exclusive package we're testing against
pip install ../grunt-nose/test/fixtures/virtualenv_exclusive

# test the virtualenv
grunt nose:virtualenv

# test that external nose works
# first, remove the included nose
rm -rf node_modules/grunt-nose/tasks/lib/nose
# install real nose
pip install nose

grunt nose:externalNose

# Hurray, all good matey!
