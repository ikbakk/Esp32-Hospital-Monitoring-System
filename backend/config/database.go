package config

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"

	"ward-monitor-backend/pkg/constants"
)

var DB *pgxpool.Pool

func SetUpDatabaseConnection() *pgxpool.Pool {
	if os.Getenv("APP_ENV") != constants.ENUM_RUN_PRODUCTION {
		if err := godotenv.Load(".env"); err != nil {
			panic("Error loading .env file")
		}
	}

	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbHost := os.Getenv("DB_HOST")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")
	sslMode := os.Getenv("DB_SSLMODE") // Supabase requires: "require"

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		dbHost, dbUser, dbPass, dbName, dbPort, sslMode,
	)

	config, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		log.Fatalf("❌ Unable to parse DSN: %v\n", err)
	}

	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Fatalf("❌ Unable to connect to database: %v\n", err)
	}

	DB = pool
	log.Println("✅ Connected to Supabase Postgres via pgxpool")

	return pool
}

func CloseDatabaseConnection() {
	if DB != nil {
		DB.Close()
		log.Println("🔌 Database connection closed")
	}
}

func ListenForPatientUpdates() error {
	// TODO: implement pgx LISTEN/NOTIFY logic here
	return nil
}
