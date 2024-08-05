import React from 'react';
import { Card, Button, Divider } from 'antd';
import Task from '../model/Task';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';

interface Ds {
  task?: Task;
  id: number;
  title: string;
  description: string;
  persona?: string;
  group?: number;
  completed?: boolean;
  display: boolean;
}

const AntdCard: React.FC<Ds> = ({ id, title, description, display }) => {
  const handleApiRequest = async (url: string, method: string, body?: object) => {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      const action = method.toLowerCase();
      
      if (data.success) {
        alert(`Task ${action}d successfully`);
        if (method !== 'PUT') window.location.reload();
        return true;
      } else {
        alert(`Task ${action} failed`);
        return false;
      }
    } catch (error) {
      console.error(`Error during ${method} request:`, error);
      alert('An error occurred');
      return false;
    }
  };

  const deleteTask = () => handleApiRequest(`/api/deleteTask?id=${id}`, "DELETE");
  const completeTask = () => handleApiRequest("/api/completeTask", "POST", { title });

  const renderContent = () => (
    <div className="text-center">
      <h3 className="font-semibold text-lg">{title}</h3>
      <Divider />
      {description}
      <div>{renderButtons()}</div>
    </div>
  );

  const renderButtons = () => (
    <div className='flex flex-wrap justify-center'> 
      <Button 
        icon={<CheckOutlined />} 
        onClick={completeTask} 
        className=" bg-[green] my-3 h-7 w-22" 
        disabled={!display}
        aria-label="Complete task"
      ></Button>
      &nbsp;
      <Button 
        icon={<DeleteOutlined />} 
        onClick={deleteTask} 
        className="bg-red-500 mt-3 h-7 w-22"
        aria-label="Delete task"
      ></Button>
    </div>
  );

  return (
    <Card
      title={`Task ${id}`}
      size="small"
      bordered={false}
      className="bg-white w-[45vw] lg:w-[15vw]"
    >
      {renderContent()}
    </Card>
  );
};

export default AntdCard;