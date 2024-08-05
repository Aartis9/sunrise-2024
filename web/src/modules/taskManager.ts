import Task from "@/model/Task";
import { initialTasks } from "@/utils/TaskList";

let tasks: Task[] = [...initialTasks];
let i = 1;
let j = tasks[tasks.length - 1].id + 1;

export function initializeTasks() {
   i = 1;
}
const filterTasks = (predicate: (task: Task) => boolean): Task[] => tasks.filter(predicate);

export function getActiveTasks(): Task[] {
    const allTasks = getAllTasks();
    const completedTasks = getCompletedTasks();
    if (allTasks.length === 0 || allTasks.length === completedTasks.length) {
        return [];
    }
    const activeTasks = filterTasks(task => task.group === i && !task.completed);
    if (activeTasks.length === 0) {
        i++;
        return getActiveTasks();
    }
    return activeTasks;
}

export function getCompletedTasks(): Task[] {
    return filterTasks(task => task.completed);
}

export function getAllTasks(): Task[] {
    return tasks;
}

export function completeTask(taskTitle: string): void {
    const task = tasks.find(t => t.title === taskTitle);
    if (task && !task.completed && task.group === i) {
        task.completed = true;
        const allCompletedInGroup = filterTasks(t => t.group === i).every(t => t.completed);
        if (allCompletedInGroup) {
            console.log(getActiveTasks());
        }
    }
}

export function createTask(title: string, description: string, persona: string, group: number): void {
    const newTask = new Task(j++, title, description, persona, group);
    tasks.push(newTask);
    i = Math.min(group, i);
    console.log(tasks);
}

export function updateTask(taskId: number, updatedTask: Partial<Omit<Task, 'id'>>): void {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
    }
}

export function deleteTask(taskId: number): void {
    tasks = filterTasks(t => t.id !== taskId);
}