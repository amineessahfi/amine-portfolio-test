FROM debian:bookworm-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      bash \
      coreutils \
      findutils \
      gawk \
      grep \
      less \
      nano \
      procps \
      sed \
      tree && \
    rm -rf /var/lib/apt/lists/*

RUN useradd --create-home --uid 1000 --shell /bin/bash sandbox

COPY sandbox-image/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod 755 /usr/local/bin/entrypoint.sh

ENV TERM=xterm-256color \
    HOME=/home/sandbox

WORKDIR /home/sandbox
USER sandbox

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
