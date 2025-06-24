import React, { useState } from "react";
import { Form, Input, Typography, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/user/userSlice";
import { useDispatch } from "react-redux";
import { message } from "antd";
import AuthCard from "../components/Auth/AuthCard";
import AuthLogo from "../components/Auth/AuthLogo";
import PrimaryButton from "../components/Common/PrimaryButton";

const { Title, Text } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({ email: "", password: "" });

  const onFinish = async () => {
    try {
      setLoading(true);
      const resultAction = await dispatch(login(formValues));
      const response = resultAction.payload;
      if (response && response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("useremail", response.email);
        localStorage.setItem("userId", response.id);
        localStorage.setItem("role", response.role);
        message.success(response.message || "Login successful!");
        setTimeout(() => { window.location.pathname = "/"; }, 1000);
      } else {
        message.error((response && response.message) || "Login failed: Invalid Credentials");
      }
    } catch (error) {
      message.error("Login failed: " + error.message);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthLogo />
      <Title level={2} className="!mb-1 !mt-6 !text-3xl !font-bold text-center">Welcome Back</Title>
      <Text className="block text-gray-500 text-base mb-6 text-center">Sign in to your book writing platform</Text>
      <Form
        name="login"
        size="large"
        layout="vertical"
        className="w-full"
        onFinish={onFinish}
        validateMessages={{ required: "${label} is required", types: { email: "${label} is not a valid email" } }}
        initialValues={{ email: formValues.email, password: formValues.password }}
      >
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
            autoComplete="current-password"
          />
        </Form.Item>
        <Form.Item className="mb-2">
          <Spin spinning={loading}>
            <PrimaryButton
              htmlType="submit"
              block
            >
              Sign In
            </PrimaryButton>
          </Spin>
        </Form.Item>
        <div className="text-center mt-2 text-gray-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#2563eb] font-medium hover:underline">Sign up</Link>
        </div>
      </Form>
    </AuthCard>
  );
};

export default Login;
