import { Button, Breadcrumb, message, Form, Input, Checkbox } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import http from "../../utils/http";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      message.error("Vui lòng nhập đầy đủ thông tin đăng nhập!");
      return;
    }
  
    setLoading(true);
    try {
      const response = await http.get(
        `/users?email=${username}&password=${password}`
      );
  
      if (response.data.length > 0) {
        const user = response.data[0];
        if (user.role === 'admin') {
          login(user.token, user.role, user.id, user.fullName);
          navigate("/admin/users");
          return;
        }
        if (user.status === "banned") {
          message.error("Tài khoản của bạn đã bị chặn. Không thể đăng nhập.");
          return;
        }
        login(user.token, user.role, user.id, user.fullName);
        message.success("Đăng nhập thành công!");
        navigate("/");
      } else {
        message.error("Tên đăng nhập hoặc mật khẩu không đúng!");
      }
    } catch {
      message.error("Có lỗi xảy ra khi đăng nhập.");
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="w-full max-w-5xl bg-white rounded-lg mx-auto mb-20">
      <div className="mb-16">
        <Breadcrumb
          items={[
            {
              title: <Link to="/">Home</Link>,
            },
            {
              title: <div className="text-green-600">Đăng nhập</div>,
            },
          ]}
        />
      </div>
      <div className="flex w-full">
        <div className="w-1/2 pr-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-6">
            THÔNG TIN CÁ NHÂN
          </h2>
           <Form onFinish={handleLogin} layout="vertical">
            <Form.Item label="Email của bạn">
              <Input
                placeholder="Nhập email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Item>

           <Form.Item label="Mật khẩu">
              <Input.Password
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Checkbox>Ghi nhớ tài khoản</Checkbox>
               <Link
                to="/"
                className="float-right text-green-600 hover:text-green-500"
              >
                Bạn quên mật khẩu?
              </Link>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="button"
                loading={loading}
                block
                className="bg-green-500 hover:bg-green-600 border-none"
                onClick={handleLogin}
              >
                ĐĂNG NHẬP
              </Button>
            </Form.Item>
          </Form> 
        </div>
        
        <div className="w-1/2 pl-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            BẠN CHƯA CÓ TÀI KHOẢN?
          </h2>
          <p className="text-gray-600 mb-6">
            Đăng ký tài khoản ngay để có thể mua hàng nhanh chóng và dễ dàng
            hơn! Ngoài ra còn có rất nhiều chính sách và ưu đãi cho các thành
            viên.
          </p>
          <Link to="/signup" className="text-white">
            <Button
              type="primary"
              className="bg-green-500 hover:bg-green-600 border-none"
              block
            >
              ĐĂNG KÝ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
