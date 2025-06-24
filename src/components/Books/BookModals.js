import React from "react";
import { Modal, Input, Button } from "antd";

export function AddBookModal({ open, onCancel, onOk, inputValue, onInputChange, error, loading }) {
  return (
    <Modal
      title="Create New Book"
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      okButtonProps={{ disabled: !inputValue.trim(), loading }}
    >
      <div className="mb-2 text-gray-500">Start writing your next masterpiece</div>
      <label className="block mb-2 font-medium">Book Title</label>
      <Input
        value={inputValue}
        onChange={onInputChange}
        placeholder="Enter book title"
        status={error ? "error" : ""}
      />
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
      <Button
        type="primary"
        className="mt-4 w-full"
        onClick={onOk}
        disabled={!inputValue.trim()}
        loading={loading}
      >
        Submit
      </Button>
    </Modal>
  );
}

export function EditBookModal({ open, onCancel, onOk, inputValue, onInputChange, loading }) {
  return (
    <Modal
      title="Edit Book"
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      okButtonProps={{ disabled: !inputValue.trim(), loading }}
    >
      <label className="block mb-2 font-medium">Book Title</label>
      <Input
        value={inputValue}
        onChange={onInputChange}
        placeholder="Enter book title"
      />
      <Button
        type="primary"
        className="mt-4 w-full"
        onClick={onOk}
        disabled={!inputValue.trim()}
        loading={loading}
      >
        Submit
      </Button>
    </Modal>
  );
} 