set -e

rm dist -rf

tsc -p tsconfig.app.json --noEmit && \
vite build && \
tsc -p tsconfig.app.json --declaration --emitDeclarationOnly --outDir ./dist

rm dist/tsconfig.app.tsbuildinfo
mv dist/src/* dist
rm dist/src -rf
