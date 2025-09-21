package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	// "github.com/samber/do"
	"ward-monitor-backend/config"
	// "ward-monitor-backend/middlewares"
	// "ward-monitor-backend/modules/auth"
	// "ward-monitor-backend/modules/user"
	// "ward-monitor-backend/providers"
	// "ward-monitor-backend/script"

	"github.com/common-nighthawk/go-figure"
	"github.com/gin-gonic/gin"
)

// func args(injector *do.Injector) bool {
// 	if len(os.Args) > 1 {
// 		flag := script.Commands(injector)
// 		return flag
// 	}
//
// 	return true
// }

func run(server *gin.Engine) {
	server.Static("/assets", "./assets")

	port := os.Getenv("GOLANG_PORT")
	if port == "" {
		port = "8888"
	}

	var serve string
	if os.Getenv("APP_ENV") == "localhost" {
		serve = "0.0.0.0:" + port
	} else {
		serve = ":" + port
	}

	myFigure := figure.NewColorFigure("Caknoo", "", "green", true)
	myFigure.Print()

	if err := server.Run(serve); err != nil {
		log.Fatalf("error running server: %v", err)
	}
}

func main() {
	// 1️⃣ Setup DI
	// injector := do.New()
	// providers.RegisterDependencies(injector)
	//
	// if !args(injector) {
	// 	return
	// }

	// 2️⃣ Setup pgx database connection
	db := config.SetUpDatabaseConnection()
	defer config.CloseDatabaseConnection()

	conn, err := db.Acquire(context.Background())
	if err != nil {
		log.Fatalf("Cannot acquire db connection: %v", err)
	}
	defer conn.Release()

	if err := conn.Conn().Ping(context.Background()); err != nil {
		log.Fatalf("Cannot ping database: %v", err)
	}

	// Optional test ping
	if err := db.Ping(context.Background()); err != nil {
		log.Fatalf("❌ Cannot ping database: %v", err)
	}

	// 3️⃣ Optional: start realtime listener for patients/readings
	go func() {
		if err := config.ListenForPatientUpdates(); err != nil {
			log.Fatal(err)
		}
	}()

	// 4️⃣ Setup Gin
	server := gin.Default()
	// server.Use(middlewares.CORSMiddleware())

	// Register module routes
	// user.RegisterRoutes(server, injector)
	// auth.RegisterRoutes(server, injector)

	// 5️⃣ Graceful shutdown signal listener
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-quit
		log.Println("Shutting down server...")
		config.CloseDatabaseConnection()
		os.Exit(0)
	}()

	// 6️⃣ Run server
	run(server)
}
