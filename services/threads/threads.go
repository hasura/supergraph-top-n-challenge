package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"
	"context"
	"os"
	"io"

	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/getkin/kin-openapi/openapi3"
)

// Define a Thread struct to represent the thread data.
type Thread struct {
	ID      int    `json:"id" jsonschema:"title=The Thread ID"`
	Created time.Time `json:"created" jsonschema:"title=Time when thread is created"`
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
	connStr := GetEnvDefault("CONN_STR", "postgres://postgres:postgrespassword@localhost:8432/postgres")
	
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

// GetThreads retrieves a list of threads from the database.
func GetThreads(w http.ResponseWriter, r *http.Request) {
	limitStr := r.URL.Query().Get("limit")
	limit := 10 // Default limit

	if limitStr != "" {
		limit, _ = strconv.Atoi(limitStr)
	}

	query := fmt.Sprintf("SELECT * FROM threads ORDER BY created DESC LIMIT %d", limit)
	rows, err := db.Query(r.Context(), query)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var threads []Thread
	for rows.Next() {
		var thread Thread
		err := rows.Scan(&thread.ID, &thread.Created)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		threads = append(threads, thread)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(threads)
}

func OpenAPILoaderHandler(w http.ResponseWriter, r *http.Request) {
	// Specify the file path to your OpenAPI spec
	filePath := "open-api-spec.json"
 
	// Load the OpenAPI spec from the file
	loader := openapi3.NewLoader()
	_, err := loader.LoadFromFile(filePath)
 
	if err != nil {
	   http.Error(w, "Error loading OpenAPI spec", http.StatusInternalServerError)
	   return
	}
 
	file, err := os.Open(filePath)
	if err != nil {
		http.Error(w, "Error opening OpenAPI spec file", http.StatusInternalServerError)
		return
	}
	defer file.Close()

	// Set the response content type to JSON
	w.Header().Set("Content-Type", "application/json")

	// Copy the file's contents to the response writer
	_, err = io.Copy(w, file)
	if err != nil {
		http.Error(w, "Error serving OpenAPI spec", http.StatusInternalServerError)
		return
	}
 }

func main() {
	initDB()
	defer db.Close()

	router := mux.NewRouter()
	
	// Define the endpoint for retrieving threads.
	router.HandleFunc("/threads", GetThreads).Methods("GET")
	router.HandleFunc("/openapi-spec", OpenAPILoaderHandler)

	port := GetEnvDefault("PORT", "4001")
	fmt.Printf("Server is running on http://localhost:%s\n", port)
	http.Handle("/", router)

	server := &http.Server{
		Addr:         ":" + port,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	err := server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}
}
