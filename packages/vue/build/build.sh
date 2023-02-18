set -e

rm dist -rf

vue-tsc -p tsconfig.app.json --noEmit && \
vite build && \
vue-tsc -p tsconfig.app.json --emitDeclarationOnly --outDir ./dist

rm dist/tsconfig.app.tsbuildinfo
mv dist/src/* dist
rm dist/src -rf
