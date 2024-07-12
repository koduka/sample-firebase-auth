FROM node:20.15.1-alpine3.20

RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh - && \
    source "$HOME/.shrc" && \
    pnpm config set store-dir "$HOME/.local/share/pnpm/store"
