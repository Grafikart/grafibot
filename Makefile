.PHONY: deploy
deploy: ## Déploie une nouvelle version du site
	ssh -A grafikart 'cd grafibot && git pull origin master && make install'

.PHONY: install
install:
	git pull origin master
	pm2 start --env production ecosystem.config.cjs

.PHONY: dev
dev:
	bun --watch src/index.ts

.PHONY: test
test: lint
	npm run test

.PHONY: wtest
wtest: lint
	npx jest --forceExit --verbose --runInBand --watchAll

.PHONY: lint
lint:
	npx prettier --write .

node_modules:
	pnpm i
