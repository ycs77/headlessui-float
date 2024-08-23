set -e

rm dist -rf

vue-tsc --noEmit && \
vite build && \
vue-tsc --declaration --emitDeclarationOnly -p tsconfig.build.json
