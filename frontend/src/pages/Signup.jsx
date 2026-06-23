import React from "react";
import { useState } from "react";

import { Modal, Button } from "antd";

const Signup = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button
                    size="lg"
                    className="rounded-full px-8 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 w-full sm:w-auto"
                    style={{
                      background: "#005707",
                      color: "#fff",
                      fontFamily: "'Nunito', sans-serif",
                      border: "none",
                    }}
                    onClick={() =>
                     showModal()
                    }
                  >
                    Get Started
                  </Button>
      <Modal
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={false}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <div className="flex flex-col gap-4  items-center h-60">
          <h1 className="text-2xl font-bold">Sign Up</h1>
          <div
            className="flex gap-8 text-lg font-semibold mt-10"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            <div className="cursor-pointer hover:scale-105 transition-colors bg-green-700 text-white px-7 py-5 rounded w-40 text-center">
              Traveler
            </div>
            <div className="cursor-pointer hover:scale-105 transition-colors bg-green-700 text-white px-7 py-5 rounded w-40 text-center">
              Agent
            </div>
          </div>
          <p className="text-sm ">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-green-700 hover:underline"
              style={{ color: "#005707" }}
            >
              Log in
            </a>
          </p>
        </div>
      </Modal>
    </>
  );
};

export default Signup;
