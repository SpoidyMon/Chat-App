import { X } from "lucide-react";
import { useChatStore } from "../Store/UseChatStore";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();

    return (
        <div className="h-16 px-6 border-b border-base-200 flex items-center bg-base-100 flex-shrink-0 select-none">
            <div className="flex items-center justify-between w-full">
                {/* Title */}
                <div className="flex items-center gap-3">
                    <span className="font-extrabold text-base-content text-md md:text-lg tracking-tight select-none">
                        {selectedUser.username}
                    </span>
                </div>

                {/* Close Button */}
                <button 
                    onClick={() => setSelectedUser(null)}
                    className="p-1.5 rounded-lg text-base-content/40 hover:text-base-content hover:bg-base-200 transition-all cursor-pointer"
                    title="Close Chat"
                >
                    <X className="size-5" />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
