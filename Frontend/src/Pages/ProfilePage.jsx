import { useState } from 'react'
import { useAuthStore } from '../Store/UseAuthStore.js';
import { Camera, Mail, User, X } from 'lucide-react'
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast'

const ProfilePage = () => {
    const { authUser, isUpdatingProfile, updateProfile } = useAuthStore()
    const [selectedImg, setSelectedImg] = useState(null)

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be smaller than 2MB");
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
            const base64Image = reader.result;
            setSelectedImg(base64Image);
            await updateProfile({ profilePic: base64Image });
        };
    };

    return (
        <div className="min-h-screen bg-discord-dark-main text-discord-text-normal py-12 relative overflow-y-auto">
            {/* Escape/Back to Chat button */}
            <div className="absolute top-6 right-6 md:top-10 md:right-10 flex flex-col items-center z-50">
                <Link 
                    to="/" 
                    className="w-9 h-9 rounded-full border border-zinc-600 text-zinc-400 hover:bg-zinc-800 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
                    title="Back to Chat"
                >
                    <X className="w-5 h-5" />
                </Link>
                <span className="text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-wider select-none">Esc</span>
            </div>

            <div className="max-w-2xl mx-auto p-4 py-8">
                <div className="bg-discord-dark-sidebar rounded-xl p-6 space-y-8 border border-zinc-900/40 shadow-2xl">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold ">Profile</h1>
                        <p className="mt-2">Your profile information</p>
                    </div>

                    {/* avatar upload section */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <img
                                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                                alt="Profile"
                                className="size-32 rounded-full object-cover border-4 "
                            />
                            <label
                                htmlFor="avatar-upload"
                                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
                            >
                                <Camera className="w-5 h-5 text-base-200" />
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUpdatingProfile}
                                />
                            </label>
                        </div>
                        <p className="text-sm text-zinc-400">
                            {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full Name
                            </div>
                            <p className="px-4 py-2.5 bg-zinc-800/60 rounded-lg border border-zinc-700/40">{authUser?.username}</p>
                        </div>

                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email Address
                            </div>
                            <p className="px-4 py-2.5 bg-zinc-800/60 rounded-lg border border-zinc-700/40">{authUser?.email}</p>
                        </div>
                    </div>

                    <div className="mt-6 bg-zinc-800/30 rounded-xl p-6 border border-zinc-900/20">
                        <h2 className="text-lg font-medium mb-4">Account Information</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                                <span>Member Since</span>
                                <span>{authUser?.createdAt ? authUser.createdAt.split("T")[0] : "N/A"}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span>Account Status</span>
                                <span className="text-green-500 font-semibold">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;