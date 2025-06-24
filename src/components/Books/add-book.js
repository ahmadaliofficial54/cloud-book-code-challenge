import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Flex,
  Typography,
  Layout,
  Spin,
} from "antd";
import { Svgs } from "../Svgs/svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createBookAsync } from "../../store/books/bookSlice";
import { fetchAllBookAsync } from "../../store/books/bookSlice";

const { Text } = Typography;
const { Content } = Layout;
const AddBook = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState("");

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    author: "",
    genre: "",
    publishedYear: "",
  });
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setFormValues({
      title: "",
      description: "",
      author: "",
      genre: "",
      publishedYear: "",
    });
    setIsModalOpen(false);
  };

  const onFinish = async () => {
    try {
      setLoading(true);

      const resultAction = await dispatch(createBookAsync(formValues));
      const response = resultAction.payload;
      if (resultAction.error) {
        toast.error(resultAction.error.message);
      } else if (resultAction) {
        if (response) {
          toast.success("book has been created.");
          dispatch(fetchAllBookAsync());
          handleCancel();
        } else {
          toast.error(response?.message || "Something went wrong");
        }
      }
    } catch (error) {
      console.error("Form submission error:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Button
        onClick={showModal}
        className="bg-primary flex justify-center items-center w-full max-w-[180px] py-5 text-base font-normal text-white rounded-lg"
        type=""
        icon={Svgs.addiconw}
      >
        Add New Book
      </Button>
      <Modal open={isModalOpen} onCancel={handleCancel}>
        <Content className="flex flex-col">
          <Text className="text-primary md:text-[32px] text-xl font-medium text-center">
            Add New Book
          </Text>
          <div className="flex flex-col justify-center items-center mt-5">
            <Text className="text-sm font-normal text-[#303030] text-center mb-2">
              Please fill the details below to add new Book.
            </Text>
          </div>
          <Form
            name="login"
            size="large"
            layout="vertical"
            onFinish={onFinish}
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
                placeholder="Soulmate"
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
                      Save
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

export default AddBook;
