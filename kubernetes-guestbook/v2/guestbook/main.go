package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "strings"
    "sync"
)
var mu sync.Mutex
var entries = make([]string, 0)

func main() {
    http.HandleFunc("/lrange/guestbook", func(w http.ResponseWriter, r *http.Request) {
        mu.Lock()
        defer mu.Unlock()
        w.Header().Set("Content-Type", "application/json")
        _ = json.NewEncoder(w).Encode(entries)
    })
    http.HandleFunc("/rpush/guestbook/", func(w http.ResponseWriter, r *http.Request) {
        value := strings.TrimPrefix(r.URL.Path, "/rpush/guestbook/")
        if value == "" {
            http.Error(w, "Entry cannot be empty", http.StatusBadRequest)
            return
        }
        mu.Lock()
        entries = append(entries, value)
        defer mu.Unlock()
        w.Header().Set("Content-Type", "application/json")
        _ = json.NewEncoder(w).Encode(entries)
    })
    http.HandleFunc("/info", func(w http.ResponseWriter, r *http.Request) {
        _, _ = fmt.Fprintln(w, "In-memory datastore")
    })
    http.HandleFunc("/env", func(w http.ResponseWriter, r *http.Request) {
        _, _ = fmt.Fprintln(w, "Guestbook environment endpoint")
    })
    http.Handle("/", http.FileServer(http.Dir("./public")))
    log.Println("Guestbook listening at :3000")
    log.Fatal(http.ListenAndServe(":3000", nil))
}
