.PHONY: deploy
deploy: ## Déploie une nouvelle version du site
	ssh -A grafikart 'cd grafibot && git pull origin master && make install'

.PHONY: install
install:
	git pull origin master
	make build
	pm2 start --env production ecosystem.config.cjs

.PHONY: build
build: node_modules
	npx tsc --noEmit
	npx esbuild src/index.ts --bundle --platform=node --target=node16.3.0 --outfile=dist/index.js --external:./node_modules/* --format=esm

.PHONY: dev
dev: build
	npx concurrently -k \
		-p "[{name}]" \
		-n "TypeScript,Node" \
		-c "yellow.bold,cyan.bold,green.bold" \
		"npx tsc -w" \
		"npx nodemon --inspect dist/index.js"

.PHONY: test
test: lint
	npx jest --forceExit --verbose --runInBand

.PHONY: wtest
wtest: lint
	npx jest --forceExit --verbose --runInBand --watchAll

.PHONY: lint
lint:
	npx prettier-standard --format "**/*.ts"

node_modules:
	pnpm i
