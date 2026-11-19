FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY main.go .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -o guestbook main.go

FROM alpine:3.20
WORKDIR /app
COPY --from=builder /app/guestbook /app/guestbook
COPY public/index.html /app/public/index.html
COPY public/script.js /app/public/script.js
COPY public/style.css /app/public/style.css
EXPOSE 3000
CMD ["./guestbook"]
