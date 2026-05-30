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
      setMessages((prevMessages) => [...prevMessages, message]);
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
    const confirmDelete = window.confirm("Delete this message?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/messages/${id}`);

      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Error deleting message");
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
        <form
          onSubmit={sendMessage}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg"
        >
          <h2 className="mb-6 text-2xl font-bold">New Message</h2>

          <div className="mb-4">
            <label
              htmlFor="username"
              className="mb-2 block text-sm text-slate-400"
            >
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="messageText"
              className="mb-2 block text-sm text-slate-400"
            >
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
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-500"
          >
            Send Message
          </button>
        </form>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Messages</h2>
              <p className="text-sm text-slate-400">
                {messages.length} saved messages
              </p>
            </div>

            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-300">
              Live
            </span>
          </div>

          {loading && <p className="text-slate-400">Loading messages...</p>}

          {!loading && messages.length === 0 && (
            <p className="text-slate-400">No messages yet.</p>
          )}

          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message._id}
                className="rounded-2xl bg-slate-800 p-4"
              >
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">
                      {message.username}
                    </p>

                    <p className="text-xs text-slate-400">
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

                <p className="text-slate-200">{message.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Chat;