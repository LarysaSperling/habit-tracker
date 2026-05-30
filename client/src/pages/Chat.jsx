import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../api/api";

const socket = io("http://localhost:3333");

function Chat() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("Larysa");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);

        const response = await api.get("/messages");

        setMessages(response.data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        message
      ]);
    });

    socket.on("messageError", (error) => {
      alert(error.message);
    });

    return () => {
      socket.off("newMessage");
      socket.off("messageError");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    if (!username.trim() || !text.trim()) {
      alert("Username and message are required");
      return;
    }

    socket.emit("sendMessage", {
      username,
      text
    });

    setText("");
  };

  const deleteMessage = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this message?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/messages/${id}`);

      setMessages((prevMessages) =>
        prevMessages.filter(
          (message) => message._id !== id
        )
      );
    } catch (error) {
      console.error(error);
      alert("Error deleting message");
    }
  };

  return (
    <div>
      <h1>Chat</h1>

      <form onSubmit={sendMessage}>
        <div>
          <label htmlFor="username">
            Username
          </label>

          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="messageText">
            Message
          </label>

          <input
            id="messageText"
            name="messageText"
            type="text"
            autoComplete="off"
            placeholder="Type your message..."
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
          />
        </div>

        <button type="submit">
          Send Message
        </button>
      </form>

      <hr />

      <h2>Messages</h2>

      {loading && <p>Loading messages...</p>}

      {!loading && messages.length === 0 && (
        <p>No messages yet.</p>
      )}

      {messages.map((message) => (
        <div
          key={message._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px"
          }}
        >
          <p>
            <strong>
              {message.username}
            </strong>
            : {message.text}
          </p>

          <small>
            {message.createdAt
              ? new Date(
                  message.createdAt
                ).toLocaleString()
              : ""}
          </small>

          <br />

          <button
            onClick={() =>
              deleteMessage(message._id)
            }
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Chat;