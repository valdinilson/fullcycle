# Challenge 1: Docker - GOLANG

# Step One - Builder

FROM golang AS builder

WORKDIR /usr/src/app

COPY main.go .

RUN CGO_ENABLED=0 go build -o build/challenge -ldflags "-s -w" main.go

# Step Two - Final Image

FROM scratch

WORKDIR /opt/fullcycle

COPY --from=builder /usr/src/app/build .

ENTRYPOINT [ "./challenge" ]
