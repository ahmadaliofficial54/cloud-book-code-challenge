import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BookOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Typography, Tag, Modal } from "antd";

const { Text } = Typography;

function Header() {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("useremail");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setIsLogoutModalOpen(false);
    navigate("/login");
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-[#e5e7eb] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center bg-[#eaf1fd] rounded-lg p-2">
            <BookOutlined className="text-[#2563eb] text-2xl" />
          </span>
          <span className="text-2xl font-bold text-gray-900 tracking-tight select-none">Cloud Book Writer</span>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3 bg-[#f6f8fc] px-4 py-2 rounded-xl border border-[#e5e7eb] shadow-sm">
              <span className="inline-flex items-center justify-center bg-[#eaf1fd] rounded-full w-10 h-10">
                <UserOutlined className="text-[#2563eb] text-xl" />
              </span>
              <div className="flex flex-col justify-center">
                <Text className="font-semibold text-base text-[#222] leading-tight">{user.name || user.email}</Text>
                <Tag color="blue" className="text-xs font-medium mt-1 self-start rounded">{user.role}</Tag>
              </div>
            </div>
          )}
          <Button
            onClick={handleLogout}
            type="primary"
            className="h-10 px-6 rounded-lg font-semibold bg-[#2563eb] border-[#2563eb] text-white hover:bg-white hover:text-[#2563eb] hover:border-[#2563eb] transition-all"
          >
            Logout
          </Button>
          <Modal
            title="Confirm Logout"
            open={isLogoutModalOpen}
            onCancel={cancelLogout}
            footer={null}
          >
            <p>Are you sure you want to logout?</p>
            <div className="flex justify-end gap-2 mt-6">
              <Button onClick={cancelLogout}>
                Cancel
              </Button>
              <Button type="primary" danger onClick={confirmLogout}>
                Logout
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    </header>
  );
}

export default Header;
