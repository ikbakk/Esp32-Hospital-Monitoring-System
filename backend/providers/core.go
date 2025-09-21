package providers

import (
	"ward-monitor-backend/config"
	authRepo "ward-monitor-backend/modules/auth/repository"
	userService "ward-monitor-backend/modules/user/service"
	"ward-monitor-backend/modules/auth/service"
	"ward-monitor-backend/modules/user/controller"
	"ward-monitor-backend/modules/user/repository"
	"ward-monitor-backend/pkg/constants"
	"github.com/samber/do"
	"gorm.io/gorm"
)

func InitDatabase(injector *do.Injector) {
	do.ProvideNamed(injector, constants.DB, func(i *do.Injector) (*gorm.DB, error) {
		return config.SetUpDatabaseConnection(), nil
	})
}

func RegisterDependencies(injector *do.Injector) {
	InitDatabase(injector)

	do.ProvideNamed(injector, constants.JWTService, func(i *do.Injector) (service.JWTService, error) {
		return service.NewJWTService(), nil
	})

	// Initialize
	db := do.MustInvokeNamed[*gorm.DB](injector, constants.DB)
	jwtService := do.MustInvokeNamed[service.JWTService](injector, constants.JWTService)

	// Repository
	userRepository := repository.NewUserRepository(db)
	refreshTokenRepository := authRepo.NewRefreshTokenRepository(db)

	// Service
	userService := userService.NewUserService(userRepository, refreshTokenRepository, jwtService, db)

	// Controller
	do.Provide(
		injector, func(i *do.Injector) (controller.UserController, error) {
			return controller.NewUserController(i, userService), nil
		},
	)
}
