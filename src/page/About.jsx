import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaShoppingBag, FaMedal, FaHeart } from 'react-icons/fa';

const About = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stats = [
    {
      icon: <FaUsers className="text-4xl" />,
      number: "10,000+",
      label: "Khách hàng hài lòng"
    },
    {
      icon: <FaShoppingBag className="text-4xl" />,
      number: "5,000+",
      label: "Sản phẩm đa dạng"
    },
    {
      icon: <FaMedal className="text-4xl" />,
      number: "100%",
      label: "Chất lượng đảm bảo"
    },
    {
      icon: <FaHeart className="text-4xl" />,
      number: "98%",
      label: "Khách hàng quay lại"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white max-w-2xl"
          >
            <h1 className="text-5xl font-bold mb-4">Về Chúng Tôi</h1>
            <p className="text-xl">Khám phá câu chuyện đằng sau thương hiệu của chúng tôi</p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Câu Chuyện Của Chúng Tôi</h2>
              <p className="text-gray-600 mb-4">
                Thành lập năm 2024, chúng tôi đã và đang nỗ lực mang đến những sản phẩm chất lượng cao
                với giá cả hợp lý cho người tiêu dùng Việt Nam.
              </p>
              <p className="text-gray-600">
                Với tầm nhìn trở thành đơn vị bán lẻ hàng đầu, chúng tôi luôn đặt chất lượng sản phẩm
                và trải nghiệm khách hàng lên hàng đầu.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-[400px] rounded-lg overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVhbXxlbnwwfHwwfHx8MA%3D%3D"
                alt="Our Team"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-blue-500 mb-4">{stat.icon}</div>
                <h3 className="text-3xl font-bold mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Sứ Mệnh Của Chúng Tôi</h2>
            <p className="text-gray-600 mb-8">
              Chúng tôi cam kết mang đến những sản phẩm chất lượng cao với giá cả hợp lý,
              đồng thời tạo ra trải nghiệm mua sắm tuyệt vời cho mọi khách hàng.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Chất Lượng</h3>
                <p className="text-gray-600">Cam kết chất lượng sản phẩm tốt nhất</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Giá Cả</h3>
                <p className="text-gray-600">Mang đến giá cả cạnh tranh nhất</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Dịch Vụ</h3>
                <p className="text-gray-600">Chăm sóc khách hàng tận tâm</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About; 