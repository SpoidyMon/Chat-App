import SidebarSkeleton from './Skeleton/SidebarSkeleton'
import { useChatStore } from '../Store/UseChatStore'
import { useEffect, useState } from 'react'
import { Settings, Search } from 'lucide-react'
import { useAuthStore } from '../Store/UseAuthStore'
import { Link } from 'react-router-dom'

const Sidebar = () => {
    const { authUser, onlineUsers } = useAuthStore()
    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore()
    const [showOnlineOnly, setShowOnlineOnly] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const otherUsers = users.filter((user) => user._id !== authUser?._id);

    // Filter by search query and online status
    const filteredUsers = otherUsers.filter((user) => {
        const matchesSearch = user.username?.toLowerCase().includes(searchQuery.toLowerCase());
        const isOnline = onlineUsers.includes(user._id);
        
        if (showOnlineOnly) {
            return matchesSearch && isOnline;
        }
        return matchesSearch;
    });

    useEffect(() => {
        getUsers()
    }, [getUsers])

    if (isUsersLoading) return <SidebarSkeleton />

    return (
        <aside className="h-full w-76 bg-base-300/40 flex flex-col flex-shrink-0 transition-all duration-200 border-r border-base-200 relative overflow-hidden select-none">
            
            {/* Sidebar Header & User Profile Card */}
            <div className="px-5 pt-6 pb-4 flex flex-col gap-5">
                {/* Title & Settings icon */}
                <div className="flex items-center justify-between">
                    <span className="font-bold text-base-content text-xl tracking-tight">Chat</span>
                    <Link to="/settings" className="p-1.5 rounded-lg hover:bg-base-200 text-base-content/60 hover:text-base-content transition-all" title="Settings">
                        <Settings className="w-5 h-5" />
                    </Link>
                </div>

                {/* Profile Card */}
                <div className="flex flex-col items-center justify-center bg-base-100 rounded-2xl p-4 border border-base-200/50 shadow-sm relative group">
                    <div className="relative">
                        <img
                            src={authUser?.profilePic || "/avatar.png"}
                            alt={authUser?.username}
                            className="size-16 object-cover rounded-full bg-base-200 border-2 border-base-100 shadow-sm"
                        />
                        <span className="absolute bottom-0.5 right-0.5 size-3.5 bg-green-500 rounded-full ring-3 ring-base-100 animate-pulse" />
                    </div>

                    <span className="font-bold text-base-content text-md mt-2.5 leading-none">{authUser?.username}</span>
                    
                    {/* Status Pill */}
                    <div className="flex items-center gap-1 mt-2.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold">
                        <span>available</span>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative flex items-center bg-base-100 rounded-xl border border-base-200 px-3.5 py-2.5 shadow-2xs group focus-within:ring-1 focus-within:ring-primary/20">
                    <input 
                        type="text" 
                        placeholder="Search" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm text-base-content placeholder-base-content/35 pr-6"
                    />
                    <Search className="w-4.5 h-4.5 text-base-content/30 absolute right-3.5 group-focus-within:text-primary transition-colors" />
                </div>
            </div>

            {/* Conversation Headers */}
            <div className="px-5 flex items-center justify-between pb-2">
                <span className="font-semibold text-base-content/80 text-xs uppercase tracking-wider">Last chats</span>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${showOnlineOnly ? 'bg-primary/10 border-primary/25 text-primary font-semibold' : 'border-base-200 text-base-content/40 hover:text-base-content'}`}
                    >
                        Online Only
                    </button>
                </div>
            </div>

            {/* Chats List */}
            <div className="flex-1 overflow-y-auto w-full px-3 py-1 space-y-1.5 pb-6">
                {filteredUsers.map((user) => {
                    const isOnline = onlineUsers.includes(user._id);
                    const isSelected = selectedUser?._id === user._id;

                    return (
                        <button
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`
                                w-full px-3.5 py-3 flex items-center gap-3.5 rounded-xl transition-all duration-150 text-left border
                                ${isSelected 
                                    ? "bg-base-100 border-base-200/50 shadow-sm text-base-content font-medium" 
                                    : "border-transparent text-base-content/65 hover:bg-base-100/40 hover:text-base-content"
                                }
                            `}
                        >
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <img
                                    src={user.profilePic || "/avatar.png"}
                                    alt={user.username}
                                    className="size-10 object-cover rounded-full bg-base-200 border border-base-300/30 shadow-2xs"
                                />
                                {isOnline && (
                                    <span
                                        className="absolute bottom-0 right-0 size-2.5 bg-green-500 
                                        rounded-full ring-2 ring-base-100"
                                    />
                                )}
                            </div>

                            {/* Name, Message Preview, and Time */}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className="text-sm font-bold text-base-content truncate">{user.username}</span>
                                    <span className="text-[10px] text-base-content/35 font-medium flex-shrink-0">11:15</span>
                                </div>
                                <div className="text-[11px] truncate text-base-content/40">
                                    {isOnline ? "Online" : "Offline"}
                                </div>
                            </div>
                        </button>
                    );
                })}

                {filteredUsers.length === 0 && (
                    <div className="text-center text-base-content/30 py-8 text-xs">No conversations found</div>
                )}
            </div>
        </aside>
    );
}

export default Sidebar
