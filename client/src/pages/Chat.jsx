import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../api/api";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import toast from "react-hot-toast";

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
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("messageError", (error) => {
    toast.error(error.message);
    });

    return () => {
      socket.off("newMessage");
      socket.off("messageError");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    if (!username.trim() || !text.trim()) {
      toast.error("Username and message are required");
      return;
    }

    socket.emit("sendMessage", {
      username,
      text
    });

    setText("");
  };

  const deleteMessage = async (id) => {
    const confirmDelete = window.confirm("Delete this message?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/messages/${id}`);
      toast.success("Message deleted!");
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== id)
      );
    } catch (error) {
      console.error(error);
      toast.error("Error deleting message");
    }
  };

  return (
    <div>
      <section className="mb-8 rounded-3xl bg-gradient-to-r from-emerald-600 to-sky-600 p-8 shadow-xl">
        <h1 className="text-4xl font-bold text-white">Chat</h1>
        <p className="mt-3 max-w-2xl text-emerald-100">
          Send real-time messages using Socket.IO and save them in MongoDB.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={sendMessage} className="card">
          <h2 className="mb-6 text-2xl font-bold">New Message</h2>

          <div className="mb-4">
            <label htmlFor="username" className="mb-2 block text-sm muted">
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="messageText" className="mb-2 block text-sm muted">
              Message
            </label>

            <textarea
              id="messageText"
              name="messageText"
              autoComplete="off"
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="5"
              className="input resize-none"
            />
          </div>

          <button type="submit" className="btn-success w-full">
            Send Message
          </button>
        </form>

        <section className="card">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Messages</h2>
              <p className="text-sm muted">{messages.length} saved messages</p>
            </div>

            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-400">
              Live
            </span>
          </div>

          {loading && <Loader />}

          {!loading && messages.length === 0 && (
            <EmptyState
                icon="💬"
                title="No messages yet"
                text="Send your first real-time message."
            />
          )}

          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message._id} className="stat-box">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{message.username}</p>

                    <p className="text-xs muted">
                      {message.createdAt
                        ? new Date(message.createdAt).toLocaleString()
                        : ""}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteMessage(message._id)}
                    className="rounded-lg bg-rose-600 px-3 py-1 text-sm text-white transition hover:bg-rose-500"
                  >
                    Delete
                  </button>
                </div>

                <p>{message.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Chat;