import React from "react";
import { Typography, Image, Button } from "antd";
import { useNavigate } from "react-router-dom";

const { Text, Paragraph } = Typography;

const Page404 = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white flex flex-col justify-center items-center">
      <div className="lg:py-20 py-10 px-8 flex flex-col justify-center items-center">
        <Image
          preview={false}
          className="lg:max-w-md mx-auto mb-3"
          src="../assets/images/no-credit-vendor-img.svg"
        />
        <Text className="text-[#2C2C2E] md:text-2xl text-xl font-normal mt-2 mb-2">
          Content Unavailable
        </Text>
        <Paragraph>
          The information you requested is currently not accessible. We
          apologize for the inconvenience.
        </Paragraph>
        <Button
          type=""
          onClick={() => navigate("/")}
          style={{ color: "#fff" }}
          className="bg-primary w-full max-w-[220px] mx-auto h-10"
        >
          Go back
        </Button>
      </div>
    </section>
  );
};

export default Page404;
