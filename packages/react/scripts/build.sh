set -e

rm dist -rf

tsc --noEmit && \
vite build && \
tsc --declaration --emitDeclarationOnly --outDir ./dist

rm dist/tsconfig.tsbuildinfo dist/*.d.ts
rm dist/test -rf
mv dist/src/* dist
rm dist/src -rf
