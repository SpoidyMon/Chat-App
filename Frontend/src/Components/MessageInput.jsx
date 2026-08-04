import { useRef, useState } from "react";
import { useChatStore } from "../Store/UseChatStore";
import { Send, X, Paperclip } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage } = useChatStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;

        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
            });

            // Clear form
            setText("");
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <div className="p-4 w-full bg-base-100 border-t border-base-200/50">
            <form onSubmit={handleSendMessage} className="relative flex flex-col bg-base-100 rounded-2xl border border-base-200 px-4 py-2.5 shadow-sm">
                
                {/* Image Preview (inside input card) */}
                {imagePreview && (
                    <div className="mb-3 flex items-center gap-2 bg-base-200/60 p-2.5 rounded-xl border border-base-200 w-fit">
                        <div className="relative">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-20 h-20 object-cover rounded-lg border border-base-300"
                            />
                            <button
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-error text-error-content
                                flex items-center justify-center cursor-pointer shadow hover:bg-error/90 transition-colors"
                                type="button"
                            >
                                <X className="size-3" />
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3">
                    {/* Text input */}
                    <input
                        type="text"
                        className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-base-content placeholder-base-content/30 text-sm py-1.5"
                        placeholder="Write your message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />



                    {/* Attachment Paperclip Button */}
                    <button
                        type="button"
                        className="flex-shrink-0 flex items-center justify-center p-1.5 rounded-lg text-base-content/35 hover:text-base-content/75 hover:bg-base-200/50 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                        title="Attach File"
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>

                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />

                    {/* Circular Teal Send Button */}
                    <button
                        type="submit"
                        className="flex-shrink-0 flex items-center justify-center size-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:hover:bg-emerald-500"
                        disabled={!text.trim() && !imagePreview}
                    >
                        <Send className="w-4 h-4 transform rotate-0" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MessageInput;
