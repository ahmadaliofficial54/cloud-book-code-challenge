import React from "react";
import { Button, Tag } from "antd";
import { UserOutlined, CalendarOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function BookCard({ book, onOpen, onEdit, onDelete, isAuthor }) {
  console.log(book,"-----");
  return (
    <div
      className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between min-h-[180px]"
    >
      <div>
        <h3 className="text-xl font-bold text-gray-300 mb-2 truncate capitalize">{book.title}</h3>
        {book.role && (
          <Tag color="blue" className="mb-2 text-xs font-medium">{book.role}</Tag>
        )}
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <CalendarOutlined className="mr-1" />
          {book.updatedAt ? new Date(book.updatedAt).toLocaleDateString() : "-"}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <UserOutlined className="mr-1" />
          {(book.collaborators?.length || 0) + 1} member{(book.collaborators?.length || 0) > 0 ? "s" : ""}
        </div>
      </div>
      <div className="flex gap-2 mt-4 self-end">
        <Button type="default" onClick={() => onOpen(book.id)}>
          Open
        </Button>
        {isAuthor && (
          <Button icon={<EditOutlined />} onClick={() => onEdit(book)} />
        )}
        {isAuthor && (
          <Button danger icon={<DeleteOutlined />} onClick={() => onDelete(book)} />
        )}
      </div>
    </div>
  );
} 