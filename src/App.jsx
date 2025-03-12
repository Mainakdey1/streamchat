import React, { useEffect, useState } from "react";
import { Chat, Channel, Window, MessageList, MessageInput } from "stream-chat-react";
import { StreamChat } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";

const apiKey = "bknpx6eut9sj";
const userId = "user1"; 

const chatClient = StreamChat.getInstance(apiKey);

const App = () => {
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const connectUser = async () => {
      try {

        const response = await fetch(`http://localhost:8000/token?user_id=${userId}`);
        const data = await response.json();

        await chatClient.connectUser(
          { id: userId, name: "User 1" },
          data.token
        );

        const channel = chatClient.channel("messaging", "ai-bot", {
          name: "AI Chat",
        });

        await channel.watch();
        setChannel(channel);
      } catch (error) {
        console.error("Error connecting to chat:", error);
      }
    };

    connectUser();

    return () => {
      chatClient.disconnectUser();
    };
  }, []);

  if (!channel) return <div>..... Annoying react problems as per usual</div>;
const connectUser = async () => {
  try {
    const response = await fetch("http://localhost:8000/token?user_id=user1", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    console.log("Token received:", data);
  } catch (error) {
    console.error("Error fetching token:", error);
  }
};
  return (
    <Chat client={chatClient} theme="messaging light">
      <Channel channel={channel}>
        <Window>
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
};

export default App;
