import { useChatStore } from '../Store/UseChatStore';
import { useAuthStore } from '../Store/UseAuthStore';
import { MessageSquare, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from "../Components/Sidebar"
import NoChatSelected from "../Components/NoChatSelected";
import ChatContainer from "../Components/ChatContainer";

const HomePage = () => {
    const { selectedUser } = useChatStore();
    const { authUser, logout } = useAuthStore();

    return (
        <div className="h-screen w-screen flex bg-base-300/30 text-base-content overflow-hidden font-sans">
            {/* Leftmost Navigation Sidebar (Dribbble style) */}
            <div className="w-18 bg-base-100 flex flex-col items-center py-6 gap-6 flex-shrink-0 border-r border-base-200 relative select-none">
                
                {/* Brand Logo / Top Mark */}
                <div className="flex flex-col gap-0.5 items-center justify-center cursor-pointer mb-2">
                    <div className="flex gap-0.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    </div>
                    <div className="flex gap-0.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    </div>
                </div>

                {/* Active Chat Icon (with vertical indicator line) */}
                <div className="relative flex items-center justify-center w-full py-1">
                    {/* Vertical Green Indicator Line */}
                    <span className="absolute left-0 w-1 h-8 bg-emerald-500 rounded-r-full" />
                    
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shadow-sm transition-all cursor-pointer">
                        <MessageSquare className="w-5.5 h-5.5" />
                    </div>
                </div>

                <div className="flex-1" />

                {/* Logout Button */}
                <button 
                    onClick={logout} 
                    className="p-2 rounded-xl text-base-content/40 hover:text-error hover:bg-error/10 transition-all cursor-pointer"
                    title="Logout"
                >
                    <LogOut className="w-5.5 h-5.5" />
                </button>

                {/* Bottom User Avatar */}
                <Link to="/profile" className="cursor-pointer hover:scale-105 transition-transform" title="My Profile">
                    <img 
                        src={authUser?.profilePic || "/avatar.png"} 
                        alt="User profile" 
                        className="size-9 rounded-full object-cover border border-base-200 bg-base-200"
                    />
                </Link>
            </div>

            {/* Middle Sidebar (Contacts / Conversations Column) */}
            <Sidebar />

            {/* Right Chat Area */}
            <div className="flex-1 flex flex-col h-full bg-base-300/10 p-4 md:p-6 overflow-hidden">
                <div className="flex-1 bg-base-100 rounded-3xl shadow-sm border border-base-200 flex flex-col overflow-hidden">
                    {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
                </div>
            </div>
        </div>
    );
}

export default HomePage;
