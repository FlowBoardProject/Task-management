import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Send, MessageCircle } from "lucide-react";

export function TaskComments({ comments, newComment, setNewComment, commenterName, setCommenterName, setComments }) {
    const [error, setError] = useState("");

    const handleAddComment = () => {
        if (!commenterName.trim() || !newComment.trim()) {
            setError("Name and comment cannot be empty.");
            return;
        }

        setComments([...comments, { name: commenterName, text: newComment, date: new Date().toLocaleString() }]);
        setNewComment("");
        setCommenterName("");
        setError("");  // Clear error after successful submission
    };

    return (
        <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <MessageCircle size={20} /> Comments
            </h3>

            {/* Input to Add Comment */}
            <div className="flex flex-col gap-2 mt-3">
                <Input
                    value={commenterName}
                    onChange={(e) => setCommenterName(e.target.value)}
                    placeholder="Your Name"
                    className="border rounded-lg p-2"
                />
                <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="border rounded-lg p-2"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button onClick={handleAddComment} className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-1 w-fit">
                    <Send size={16} /> Post
                </Button>
            </div>

            {/* Display Comments */}
            <div className="mt-4">
                {comments.length === 0 ? (
                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment, index) => (
                        <div key={index} className="bg-gray-100 p-3 rounded-lg my-2 shadow-sm">
                            <p className="font-semibold text-gray-800">{comment.name}</p>
                            <p className="text-gray-700">{comment.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{comment.date}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
