package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Agent struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

func main() {
	r := gin.Default()

	r.GET("/agents", func(c *gin.Context) {
		agents := []Agent{
			{X: 100, Y: 100},
			{X: 200, Y: 200},
		}
		c.JSON(http.StatusOK, agents)
	})

	r.Run(":8080")
}