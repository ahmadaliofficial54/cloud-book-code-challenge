import { Form, Input, Typography, Spin, Radio } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { addUser } from "../store/user/userSlice";
import AuthCard from "../components/Auth/AuthCard";
import AuthLogo from "../components/Auth/AuthLogo";
import PrimaryButton from "../components/Common/PrimaryButton";

const { Title, Text } = Typography;

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({ name: "", email: "", password: "", role: "collaborator" });

  const onFinish = async () => {
    try {
      setLoading(true);
      const resultAction = await dispatch(addUser({ ...formValues }));
      const response = resultAction.payload;
      if (resultAction.error) {
        message.error(resultAction.payload?.message || "Registration failed");
      } else if (resultAction) {
        if (response) {
          message.success("Sign Up Successful!");
          setTimeout(() => { navigate("/login"); }, 1500);
        } else {
          message.error(response?.message || "Something went wrong");
        }
      }
    } catch (error) {
      message.error(error.message);
      navigate("/signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthLogo />
      <Title level={2} className="!mb-1 !mt-6 !text-3xl !font-bold text-center">Create your account</Title>
      <Text className="block text-gray-500 text-base mb-6 text-center">Sign up to get started with your book writing platform</Text>
      <Form
        name="signup"
        size="large"
        layout="vertical"
        className="w-full"
        onFinish={onFinish}
        validateMessages={{ required: "${label} is required", types: { email: "${label} is not a valid email" } }}
        initialValues={formValues}
      >
        <Form.Item label={<span className="font-semibold">Name</span>} name="name" rules={[{ required: true }, { min: 3 }]} hasFeedback>
          <Input
            placeholder="Enter your name"
            value={formValues.name}
            onChange={e => setFormValues({ ...formValues, name: e.target.value })}
            className="rounded-lg h-12 text-base"
            autoComplete="name"
          />
        </Form.Item>
        <Form.Item label={<span className="font-semibold">Email</span>} name="email" rules={[{ required: true }, { type: "email" }]} hasFeedback>
          <Input
            placeholder="Enter your email"
            value={formValues.email}
            onChange={e => setFormValues({ ...formValues, email: e.target.value })}
            className="rounded-lg h-12 text-base"
            autoComplete="email"
          />
        </Form.Item>
        <Form.Item label={<span className="font-semibold">Password</span>} name="password" rules={[{ required: true }, { min: 6 }, { max: 25 }]} hasFeedback>
          <Input.Password
            placeholder="Enter your password"
            value={formValues.password}
            onChange={e => setFormValues({ ...formValues, password: e.target.value })}
            className="rounded-lg h-12 text-base"
            autoComplete="new-password"
          />
        </Form.Item>
        <Form.Item label={<span className="font-semibold">Role</span>} name="role" rules={[{ required: true }]} hasFeedback>
          <Radio.Group
            value={formValues.role}
            onChange={e => setFormValues({ ...formValues, role: e.target.value })}
            className="w-full flex gap-4"
          >
            <Radio value="author">Author</Radio>
            <Radio value="collaborator">Collaborator</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item className="mb-2">
          <Spin spinning={loading}>
            <PrimaryButton
              htmlType="submit"
              block
    
            >
              Create Account
            </PrimaryButton>
          </Spin>
        </Form.Item>
        <div className="text-center mt-2 text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-[#2563eb] font-medium hover:underline">Log in</Link>
        </div>
      </Form>
    </AuthCard>
  );
};

export default SignUp;
