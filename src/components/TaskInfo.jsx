import { Input } from "../components/ui/Input";
import { User } from "lucide-react";

export function TaskInfo({ isEditing, task, setTask, users }) {
    return (
        <div className="space-y-3">
            <div>
                <label className="font-semibold">Description:</label>
                {isEditing ? (
                    <Input value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })} />
                ) : (
                    <p className="text-gray-700">{task.description}</p>
                )}
            </div>

            <div>
                <label className="font-semibold">Deadline:</label>
                {isEditing ? (
                    <Input type="date" value={task.deadline} onChange={(e) => setTask({ ...task, deadline: e.target.value })} />
                ) : (
                    <p className="text-gray-700">{task.deadline}</p>
                )}
            </div>
        </div>
    );
}
