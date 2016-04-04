BIN = ./node_modules/.bin
LIB = ./lib
LIBCOV = ./lib-cov
SCRIPTS = ./scripts
COVERAGE_REPORT = html-report
COMPLEXITY_REPORT = plato-report
TEST = ./test
COMPLETION_FILENAME = .bash_completion


# GETTING STARTED

define helpStarting
	@echo "Getting started:"
	@echo
	@echo "  make help              Prints this help."
	@echo "  make version           Prints version information about the game, MAGE and Node.js."
	@echo "  make all               Installs all dependencies and datastores (shortcut for deps, datastores and build)."
	@echo
	@echo "  make deps              Installs all dependencies (shortcut for deps-npm, deps-submodules and deps-component)."
	@echo "  make datastores        Creates datastores and runs all migrations up to the current version."
	@echo "  make build             Creates html/css/js builds for all apps."
	@echo "  make assets-index      Indexes assets fo all apps."
	@echo
	@echo "  make deps-npm          Downloads and installs all NPM dependencies."
	@echo "  make deps-component    Downloads and installs all external components."
	@echo "  make deps-submodules   Downloads updates on git submodules."
	@echo
endef

.PHONY: help version all deps deps-npm deps-submodules deps-component datastores build

help:
	@echo
	$(helpStarting)
	$(helpDevelopment)
	$(helpQuality)
	$(helpRunning)
	$(helpCleanup)

version:
	node . --version

all: deps datastores build assets-index

deps: deps-npm deps-submodules deps-component

deps-npm:
	mkdir -p node_modules
	npm install

deps-component:
	NODE_ENV="$(NODE_ENV),prtest" node . install-components

deps-submodules:
	@if [ -d .git ]; then git submodule update --init; else echo "Not a git repository, skipping submodules"; fi

datastores:
	@echo Creating databases...
	node . archivist-create
	@echo Migrating databases to current application version
	node . archivist-migrate

build:
	node . build

assets-index:
	node . assets-index

# DEVELOPMENT

define helpDevelopment
	@echo "Development:"
	@echo
	@echo "  make dev               Sets up the development environment (shortcut for dev-githooks and dev-autocomplete)."
	@echo
	@echo "  make dev-githooks      Sets up git hooks."
	@echo "  make dev-autocomplete  Sets up bash auto completion."
	@echo
endef

.PHONY: dev dev-githooks dev-autocomplete

dev: dev-githooks dev-autocomplete

dev-githooks:
	node $(SCRIPTS)/githooks.js

dev-autocomplete:
	node . completion --filename "$(COMPLETION_FILENAME)" --bash_completion ~/.bash_completion --save
	@echo
	@echo Tab completion is now installed for this project.
	@echo Please restart your shell or enter:
	@echo source ~/.bash_completion


# QUALITY

define helpQuality
	@echo "Quality:"
	@echo
	@echo "  make test              Runs all tests (shortcut for test-lint and test-unit)."
	@echo "  make report            Creates all reports (shortcut for report-complexity and report-coverage)."
	@echo
	@echo "  make test-lint         Lints every JavaScript and JSON file in the project."
	@echo "  make test-unit         Runs every unit test in $(TEST)."
	@echo "  make report-complexity Creates a Plato code complexity report."
	@echo "  make report-coverage   Creates a unit test coverage report."
	@echo
	@echo "  available variables when linting:"
	@echo "    filter=staged        Limits linting to files that are staged to be committed."
	@echo "    path=./some/folder   Lints the given path recursively (file or a folder containing JavaScript and JSON files)."
	@echo
endef

.PHONY: lint lint-all test report test-lint test-style test-component test-unit report-complexity report-coverage

# lint is deprecated
lint: test-lint
	@echo ">>> Warning: The make lint target has been deprecated, please change it to 'test-lint'."

# lint-all is deprecated
lint-all: test-lint
	@echo ">>> Warning: The make lint-all target has been deprecated, please change it to 'test-lint'."

test: test-lint test-style test-component test-unit
report: report-complexity report-coverage

define lintPath
	$(BIN)/jshint --config .jshintrc --extra-ext .json --reporter $(SCRIPTS)/lib/humanJshintReporter.js "$1"
endef

test-lint:
ifdef path
	$(call lintPath,$(path))
else
  ifdef filter
    ifeq ($(filter),staged)
	git diff --raw --name-only --cached --diff-filter=ACMR | grep -E '\.js(on)?$$' | xargs -I '{}' $(call lintPath,{})
    else
	$(error Unknown filter: $(filter))
    endif
  else
	$(call lintPath,.)
  endif
endif

define stylePath
	$(BIN)/jscs "$1"
endef

test-style:
ifdef path
	$(call stylePath,$(path))
else
  ifdef filter
    ifeq ($(filter),staged)
	git diff --raw --name-only --cached --diff-filter=ACMR | grep -E '\.js$$' | xargs -I '{}' $(call stylePath,{})
    else
	$(error Unknown filter: $(filter))
    endif
  else
	$(call stylePath,lib)
	$(call stylePath,www)
  endif
endif

test-component:
	@echo "Testing components"
	if [ -n "$$(./scripts/getApplicationComponentPaths.js)" ]; then $(BIN)/component-hint -r $$(./scripts/getApplicationComponentPaths.js); fi

test-unit:
# It's important to note: spaces before shell, tabs before make
  ifneq (,$(findstring production,$(NODE_ENV)))
	@echo You cannot run unit tests in production.
	@exit 1
  endif
	@echo Dropping databases...
	NODE_ENV="$(NODE_ENV),prtest" node . archivist-drop
	@echo Creating databases...
	NODE_ENV="$(NODE_ENV),prtest" node . archivist-create
	@echo Migrating databases to current application version
	NODE_ENV="$(NODE_ENV),prtest" node . archivist-migrate
	@echo "Removing builds" && rm -rf build
	NODE_ENV="$(NODE_ENV),prtest" node . show-config
	node . stop
	NODE_ENV="$(NODE_ENV),prtest" node $(TEST)

#
# Variables for test-mage
#
mage_repo := git+ssh://git@github.com:Wizcorp/mage.git
branch := develop
CURRENT_MAGE_VERSION = $(shell grep '    "mage": ' package.json | cut -d'"' -f4)

test-mage: clean
#
# We swap the MAGE version
#
	npm rm --save mage
	npm install --save $(mage_repo)#$(branch)

#
# We make all, then run the tests. Finally,
# we cleanup the MAGE version you wanted to test,
# re-install the one you are currently using, and
# finally exit with the test command's exit code
# (0 = success >0 = fail)
#
	$(MAKE) all test; \
	status=$$?; \
	npm rm --save mage; \
	npm install --save $(CURRENT_MAGE_VERSION); \
	exit $$status

report-complexity:
	$(BIN)/plato -r -d $(COMPLEXITY_REPORT) -l .jshintrc $(LIB)
	@echo Open $(COMPLEXITY_REPORT)/index.html in your browser

instrument:
	rm -rf "$(LIBCOV)"
	$(BIN)/istanbul instrument --output $(LIBCOV) --no-compact --variable global.__coverage__ $(LIB)

report-coverage: instrument
	$(BIN)/mocha -R mocha-istanbul --recursive $(TEST)
	@echo Open $(COVERAGE_REPORT)/index.html in your browser


# RUNNING

define helpRunning
	@echo "Running:"
	@echo
	@echo "  make start             Starts the application daemonized."
	@echo "  make stop              Stops the daemonized application."
	@echo "  make restart           Restarts the daemonized application."
	@echo "  make reload            Recycles all workers with zero-downtime (not to be used on version changes)."
	@echo "  make status            Prints the status of the daemonized application."
	@echo
endef

.PHONY: start stop restart reload status

start:
	node . start

stop:
	node . stop

restart:
	node . restart

reload:
	node . reload

status:
	node . status


# CLEANUP

define helpCleanup
	@echo "Cleanup:"
	@echo
	@echo "  make clean             Removes all builds, dependencies and reports."
	@echo
	@echo "  make clean-build       Removes all application builds."
	@echo "  make clean-deps        Removes components and node_modules."
	@echo "  make clean-report      Removes all reports."
	@echo
endef

.PHONY: clean clean-build clean-deps clean-report

clean: clean-build clean-deps clean-report

clean-build:
	@git ls-files build --error-unmatch > /dev/null 2>&1 && echo "Not removing build from repo" || echo "Removing build" && rm -rf build

clean-deps:
	@if [ -d ./node_modules ] && [ -d ./node_modules/mage ]; then echo "Making sure your MAGE app is not running" && $(MAKE) stop; fi
	@git ls-files node_modules --error-unmatch > /dev/null 2>&1 && echo "Not removing node_modules from repo" || echo "Removing node_modules" && rm -rf node_modules
	@git ls-files components --error-unmatch > /dev/null 2>&1 && echo "Not removing components from repo" || echo "Removing components" && rm -rf components

clean-report:
	@echo "Removing reports"
	rm -rf "$(LIBCOV)"
	rm -rf "$(COVERAGE_REPORT)"
	rm -rf "$(COMPLEXITY_REPORT)"

