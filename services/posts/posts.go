package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
	"context"

	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Post struct {
	ID        int       `json:"id"`
	Created   time.Time `json:"created"`
}

var db *pgxpool.Pool

func GetEnvDefault(key, defVal string) string {
	val, ex := os.LookupEnv(key)
	if !ex {
	  return defVal
	}
	return val
}

func initDB() {
	connStr := GetEnvDefault("CONN_STR", "postgres://postgres:postgrespassword@localhost:7432/postgres")
	var err error

	// Create a connection pool using pgx/v5.
	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		log.Fatal(err)
	}
	config.MaxConns = 50
	config.MinConns = 10
	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Fatal(err)
	}

	db = pool
}

func GetPostsByThreadId(w http.ResponseWriter, r *http.Request) {
	var requestBody struct {
		ID    int `json:"id"`
		Limit int `json:"limit"`
	}

	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if requestBody.ID == 0 {
		http.Error(w, "Thread ID cannot be zero", http.StatusBadRequest)
		return
	}

	limit := requestBody.Limit
	if limit == 0 {
		limit = 10 // Default limit
	}

	query := `
		SELECT id, created FROM posts
		WHERE thread_id = $1
		ORDER BY created DESC
		LIMIT $2
	`

	rows, err := db.Query(r.Context(), query, requestBody.ID, limit)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var post Post
		err := rows.Scan(&post.ID, &post.Created)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		posts = append(posts, post)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
}

func main() {
	initDB()
	defer db.Close()

	router := mux.NewRouter()

	// Define the endpoints for retrieving posts.
	router.HandleFunc("/posts", GetPostsByThreadId).Methods("POST")
	
	port := GetEnvDefault("PORT", "4002")
	fmt.Printf("Server is running on http://localhost:%s\n", port)
	http.Handle("/", router)

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	err := server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}
}
