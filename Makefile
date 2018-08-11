.PHONY: build dev lint test

install: build
	git pull origin master
	pm2 start --env production

build: node_modules db.sqlite lint
	npx tsc

dev: db.sqlite build
	npx concurrently -k \
		-p "[{name}]" \
		-n "TypeScript,Node" \
		-c "yellow.bold,cyan.bold,green.bold" \
		"npx tsc -w" \
		"nodemon --inspect dist/index.js"

test: lint
	npx jest --forceExit --verbose --runInBand

db.sqlite: schema.sqlite
	cp schema.sqlite db.sqlite

lint:
	npx tslint -c tslint.json -p tsconfig.json

node_modules:
	yarn
