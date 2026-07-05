import React, { useEffect, useState } from "react";
import {
  Layout,
  Card,
  Input,
  Image,
  Row,
  Col,
  Spin,
  Empty,
  Drawer,
  Menu,
  Button,
  message,
  Modal,
  Divider,
  Tag,
  Form,
  DatePicker,
  InputNumber,
  List,
  Radio,
  Select,
  
} from "antd";
import {
  MenuOutlined,
  HomeOutlined,
  CalendarOutlined,
  
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { API_BASE_URL } from "../../api";
const { Header, Footer, Content } = Layout;
const { Meta } = Card;
const { Search } = Input;

// Menu keys that are safe to restore from localStorage on page load.
// Booking-flow keys (4-7) depend on in-memory state (selectedPackage,
// bookingForm) that is NOT persisted, so restoring straight into those
// steps after a refresh would crash the app.
const RESTORABLE_MENU_KEYS = ["0", "2", "3"];

const PAYMENT_METHODS = [
  { label: "Credit Card", value: "Credit Card" },
  { label: "GCash", value: "GCash" },
  { label: "Bank Transfer", value: "Bank Transfer" },
];

function Navbar({ onSearch, selectedKey, onSelect, onSignOut }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("rememberedLogin");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("travellerSelectedMenu");
    onSignOut?.();
    message.success("Signed out successfully.");
    navigate("/");
  };

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const menuItems = [
    {
      key: "0",
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: "3",
      icon: <CalendarOutlined />,
      label: "My Bookings",
    },
  ];

  return (
    <div className="flex justify-between items-center h-full mx-6">
      <h1 className="text-xl font-bold text-white">Bisita NV</h1>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="hidden md:block">
          <Search
            placeholder="Search destinations or packages"
            onSearch={onSearch}
            style={{ width: 320 }}
            allowClear
          />
        </div>

        {/* Hamburger Menu */}
        <MenuOutlined
          style={{ color: "white", fontSize: "24px" }}
          onClick={showDrawer}
          className="cursor-pointer"
        />

        {/* Drawer Menu */}
        <Drawer
          title="Menu"
          placement="right"
          onClose={onClose}
          open={open}
          width={280}
          
        >
          <Menu
            mode="vertical"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={({ key }) => {
              onSelect(key);
              onClose();
            }}
            style={{ border: "none" }}
          />

          <div className="mt-8">
            <Button 
              danger 
              block 
              size="large"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </Drawer>
      </div>
    </div>
  );
}
function ViewDestination({
  loading,
  destinations,
  packages,
  query,
  isModalOpen,
  selectedDestination,
  setSelectedDestination,
  showModal,
  handleOk,
  handleCancel,
  onBookNow,
  viewPackages,
}) {
  const [showAllDestinations, setShowAllDestinations] = useState(false);
  const initialDestinationCount = 4;

  const filteredDestinations = destinations.filter((d) =>
    `${d.name || d.destinationName || ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  const filteredPackages = packages.filter((p) =>
    `${p.name || p.packageName || ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  const visibleDestinations = showAllDestinations
    ? filteredDestinations
    : filteredDestinations.slice(0, initialDestinationCount);

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-semibold my-6">Packages</h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : filteredPackages.length === 0 ? (
        <Empty description="No packages found" />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredPackages.map((pkg) => (
            <Col key={pkg.key} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                style={{
                  height: 400,
                  borderRadius: 10,
                  border: "1px solid #e0e0e0",
                  overflow: "hidden",
                }}
                cover={
                  pkg.imageUrl || pkg.packageImage ? (
                    <Image
                      src={pkg.imageUrl || pkg.packageImage}
                      alt={pkg.name || pkg.packageName}
                      preview={false}
                      style={{ height: 160, objectFit: "cover" }}
                    />
                  ) : null
                }
              >
                <Meta
                  title={pkg.name || pkg.packageName}
                  description={
                    <div
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {pkg.description || pkg.shortDescription || ""}
                    </div>
                  }
                />

                <div className="flex justify-between items-center mt-4 gap-3">
                  <Button
                    block
                    style={{
                      marginTop: 16,
                    }}
                    onClick={() => viewPackages(pkg)}
                  >
                    View Details
                  </Button>
                  <Button
                    type="primary"
                    block
                    style={{
                      marginTop: 16,
                      backgroundColor: "#005707",
                      border: "none",
                    }}
                    onClick={() => onBookNow(pkg)}
                  >
                    Book Now
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Divider className="my-8" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold mb-4">Popular Destinations</h2>
        {filteredDestinations.length > initialDestinationCount && (
          <div className="mt-6 flex justify-center">
            <Button
              type="primary"
              onClick={() => setShowAllDestinations((prev) => !prev)}
              style={{ backgroundColor: "#005707", border: "none" }}
            >
              {showAllDestinations ? "Show Less" : "View All"}
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : filteredDestinations.length === 0 ? (
        <Empty description="No destinations found" />
      ) : (
        <Row gutter={[16, 16]}>
          {visibleDestinations.map((dest) => (
            <Col
              key={dest._id || dest.id || dest.key}
              xs={24}
              sm={12}
              md={8}
              lg={6}
            >
              <Card
                onClick={() => {
                  setSelectedDestination(dest);
                  showModal();
                }}
                hoverable
                style={{
                  height: 400,
                  borderRadius: 10,
                  border: "1px solid #e0e0e0",
                  overflow: "hidden",
                }}
                cover={
                  (dest.imageUrl || dest.destinationImage) && (
                    <Image
                      src={dest.imageUrl || dest.destinationImage}
                      alt={
                        dest.name || dest.destinationName || dest.destination
                      }
                      preview={false}
                      style={{
                        height: 200,
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )
                }
              >
                <Meta
                  title={dest.name || dest.destinationName || dest.destination}
                  description={
                    <div
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {dest.description || "No description available."}
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title={selectedDestination.destination}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={850}
      >
        <div className="grid grid-cols-2 gap-8">
          <div>
            <Tag color="green">{selectedDestination.location}</Tag>
            <p className="mt-4 align-justify text-justify h-70 overflow-y-auto whitespace-pre-wrap hide-scrollbar">
              {selectedDestination.description || "No description available."}
            </p>
          </div>

          <div>
            {selectedDestination.imageUrl ||
            selectedDestination.destinationImage ? (
              <Image
                src={
                  selectedDestination.imageUrl ||
                  selectedDestination.destinationImage
                }
                alt={
                  selectedDestination.name ||
                  selectedDestination.destinationName
                }
                className="w-full h-full object-cover rounded-xl"
              />
            ) : null}
          </div>
        </div>
      </Modal>
    </div>
  );
}
function WelcomeSection({ currentUser }) {
  const [heroImage, setHeroImage] = useState("");

useEffect(() => {
  const fetchHero = async () => {
    try {
      const res = await axios.get(
          `${API_BASE_URL}/api/destinations/getDestination`
      );

      const firstImage = res.data.find(
        (d) => d.imageUrl || d.destinationImage
      );

      if (firstImage) {
        setHeroImage(firstImage.imageUrl || firstImage.destinationImage);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchHero();
}, []);
  return (
    <div
      className="relative mb-10 overflow-hidden rounded-3xl"
      style={{
        backgroundImage:
          "url(" + heroImage + ")",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: 280,
      }}
    >
      {/* Green gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,87,7,.88) 0%, rgba(0,87,7,.65) 45%, rgba(0,87,7,.25) 80%, rgba(0,87,7,.10) 100%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-center px-10 py-14 text-white">
        <p className="text-lg opacity-90">Welcome back,</p>

        <h1 className="mt-2 text-5xl font-bold">
          {currentUser?.username || "Traveler"} !
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-100">
          Discover breathtaking destinations, explore exciting travel packages,
          and create unforgettable memories across Nueva Vizcaya.
        </p>

       <div className="mt-8 flex gap-8">
  <div className="flex flex-col items-center">
    <span className="material-symbols-outlined text-4xl text-white">search</span>
    <p className="text-sm mt-2">Beautiful Destinations</p>
  </div>

  <div className="flex flex-col items-center">
    <span className="material-symbols-outlined text-4xl text-white">luggage</span>
    <p className="text-sm mt-2">Travel Packages</p>
  </div>

  <div className="flex flex-col items-center">
    <span className="material-symbols-outlined text-4xl text-white">star</span>
    <p className="text-sm mt-2">Best Experiences</p>
  </div>
</div>
      </div>
    </div>
  );
}

function Traveler() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(() => {
    const saved = localStorage.getItem("travellerSelectedMenu");
    return RESTORABLE_MENU_KEYS.includes(saved) ? saved : "0";
  });

  // Shared data/state, lifted here so both the fetch and ViewDestination
  // can use the same source of truth.
  const [loading, setLoading] = useState(false);
  const [destinations, setDestinations] = useState([]);

  const [packages, setPackages] = useState([]);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState({});
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingForm, setBookingForm] = useState(null);
  // Holds { paymentMethod } chosen on the payment step (step 7).
  const [transactionForm, setTransactionForm] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  // The booking document created as soon as the user hits "Continue to
  // book" (step 4) — holds the id returned by the API so later steps
  // (summary/payment) reference the same booking instead of creating a
  // new one.
  const [createdBooking, setCreatedBooking] = useState(null);
  const [creatingBooking, setCreatingBooking] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [viewedBooking, setViewedBooking] = useState(null);
  const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);
  const [form] = Form.useForm();
  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);
  const handleBookNow = (pkg) => {
    setSelectedPackage(pkg);
    setBookingForm(null);
    setCreatedBooking(null);
    setTransactionForm(null);
    setSelectedMenu("4");
  };

  useEffect(() => {
    const savedCurrentUser = localStorage.getItem("currentUser");

    if (!savedCurrentUser) {
      setCurrentUser(null);
      return;
    }

    try {
      setCurrentUser(JSON.parse(savedCurrentUser));
    } catch (error) {
      console.error("Failed to parse current user:", error);
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("travellerSelectedMenu", selectedMenu);
  }, [selectedMenu]);

  // If we land on a booking-flow step without the data it needs (e.g. after
  // a refresh, or navigating the drawer mid-flow), bounce back to Home
  // instead of letting the render crash.
  useEffect(() => {
    if ((selectedMenu === "4" || selectedMenu === "5") && !selectedPackage) {
      setSelectedMenu("0");
    }
    if (
      (selectedMenu === "6" || selectedMenu === "7") &&
      (!selectedPackage || !bookingForm || !createdBooking)
    ) {
      setSelectedMenu("0");
    }
  }, [selectedMenu, selectedPackage, bookingForm, createdBooking]);

  // Fetch destinations + packages once, on mount.
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [destRes, pkgRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/destinations/getDestination`),
          axios.get(`${API_BASE_URL}/api/packages/getAllPackages`),
        ]);

        setDestinations(
          (destRes.data || []).map((d) => ({
            ...d,
            key: d._id || d.id,
          })),
        );

        setPackages(
          (pkgRes.data || []).map((p) => ({
            ...p,
            key: p._id || p.id,
          })),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchBookings = async () => {
    if (!currentUser?._id) return;

    setBookingsLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/bookings/user/${currentUser._id}`,
      );
      setMyBookings(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const viewPackages = (pkg) => {
    setSelectedPackage(pkg);
    setSelectedMenu("5");
  };

  const onSearch = (value) => setQuery(value.trim());

  // Lets the user pay for a booking that was already created but is still
  // "Unpaid" — jumps straight to the payment step (7) using the booking's
  // own data, instead of forcing them to rebook from scratch. Needs the
  // matching package (for price/capacity) since the booking record itself
  // only stores packageName, not the full package details.
  const resumePayment = (booking) => {
    const bookingId = booking._id || booking.id;
    const matchedPackage = packages.find(
      (p) => (p._id || p.id) === (booking.packageId?._id || booking.packageId),
    );

    if (!matchedPackage) {
      message.error(
        "Couldn't find this package's details, so payment can't be resumed right now.",
      );
      return;
    }

    setSelectedPackage(matchedPackage);
    setBookingForm({
      tourdate: booking.travelDate ? dayjs(booking.travelDate) : null,
      no_of_travelers: booking.travelersCount,
      fullname: booking.fullName,
      phone: booking.phone,
    });
    setCreatedBooking({ _id: bookingId });
    setTransactionForm(null);
    setIsBookingDetailsOpen(false);
    setSelectedMenu("7");
  };

  // Creates the transaction record for the already-created booking.
  // Returns true on success, false on failure, so the caller can decide
  // what to do next (navigate away, show an error, etc.) instead of this
  // function silently swallowing the outcome.
  // The backend's createTransaction requires userId, bookingId,
  // paymentMethod, AND amount — all four are required or it 400s.
  const handlePayment = async (amount) => {
    if (!currentUser?._id) {
      message.error("You must be signed in to pay.");
      return false;
    }
    if (!createdBooking?._id && !createdBooking?.id) {
      message.error("No booking found to pay for.");
      return false;
    }
    if (!transactionForm?.paymentMethod) {
      message.warning("Please select a payment method.");
      return false;
    }
    if (!amount || amount <= 0) {
      message.error("Invalid payment amount.");
      return false;
    }

    setProcessingPayment(true);
    try {
      const transactionData = {
        userId: currentUser._id,
        bookingId: createdBooking._id || createdBooking.id,
        paymentMethod: transactionForm.paymentMethod,
        amount,
      };

      await axios.post(
        `${API_BASE_URL}/api/transactions/createTransaction`,
        transactionData,
      );

      return true;
    } catch (err) {
      console.error(err);
      message.error("Payment failed. Please try again.");
      return false;
    } finally {
      setProcessingPayment(false);
    }
  };

  const renderContent = () => {
      if (selectedMenu === "3") {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">My Bookings</h2>
            <p className="text-gray-500">Review the packages you've booked.</p>
          </div>

          {bookingsLoading ? (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : myBookings.length === 0 ? (
            <Empty description="You have no bookings yet" />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={myBookings}
              renderItem={(booking) => (
                <List.Item
                  key={booking._id || booking.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setViewedBooking(booking);
                    setIsBookingDetailsOpen(true);
                  }}
                  actions={[
                    ...(booking.paymentStatus !== "Paid"
                      ? [
                          <Button
                            type="primary"
                            style={{
                              backgroundColor: "#005707",
                              border: "none",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              resumePayment(booking);
                            }}
                          >
                            Pay Now
                          </Button>,
                        ]
                      : []),
                  ]}
                >
                  <List.Item.Meta
                    title={booking.packageName || booking.name}
                    description={
                      <div className="flex flex-col">
                        <span>Travel date: {booking.travelDate || "N/A"}</span>
                        <span>
                          Travelers: {booking.travelersCount ?? "N/A"}
                        </span>
                      </div>
                    }
                  />
                  {booking.paymentStatus && (
                    <Tag
                      color={
                        booking.paymentStatus === "Paid" ? "green" : "orange"
                      }
                    >
                      {booking.paymentStatus}
                    </Tag>
                  )}
                </List.Item>
              )}
            />
          )}

          <Modal
            title="Booking Details"
            open={isBookingDetailsOpen}
            onCancel={() => setIsBookingDetailsOpen(false)}
            footer={
              <div className="flex justify-end gap-2">
                {viewedBooking && viewedBooking.paymentStatus !== "Paid" && (
                  <Button
                    type="primary"
                    style={{ backgroundColor: "#005707", border: "none" }}
                    onClick={() => resumePayment(viewedBooking)}
                  >
                    Pay Now
                  </Button>
                )}
                <Button onClick={() => setIsBookingDetailsOpen(false)}>
                  Close
                </Button>
              </div>
            }
          >
            {viewedBooking && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Booking Reference</span>
                  <span>{viewedBooking._id || viewedBooking.id || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Package</span>
                  <span>{viewedBooking.packageName || viewedBooking.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Travel Date</span>
                  <span>{viewedBooking.travelDate || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Travelers</span>
                  <span>{viewedBooking.travelersCount ?? "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Full Name</span>
                  <span>{viewedBooking.fullName || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span>{viewedBooking.phone || "N/A"}</span>
                </div>
                <Divider />
                <div className="flex justify-between">
                  <span className="text-gray-500">Booking Status</span>
                  <Tag>{viewedBooking.status || "N/A"}</Tag>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Status</span>
                  <Tag
                    color={
                      viewedBooking.paymentStatus === "Paid"
                        ? "green"
                        : "orange"
                    }
                  >
                    {viewedBooking.paymentStatus || "N/A"}
                  </Tag>
                </div>
              </div>
            )}
          </Modal>
        </div>
      );
    } else if (selectedMenu === "4") {
      return (
        <>
          {selectedPackage ? (
            <div className="container mx-auto max-w-3xl py-6">
              <h1 className="text-lg font-semibold mb-4">Booking Form</h1>

              <p className=" font-semibold mb-4">
                Selected Package:{" "}
                {selectedPackage.name || selectedPackage.packageName}
              </p>

              <Form
                form={form}
                name="validateOnly"
                layout="vertical"
                autoComplete="off"
                onFinish={async (values) => {
                  if (!currentUser?._id) {
                    message.error("You must be signed in to book.");
                    return;
                  }

                  setCreatingBooking(true);
                  try {
                    const bookingData = {
                      userId: currentUser._id,
                      packageId: selectedPackage._id,
                      packageName:
                        selectedPackage.packageName || selectedPackage.name,
                      travelDate: values.tourdate?.format("YYYY-MM-DD"),
                      travelersCount: values.no_of_travelers,
                      fullName: values.fullname,
                      phone: values.phone,
                    };

                    const res = await axios.post(
                      `${API_BASE_URL}/api/bookings/create`,
                      bookingData,
                    );

                    setBookingForm(values);
                    setCreatedBooking(res.data);
                    setSelectedMenu("6");
                  } catch (err) {
                    console.error(err);
                    message.error(
                      "Could not create booking. Please try again.",
                    );
                  } finally {
                    setCreatingBooking(false);
                  }
                }}
                initialValues={{
                  fullname: currentUser?.username || "",
                }}
              >
                <Form.Item
                  name="tourdate"
                  label="Tour Date"
                  rules={[
                    { required: true, message: "Please select a tour date" },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  name="no_of_travelers"
                  label="Number of Travelers"
                  rules={[
                    {
                      required: true,
                      message: "Please enter travelers count",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={selectedPackage?.max_capacity}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  name="fullname"
                  label="Full Name"
                  rules={[
                    { required: true, message: "Please enter your full name" },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your phone number",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item>
                  <div className="flex  items-center gap-5 align-center justify-end">
                    <Button
                      onClick={() => setSelectedMenu("0")}
                      disabled={creatingBooking}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={creatingBooking}
                      style={{
                        backgroundColor: "#005707",
                        border: "none",
                      }}
                    >
                      Continue to book
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </div>
          ) : (
            <Empty description="Select a package to start a booking" />
          )}
        </>
      );
    } else if (selectedMenu === "5") {
      const packageImage =
        selectedPackage?.imageUrl || selectedPackage?.packageImage || "";

      return (
        <div className="mx-auto max-w-5xl">
          {selectedPackage ? (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#005707] to-[#0b7a12] px-6 py-4 text-white">
                <h1 className="text-xl font-bold">
                  {selectedPackage.name || selectedPackage.packageName}
                </h1>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-[1fr_0.9fr]">
                {/* Left - Image */}
                <div>
                  <div className="h-[420px] overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    {packageImage ? (
                      <Image
                        src={packageImage}
                        alt={
                          selectedPackage.name || selectedPackage.packageName
                        }
                        preview={false}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    ) : (
                      <Empty
                        className="h-full flex items-center justify-center"
                        description="No package image available."
                      />
                    )}
                  </div>
                </div>

                {/* Right - Details */}
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                      <p className="text-xs font-semibold uppercase text-gray-500">
                        Duration
                      </p>
                      <p className="mt-1 text-lg font-semibold">
                        {selectedPackage.duration_days || "N/A"} days
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                      <p className="text-xs font-semibold uppercase text-gray-500">
                        Difficulty
                      </p>
                      <p className="mt-1 text-lg font-semibold">
                        {selectedPackage.difficulty_level || "N/A"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                      <p className="text-xs font-semibold uppercase text-gray-500">
                        Price
                      </p>
                      <p className="mt-1 text-lg font-semibold text-green-700">
                        ₱{selectedPackage.price ?? "N/A"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                      <p className="text-xs font-semibold uppercase text-gray-500">
                        Capacity
                      </p>
                      <p className="mt-1 text-lg font-semibold">
                        {selectedPackage.max_capacity ?? "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Booking Advance */}
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Minimum Booking Advance
                    </p>

                    <p className="mt-2 text-sm text-gray-700">
                      {selectedPackage.min_booking_advance_days ?? 0} days
                      before travel
                    </p>
                  </div>

                  {/* Description */}
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Description
                    </p>

                    <p className="mt-2 max-h-28 overflow-y-auto hide-scrollbar whitespace-pre-line text-sm leading-6 text-gray-700">
                      {selectedPackage.description ||
                        selectedPackage.shortDescription ||
                        "No description available."}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2 justify-end">
                    <Button onClick={() => setSelectedMenu("0")}>Back</Button>
                    <Button
                      type="primary"
                      style={{
                        background: "#005707",
                        border: "none",
                      }}
                      onClick={() => handleBookNow(selectedPackage)}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Empty description="Select a package from the package list to view its details." />
          )}
        </div>
      );
    } else if (selectedMenu === "6") {
      if (!selectedPackage || !bookingForm || !createdBooking) {
        return <Empty description="No booking in progress." />;
      }

      return (
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>
            <p className="text-gray-500 mb-4">
              Booking reference:{" "}
              {createdBooking?._id || createdBooking?.id || "N/A"}
            </p>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Package</span>
                <span>
                  {selectedPackage?.packageName || selectedPackage?.name}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Travel Date</span>
                <span>
                  {bookingForm?.tourdate?.format("MMMM DD, YYYY") || "N/A"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Travelers</span>
                <span>{bookingForm?.no_of_travelers}</span>
              </div>

              <div className="flex justify-between">
                <span>Full Name</span>
                <span>{bookingForm?.fullname}</span>
              </div>

              <div className="flex justify-between">
                <span>Phone</span>
                <span>{bookingForm?.phone}</span>
              </div>

              <Divider />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-green-700">
                  ₱
                  {selectedPackage?.price * (bookingForm?.no_of_travelers || 0)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button onClick={() => setSelectedMenu("4")}>Back</Button>

              <Button
                type="primary"
                style={{
                  background: "#005707",
                  border: "none",
                }}
                onClick={() => setSelectedMenu("7")}
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        </div>
      );
    } else if (selectedMenu === "7") {
      if (!selectedPackage || !bookingForm || !createdBooking) {
        return <Empty description="No booking in progress." />;
      }

      const total =
        (bookingForm?.no_of_travelers || 0) * (selectedPackage?.price || 0);

      return (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Payment</h2>

          <Card>
            <p className="mb-4">Total Amount:</p>

            <h1 className="text-3xl font-bold text-green-700 mb-6">
              ₱{total.toLocaleString()}
            </h1>

            <p className="mb-2 text-sm font-medium text-gray-700">
              Select payment method
            </p>
            <Select
              placeholder="Select Payment Method"
              value={transactionForm?.paymentMethod}
              onChange={(value) =>
                setTransactionForm((prev) => ({
                  ...prev,
                  paymentMethod: value,
                }))
              }
              style={{ width: "100%", marginBottom: 24 }}
              options={PAYMENT_METHODS.map((method) => ({
                label: method.label,
                value: method.value,
              }))}
            />

            <Button
              type="primary"
              block
              loading={processingPayment}
              disabled={!transactionForm?.paymentMethod}
              style={{
                background: "#005707",
                border: "none",
              }}
              onClick={async () => {
                // The booking document already exists (created at step 4).
                // This just records the transaction against it — the
                // backend marks the booking's paymentStatus as
                // 'Paid' automatically when the transaction is made.
                const success = await handlePayment(total);
                if (!success) return;

                message.success("Payment successful! Booking confirmed.");

                form.resetFields();
                setSelectedPackage(null);
                setBookingForm(null);
                setCreatedBooking(null);
                setTransactionForm(null);
                await fetchBookings();
                setSelectedMenu("3");
              }}
            >
              Pay Now
            </Button>
          </Card>
        </div>
      );
    }

    return (
      <>
        <WelcomeSection currentUser={currentUser} />
        <ViewDestination
          loading={loading}
          destinations={destinations}
          packages={packages}
          query={query}
          isModalOpen={isModalOpen}
          selectedDestination={selectedDestination}
          setSelectedDestination={setSelectedDestination}
          showModal={showModal}
          handleOk={handleOk}
          handleCancel={handleCancel}
          onBookNow={handleBookNow}
          viewPackages={viewPackages}
        />
      </>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{ backgroundColor: "#005707" }}
        className="sticky top-0 z-50"
      >
        <Navbar
          onSearch={onSearch}
          selectedKey={selectedMenu}
          onSelect={setSelectedMenu}
          onSignOut={() => setCurrentUser(null)}
        />
      </Header>

      <Content className="py-8 px-6">{renderContent()}</Content>

      <Footer
        style={{
          textAlign: "center",
          fontSize: "1.6vh",
          color: "rgba(0, 0, 0, 0.45)",
        }}
      >
        © 2026 SIA, Inc.
      </Footer>
    </Layout>
  );
}

export default Traveler;
