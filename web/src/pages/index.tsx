import React, { useEffect, useState } from "react";
import AntdCard from "./AntdCard";
import { Inter } from "next/font/google";
import Task from "@/model/Task";
import { Badge } from "antd";

const inter = Inter({ subsets: ["latin"] });

type FormatDataType = {
  todo: Task[];
  c2: Task[];
  c3: Task[];
};

const fetchData = async (endpoint: string) => {
  const res = await fetch(`http://localhost:3000/api/${endpoint}`);
  const data = await res.json();
  return data.data;
};

export default function Home() {
  const [data, setData] = useState<FormatDataType>();

  const formatData = async () => {
    const [completedData, activeData, allData] = await Promise.all([
      fetchData("completedTask"),
      fetchData("activeTask"),
      fetchData("allTask"),
    ]);


    let todo = allData.filter(
      (item: Task) =>
        item && item.id && !item.completed && !activeData.find((i: Task) => i.id === item.id)
    );

    let c2:Task[] = [];
    if (activeData.length === 1) {
      c2 = todo.length > 0 ? [activeData[0], todo[0]] : [activeData[0]];
      todo = todo.slice(todo.length > 0 ? 1 : 0);
    } else if (activeData.length > 1) {
      c2 = [activeData[0], activeData[1]];
      todo = [...activeData.slice(2), ...todo];
    }

    return { todo: todo.filter(Boolean), c2, c3: completedData };
  };

  useEffect(() => {
    formatData().then(setData);
  }, []);

  const renderTaskList = (tasks: Task[], display: boolean) => (
    <div className="grid grid-cols-2 gap-4 w-[100vw] lg:w-[30vw]">
      {tasks.map((task: Task) => (
        <AntdCard
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description}
          display={display}
        />
      ))}
    </div>
  );

  const renderColumn = (title: string, tasks: Task[], display: boolean) => (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        <h3 className="text-center font-semibold text-lg w-[100%]">
          {title} <Badge count={tasks?.length} showZero color="green" />
        </h3>
      </div>
      {title!=="In-Progress" && renderTaskList(tasks, display)}
    </div>
  );

  return (
    <>
      <h1 className="text-center font-bold text-3xl w-[100%] mt-4">Task Board</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-15 my-8 w-screen px-[2vw]">
        {data && (
          <>
            {renderColumn("To-Do", data.todo, false)}
            <div className="flex flex-col gap-5 w-[100vw] lg:w-[30vw]">
              {renderColumn("In-Progress", data.c2, true)}
              <div className="grid grid-cols-2">
              {data.c2.length > 0 && 
              <AntdCard
          key={data.c2[0].id}
          id={data.c2[0].id}
          title={data.c2[0].title}
          description={data.c2[0].description}
          display={true}
        />
       }      

       
        {data.c2.length > 1 && data.c2[0].group !== data.c2[1].group && <br/>}
        {data.c2.length > 1 && <AntdCard
          key={data.c2[1].id}
          id={data.c2[1].id}
          title={data.c2[1].title}
          description={data.c2[1].description}
          display={data.c2[0].group === data.c2[1].group}
        /> } </div>
            </div>
            {renderColumn("Completed", data.c3, false)}
          </>
        )}
      </div>
    </>
  );
}