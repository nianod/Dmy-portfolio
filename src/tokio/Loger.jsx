"use client";

import { useEffect, useState } from "react";

const Logger = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const API = import.meta.env.VITE_API
        const res = await fetch(
          `${API}/admin/chats`  
        );

        const data = await res.json();
        setChats(data.chats);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="m  bg-zinc-950 text-white  ">
      
      <header className="border-b border-zinc-800 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">
              Portfolio AI
            </h1>

            <p className="mt-1 text-sm text-zinc-400">
              Visitor conversations
            </p>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2">
            <span className="text-sm text-zinc-400">
              Conversations
            </span>

            <span className="ml-2 font-semibold">
              {chats.length}
            </span>
          </div>
        </div>
      </header>

      
      <main className="flex h-[calc(100vh-89px)]">

      
        <aside className="w-[350px] shrink-0 overflow-y-auto border-r border-zinc-800">

          <div className="border-b border-zinc-800 px-5 py-4">
            <h2 className="text-sm font-medium text-zinc-300">
              Recent chats
            </h2>
          </div>

          {loading ? (
            <div className="p-5 text-sm text-zinc-500">
              Loading...
            </div>
          ) : chats.length === 0 ? (
            <div className="p-5 text-sm text-zinc-500">
              No conversations yet.
            </div>
          ) : (
            chats.map((chat, index) => (
              <button
                key={index}
                onClick={() => setSelectedChat(chat)}
                className={`w-full border-b border-zinc-800 p-5 text-left transition hover:bg-zinc-900 ${
                  selectedChat === chat
                    ? "bg-zinc-900"
                    : ""
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">
                    Visitor
                  </span>

                  <span className="text-xs text-zinc-600">
                    {new Date(chat.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <p className="truncate text-sm text-zinc-200">
                  {chat.user}
                </p>

                <p className="mt-1 truncate text-xs text-zinc-500">
                  {chat.reply}
                </p>
              </button>
            ))
          )}
        </aside>

        {/* Conversation */}
        <section className="flex flex-1 flex-col">

          {!selectedChat ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <div className="mb-3 text-3xl">
                  💬
                </div>

                <h2 className="text-sm font-medium text-zinc-300">
                  Select a conversation
                </h2>

                <p className="mt-1 text-xs text-zinc-600">
                  Choose a chat from the left to view it.
                </p>
              </div>
            </div>
          ) : (
            <>
            
              <div className="border-b border-zinc-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-medium">
                      Visitor
                    </h2>

                    <p className="mt-1 text-xs text-zinc-500">
                      {new Date(
                        selectedChat.timestamp
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
              </div>

               
              <div className="flex-1 overflow-y-auto p-6">

           
                <div className="mb-6 flex justify-end">
                  <div className="max-w-[70%]">
                    <div className="mb-1 text-right text-xs text-zinc-600">
                      Visitor
                    </div>

                    <div className="rounded-2xl rounded-br-md bg-blue-600 px-4 py-3 text-sm leading-6">
                      {selectedChat.user}
                    </div>
                  </div>
                </div>

                
                <div className="flex justify-start">
                  <div className="max-w-[70%]">
                    <div className="mb-1 text-xs text-zinc-600">
                      Portfolio AI
                    </div>

                    <div className="rounded-2xl rounded-bl-md border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm leading-6 text-zinc-300">
                      {selectedChat.reply}
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}

        </section>
      </main>
    </div>
  );
}

export default Logger