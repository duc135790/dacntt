import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Middleware bảo vệ route (yêu cầu đăng nhập)
const protect = async (req, res, next) => {
    let token;

    // Đọc token từ header 'Authorization'
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Lấy token
            token = req.headers.authorization.split(' ')[1];
            
            // Giải mã token để lấy id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Lấy thông tin user (không bao gồm password)
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ 
                    message: 'Không có quyền truy cập, người dùng không tồn tại' 
                });
            }
            
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ 
                message: 'Không có quyền truy cập, token không hợp lệ' 
            });
        }
    } else {
        res.status(401).json({ 
            message: 'Không có quyền truy cập, không tìm thấy token' 
        });
    }
};

// Middleware kiểm tra quyền admin
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ 
            message: 'Không có quyền truy cập, yêu cầu quyền Admin' 
        });
    }
};

export { protect, admin };