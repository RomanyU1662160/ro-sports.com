# This file is generated by Nx.
#
# Build the docker image with `npx nx docker-build onestock-connector`.
# Tip: Modify "docker-build" options in project.json to change docker build args.
#
# Run the container with `docker run -p 3000:3000 -t onestock-connector`.
FROM docker.io/node:lts-alpine

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN addgroup --system onestock-connector && \
          adduser --system -G onestock-connector onestock-connector

COPY dist/apps/onestock-connector onestock-connector/
RUN chown -R onestock-connector:onestock-connector .

# You can remove this install step if you build with `--bundle` option.
# The bundled output will include external dependencies.
RUN npm --prefix onestock-connector --omit=dev -f install

CMD [ "node", "onestock-connector" ]
