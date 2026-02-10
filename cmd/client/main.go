package main

import (
	"flag"
	"io"
	"log"
	"net/url"
	"os"
	"os/signal"
	"time"

	"github.com/gorilla/websocket"
)

func main() {
	audioFile := flag.String("file", "", "Path to 16-bit PCM WAV audio file to stream")
	serverAddr := flag.String("addr", "localhost:8080", "Server address")
	flag.Parse()

	if *audioFile == "" {
		log.Fatal("Please provide an audio file using -file")
	}

	u := url.URL{Scheme: "ws", Host: *serverAddr, Path: "/ws/audio"}
	log.Printf("Connecting to %s", u.String())

	c, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		log.Fatalf("dial: %v", err)
	}
	defer c.Close()

	done := make(chan struct{})

	// Receive goroutine
	go func() {
		defer close(done)
		for {
			_, message, err := c.ReadMessage()
			if err != nil {
				log.Println("read:", err)
				return
			}
			log.Printf("Received: %s", message)
		}
	}()

	// Send goroutine
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)

	file, err := os.Open(*audioFile)
	if err != nil {
		log.Fatalf("failed to open file: %v", err)
	}
	defer file.Close()

	buffer := make([]byte, 4096) // Send 4KB chunks
	ticker := time.NewTicker(100 * time.Millisecond)
	defer ticker.Stop()

	go func() {
		for {
			select {
			case <-done:
				return
			case <-ticker.C:
				n, err := file.Read(buffer)
				if err != nil {
					if err == io.EOF {
						log.Println("Finished sending audio file")
						// Keep connection open to receive final results
						return
					}
					log.Printf("file read error: %v", err)
					return
				}

				if err := c.WriteMessage(websocket.BinaryMessage, buffer[:n]); err != nil {
					log.Println("write:", err)
					return
				}
			case <-interrupt:
				log.Println("interrupt")
				err := c.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
				if err != nil {
					log.Println("write close:", err)
				}
				return
			}
		}
	}()

	<-done
}
