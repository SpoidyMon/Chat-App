import { useEffect, useRef } from 'react'
import { useChatStore } from '../Store/UseChatStore';
import { formatMessageTime } from "../lib/utils.js"
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from "./Skeleton/MessageSkeleton"
import { useAuthStore } from '../Store/UseAuthStore.js';

const ChatContainer = () => {
  const { messages, getMessage, selectedUser, isMessagesLoading, subscribeToMessage, unsubscribeToMessage } = useChatStore()
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessage(selectedUser._id)
    subscribeToMessage();
    return () => unsubscribeToMessage();
  }, [selectedUser._id, getMessage, subscribeToMessage, unsubscribeToMessage])

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages])

  if (isMessagesLoading) return (
    <div className="flex-1 flex flex-col overflow-auto bg-base-100">
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput />
    </div>
  )

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-base-100 h-full">
      <ChatHeader />

      {/* Messages list with alternating Dribbble bubbles */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-base-100">
        {messages.map((message) => {
          const isMe = message.senderId === authUser._id;
          const senderName = isMe ? "You" : selectedUser.username;
          const senderAvatar = isMe ? authUser.profilePic : selectedUser.profilePic;

          return (
            <div
              key={message._id}
              className={`flex gap-3 items-start ${isMe ? "justify-end" : "justify-start"}`}
              ref={messageEndRef}
            >
              {/* Receiver Avatar on the left */}
              {!isMe && (
                <div className="flex-shrink-0 mt-1">
                  <img
                    src={senderAvatar || "/avatar.png"}
                    alt="avatar"
                    className="size-8 rounded-full object-cover bg-base-200 border border-base-300"
                  />
                </div>
              )}

              {/* Message block */}
              <div className={`flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                {/* Header (Name + Time) */}
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[11px] font-bold text-base-content/85 leading-none">
                    {senderName}
                  </span>
                  <span className="text-[9px] text-base-content/35 font-medium leading-none">
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>

                {/* Bubble Container */}
                <div
                  className={`
                    px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words border border-base-300/10 shadow-3xs
                    ${isMe 
                      ? "bg-primary/10 text-primary rounded-tr-none" 
                      : "bg-base-200/70 text-base-content rounded-tl-none"
                    }
                  `}
                >
                  {message.image && (
                    <div className="relative mt-1 mb-2 max-w-xs md:max-w-md overflow-hidden rounded border border-base-300 bg-base-100">
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="object-cover max-h-[250px]"
                      />
                    </div>
                  )}
                  {message.text && <p className="text-[13px]">{message.text}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer
