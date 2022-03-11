#!/bin/bash
#------------------------------------------------------------------------------
# name: run_tests.sh
# author: Melody Griesen, jvgriese@ncsu.edu (personal: pikablue107@gmail.com)
# summary: A simple interface for running tests on cs-help-server
# description:
#   includes three stages:
#      - prep: launch the Docker container containing the test database
#               used during testing
#      - run: run unit tests. by default, includes coverage, but can be disabled
#      - down: teardown the DOcker container containing the test database
#   allows the user to configure which of these three stages to run
#   includes other QOL features such as:
#      - 
#
#


# determine how to run the program
prep="true"
run="true"
down="false"
coverage="true"
# if the user wants to run only certain tests, then hold them here
test_files=() # bash array

# Verbosity setting
verbosity=1 # 0=quiet, 1=normal, 2=verbose
# Function to log a message based on verbosity level
log() {
  # $1: level to print at
  # $2: message to print
  
  # if print level is <= log level, then print it
  if [ "$1" -le "$verbosity" ]; then
    printf "$2\n"
  fi
}
# Displays this at the beginning of each update to stdout
PROGNAME="run_tests.sh"
# Function to automate the above: start each printout with "./progname.sh: "
prog_echo() {
  if [ $verbosity -ge 2 ]; then
    log 2 "./$PROGNAME: $1"
  fi
}

# print out an optional error message, a usage message, and exit
usage() {
  exit_code=1
  # if 1st arg, print that
  if [ ! -z "$1" ]; then
    >&2 printf "error: %s\n" "$1"
  else
    # if no 1st arg, then exit successfully
    exit_code=0
  fi
  # print usage message
  >&2 printf "usage: ./run_tests.sh [ACTION] [OPTIONS...] [TEST_FILES...]\n\
  ACTION:
               setup test DB |   run tests   | teardown test DB  \n\
              -------------------------------------------------- \n\
    (default):       X       |       X       |                   \n\
              -------------------------------------------------- \n\
    prep:            X       |               |                   \n\
              -------------------------------------------------- \n\
    run:                     |       X       |                   \n\
              -------------------------------------------------- \n\
    down:                    |               |         X         \n\
              -------------------------------------------------- \n\
    all:             X       |       X       |         X         \n\
\n\
  OPTIONS:\n\
    -h  --help        :   prints out this usage message\n\
    -n  --no-coverage :   just run tests, not coverage\n\
    -v  --verbose     :   print updates on start/stop of each phase\n\
\n\
  TEST_FILES:\n\
    argument list of specific test files to run\n\
    note: will run beforeAll/beforeEach when test file \`require()\`s them\n\

examples:\n\
  ./run_tests.sh\n\
      ensure test container is running, then run all tests for coverage\n\
\n\
  ./run_tests.sh test/controllers/user.test.js\n\
      ensure test container is running, then run a single test file for coverage\n\
\n\
  ./run_tests.sh down\n\
      don't run any tests, just teardown the test container\n\
"

  # exit unsuccessfully
  exit $exit_code
}

# parse arguments
while [ $# -gt 0 ]; do
  # if argument provided, should be one of these
  case "$1" in

    # just prep tests, don't run them
    "prep")
      run="false"
      shift
      ;;

    # just run tests, don't prep them
    "run")
      prep="false"
      shift
      ;;

    # prep, run, teardown
    "all")
      down="true"
      shift
      ;;

    # just teardown tests
    "down")
      prep="false"
      run="false"
      down="true"
      shift
      ;;

    # don't run coverage
    "-n")
      coverage="false"
      shift
      ;;
    "--no-coverage")
      coverage="false"
      shift
      ;;

    # quiet verbosity
    "-q")
      verbosity=0
      shift
      ;;
    "--quiet")
      verbosity=0
      shift
      ;;

    # verbose
    "-v")
      verbosity=2
      shift
      ;;
    "--verbose")
      verbosity=2
      shift
      ;;

    # help
    "-h")
      usage
      ;;
    "--help")
      usage
      ;;

    # unknown flag
    -*)
      usage "unknown flag argument '$1'"
      ;;

    # default case: interpret as a file to run
    *)
      test_files+=("$1")
      shift
      ;;
  esac
done

# if we want to setup tests, do so
if [ $prep = "true" ]; then
  prog_echo "prepping Docker test DB..."
  docker-compose -f ../.github/docker-compose-mongo.yml up --build -d
  prog_echo "test prep done!\n"
fi

# if we want to run tests, do so
if [ $run = "true" ]; then
  prog_echo "running tests..."
  # determine npm target to run
  if [ $coverage = "true" ]; then
    script="coverage"
  else
    script="test"
  fi
  # if the user gave specific tests to run
  if [ ${#test_files[@]} -gt 0 ]; then
    # use the npm script that works with arguments
    # ex: test-args, coverage-args
    script="$script-args"
    # add on all of the test-files
    # this will now look like:
    # coverage-args test/controllers/user.controller.js
    script="$script ${test_files[@]}"
  fi
  # run that script
  npm run $script # intentionally no "" around $script, runs as multiple args
  prog_echo "tests done!\n"
fi

# if we want to teardown tests, do so
if [ $down = "true" ]; then
  prog_echo "tearing down Docker test DB..."
  docker-compose -f ../.github/docker-compose-mongo.yml down --volumes
  prog_echo "test teardown done!\n"
fi

# all done!
#prog_echo "done!"
