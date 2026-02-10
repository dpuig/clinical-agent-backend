package main

import (
	"log"
	"net/url"
	"os"
	"os/signal"
	"time"

	"github.com/gorilla/websocket"
)

func main() {
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)

	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/ws/audio"}
	log.Printf("connecting to %s", u.String())

	c, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		log.Fatal("dial:", err)
	}
	defer c.Close()

	done := make(chan struct{})

	go func() {
		defer close(done)
		for {
			_, message, err := c.ReadMessage()
			if err != nil {
				if websocket.IsCloseError(err, websocket.CloseNormalClosure) {
					log.Printf("Received expected close: %v", err)
				} else {
					log.Printf("read error: %v (IsCloseError(1000)=%v)", err, websocket.IsCloseError(err, websocket.CloseNormalClosure))
				}
				return
			}
			log.Printf("recv: %s", message)
		}
	}()

	// Send some silence
	// 1 second of silence at 16kHz 16-bit mono = 32000 bytes
	silence := make([]byte, 32000)
	err = c.WriteMessage(websocket.BinaryMessage, silence)
	if err != nil {
		log.Println("write:", err)
		return
	}
	log.Println("Sent 1s of silence")

	// Wait 2 seconds then send EOF
	time.Sleep(2 * time.Second)

	err = c.WriteMessage(websocket.TextMessage, []byte("EOF"))
	if err != nil {
		log.Println("write EOF:", err)
		return
	}
	log.Println("Sent EOF signal")

	// Wait for server to close connection due to EOF (should happen fast)
	select {
	case <-done:
		log.Println("Client read loop finished (Clean shutdown)")
	case <-time.After(5 * time.Second):
		log.Println("Timeout waiting for server close")
	case <-interrupt:
		log.Println("interrupt")
		err := c.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
		if err != nil {
			log.Println("write close:", err)
			return
		}
	}
}
