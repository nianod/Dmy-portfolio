"use client";

import { useEffect, useState } from "react";

 const formatTime = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-KE", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Nairobi",   
    });
  } catch {
    return "";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "Just now";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Just now";

    //  Nairobi time
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-KE", { timeZone: "Africa/Nairobi" });
  } catch {
    return "Just now";
  }
};
const Logger = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const API = import.meta.env.VITE_API;
        const res = await fetch(`${API}/admin/chats`);
        const data = await res.json();
        setChats(data.chats || []);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-sm px-6 py-5">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Portfolio AI
            </h1>
            <p className="mt-0.5 text-sm text-zinc-400">Visitor conversations</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2">
              <span className="text-sm text-zinc-400">Total</span>
              <span className="ml-2 font-semibold text-blue-400">{chats.length}</span>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="rounded-lg border cursor-pointer border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex h-[calc(100vh-89px)] max-w-7xl mx-auto">
        {/* Conversation List */}
        <aside className="w-[380px] shrink-0 overflow-y-auto border-r border-zinc-800/80 bg-zinc-950">
          <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm px-5 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-zinc-300">
                Recent conversations
              </h2>
              <span className="text-xs text-zinc-500">
                {loading ? "Loading..." : `${chats.length} total`}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                <span className="text-sm text-zinc-500">Loading conversations...</span>
              </div>
            </div>
          ) : chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-3 text-4xl">🤖</div>
              <p className="text-sm text-zinc-400">No conversations yet</p>
              <p className="text-xs text-zinc-600 mt-1">Visitors will appear here once they start chatting</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/50">
              {chats.map((chat) => {
                const firstMessage = chat.messages?.find(
                  (message) => message.role === "user"
                );
                const isSelected = selectedChat?.conversation_id === chat.conversation_id;

                return (
                  <button
                    key={chat.conversation_id}
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full cursor-pointer p-5 text-left transition-all hover:bg-zinc-900/50 ${
                      isSelected ? "bg-zinc-900/80 border-l-2 border-blue-500" : "border-l-2 border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-green-400"></div>
                          <span className="text-xs font-medium text-zinc-400">Visitor</span>
                          {chat.messages?.length > 0 && (
                            <span className="text-[10px] text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded-full">
                              {chat.messages.length} msgs
                            </span>
                          )}
                        </div>
                        <p className="truncate text-sm text-zinc-200 font-medium">
                          {firstMessage?.content || "New conversation"}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {formatDate(chat.updated_at)}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-[10px] text-zinc-600">
                          {formatTime(chat.updated_at)}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        {/* Conversation */}
        <section className="flex flex-1 flex-col bg-zinc-950/50">
          {!selectedChat ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center max-w-sm">
                <div className="mb-4 text-5xl animate-bounce">💬</div>
                <h2 className="text-lg font-semibold text-zinc-300">
                  No conversation selected
                </h2>
                <p className="mt-2 text-sm text-zinc-500">
                  Choose a conversation from the sidebar to view the full chat history
                </p>
                <div className="mt-6 flex justify-center gap-2">
                  <span className="text-xs text-zinc-600">←</span>
                  <span className="text-xs text-zinc-500">Select a conversation</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Conversation Header */}
              <div className="sticky top-0 z-10 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-sm px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-400"></div>
                      <h2 className="text-sm font-medium text-zinc-200">Visitor</h2>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">
                      Started {formatDate(selectedChat.created_at)}
                      <span className="mx-2 text-zinc-700">•</span>
                      <span className="text-zinc-600">
                        {selectedChat.messages?.length || 0} messages
                      </span>
                    </p>
                  </div>
                  <button className="rounded-lg cursor-not-allowed border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 transition-colors">
                    View details
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedChat.messages?.map((message, index) => {
                  const isUser = message.role === "user";
                  const isLast = index === selectedChat.messages.length - 1;

                  return (
                    <div
                      key={index}
                      className={`flex ${isUser ? "justify-end" : "justify-start"} ${
                        isLast ? "mb-2" : ""
                      }`}
                    >
                      <div className={`max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
                        <div
                          className={`mb-1 text-xs font-medium ${
                            isUser ? "text-blue-400" : "text-purple-400"
                          }`}
                        >
                          {isUser ? "Visitor" : "Portfolio AI"}
                        </div>
                        <div
                          className={`rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                            isUser
                              ? "rounded-br-md bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20"
                              : "rounded-bl-md border border-zinc-800 bg-zinc-900/80 text-zinc-200 shadow-lg"
                          }`}
                        >
                          {message.content}
                        </div>
                        {message.timestamp && (
                          <div
                            className={`mt-1 text-[10px] text-zinc-600 ${
                              isUser ? "text-right" : "text-left"
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default Logger;
