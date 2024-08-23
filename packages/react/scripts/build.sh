set -e

rm dist -rf

tsc --noEmit && \
vite build && \
tsc --declaration --emitDeclarationOnly -p tsconfig.build.json
