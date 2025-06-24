import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Flex,
  Typography,
  Layout,
  Spin,
  Select,
} from "antd";
import { Svgs } from "../Svgs/svg-icons";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchAllBookAsync,
  updateBookAsync,
} from "../../store/books/bookSlice";

const { Text } = Typography;
const { Content } = Layout;

const EditBook = ({ data }) => {
  console.log(data, "data here");
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    title: String(data.title),
    description: String(data.description),
    author: data.author ? String(data.author) : "",
    genre: String(data.genre),
    publishedYear: Number(data.publishedYear),
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let id = data._id;
      const resultAction = await dispatch(
        updateBookAsync({ id, ...formValues })
      );
      if (resultAction && resultAction?.payload) {
        await dispatch(fetchAllBookAsync());
        toast.success("Book has been updated");
        setFormValues({
          title: String(data.title),
          description: String(data.description),
          author: data.author ? String(data.author) : "",
          genre: String(data.genre),
          publishedYear: Number(data.publishedYear),
        });
        setIsModalOpen(false);
      } else if (resultAction?.error?.message) {
        toast.error(resultAction?.error?.message || "something went wrong");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div onClick={showModal} className="flex gap-2">
        {Svgs.editg}
        Edit Book
      </div>
      <Modal destroyOnClose open={isModalOpen} onCancel={handleCancel}>
        <Content className="flex flex-col">
          <Text className="text-primary md:text-[32px] text-xl font-medium text-center">
            Edit Book
          </Text>
          <div className="flex flex-col justify-center items-center mt-5">
            <Text className="text-sm font-normal text-[#303030] text-center mb-2">
              Please fill the details below to edit Book.
            </Text>
          </div>
          <Form
            name="login"
            size="large"
            layout="vertical"
            onFinish={handleSubmit}
            style={{
              width: "100%",
              maxWidth: "500px",
              margin: "15px auto 0 auto",
              fontWeight: "500",
              fontSize: "14px",
            }}
            className="flex flex-col gap-3"
          >
            <Form.Item label="Title:">
              <Input
                size="large"
                placeholder="Imaginary World"
                className="super__select text-sm font-normal text-dark h-14"
                value={formValues.title}
                onChange={(e) =>
                  setFormValues({ ...formValues, title: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Description:">
              <Input
                size="large"
                placeholder="This book is about ideality"
                className="super__select text-sm font-normal text-dark h-14"
                value={formValues.description}
                onChange={(e) =>
                  setFormValues({ ...formValues, description: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Author:">
              <Input
                size="large"
                placeholder="Muhammad Huzaifa Khan"
                className="super__select text-sm font-normal text-dark h-14"
                value={formValues.author}
                onChange={(e) =>
                  setFormValues({ ...formValues, author: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Genre:">
              <Input
                size="large"
                placeholder="Imaginary World"
                className="super__select text-sm font-normal text-dark h-14"
                value={formValues.genre}
                onChange={(e) =>
                  setFormValues({ ...formValues, genre: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Published Year:">
              <Input
                size="large"
                placeholder="2020"
                className="super__select text-sm font-normal text-dark h-14"
                value={formValues.publishedYear}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    publishedYear: e.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item>
              <Flex vertical style={{ marginTop: 20 }}>
                <Spin spinning={loading}>
                  <div className="flex">
                    <Button
                      className="bg-primary border border-primary text-white hover:bg-white hover:text-primary rounded-xl !h-14 transition-all ease-out w-full max-w-[320px] mx-auto"
                      type=""
                      htmlType="submit"
                      block
                    >
                      Update
                    </Button>
                  </div>
                </Spin>
              </Flex>
            </Form.Item>
          </Form>
        </Content>
      </Modal>
    </div>
  );
};

export default EditBook;
