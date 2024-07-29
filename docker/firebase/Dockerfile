FROM ubuntu

RUN apt update && \
    apt install -y curl openjdk-21-jdk && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt install -y nodejs \
    npm install -g pnpm \
    pnpm config set store-dir "$HOME/.local/share/pnpm/store"

RUN pnpm add -g firebase-tools
# RUN apt update && \
#     apt install -y curl openjdk-21-jdk && \
#     curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
#     apt install -y nodejs

# RUN npm install -g firebase-tools pnpm