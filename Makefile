.PHONY: build dev lint test

build: db.sqlite lint
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
