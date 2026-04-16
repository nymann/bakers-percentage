dev:
    npx vite

run: build
    npx vite preview

build:
    npx tsc -b && npx vite build

test:
    npx vitest run

lint:
    npx eslint .
