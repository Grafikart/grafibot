.PHONY: install
install:
	git pull origin master
	make build
	pm2 start --env production

.PHONY: build
build: node_modules db.sqlite
	npx tsc

.PHONY: dev
dev: db.sqlite build
	npx concurrently -k \
		-p "[{name}]" \
		-n "TypeScript,Node" \
		-c "yellow.bold,cyan.bold,green.bold" \
		"npx tsc -w" \
		"nodemon --inspect dist/index.js"

.PHONY: test
test: lint
	npx jest --forceExit --verbose --runInBand

.PHONY: wtest
wtest: lint
	npx jest --forceExit --verbose --runInBand --watchAll

.PHONY: lint
lint:
	npx prettier-standard --format "**/*.ts"

db.sqlite: schema.sqlite
	cp schema.sqlite db.sqlite

node_modules:
	yarn
