import CreateTopic from "@/components/CreateTopic";
import AddTask from "@/components/tasks/AddTask";
import ManageTasks from "@/components/tasks/ManageTasks";

export default function Tasks() {
  return (
    <div className="flex flex-col-reverse md:flex-col gap-20">
      <div className="flex flex-col md:flex-row gap-5">
        <AddTask />
        <CreateTopic />
      </div>
      <ManageTasks />
    </div>
  );
}
