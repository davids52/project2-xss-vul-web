-- Chèn dữ liệu mẫu vào bảng posts (5 bài viết)
INSERT INTO posts (author, post_title, avatar_url, content) VALUES
('Nguyễn Văn A', 'Hướng dẫn lập trình React cơ bản', 'static/avatars/avatar_1.png', 'React là một thư viện JavaScript phổ biến cho việc xây dựng giao diện người dùng...'),
('Trần Thị B', 'JavaScript ES6 Features', 'static/avatars/avatar_2.png', 'ES6 mang đến nhiều tính năng mới giúp code JavaScript trở nên clean và dễ bảo trì hơn...'),
('Lê Văn C', 'Database Design Best Practices', 'static/avatars/avatar_3.png', 'Thiết kế database tốt là nền tảng cho mọi ứng dụng thành công...'),
('Phạm Thị D', 'Python cho người mới bắt đầu', 'static/avatars/avatar_4.png', 'Python là ngôn ngữ lập trình dễ học, mạnh mẽ và có cộng đồng hỗ trợ lớn...'),
('Hoàng Văn E', 'DevOps cơ bản với Docker', 'static/avatars/avatar_5.png', 'Docker giúp đóng gói ứng dụng và các dependencies thành containers...');

-- Chèn dữ liệu mẫu vào bảng comments (2 comments cho 2 post)
INSERT INTO comments (post_id, commentor, star, title, content) VALUES
(1, 'Michal Jackson', 5, 'Bài viết rất hay!', 'Cảm ơn tác giả đã chia sẻ kiến thức bổ ích về React. Mình đã học được nhiều điều từ bài viết này.'),
(3, 'Jack J97', 4, 'Nội dung hữu ích', 'Bài viết cung cấp những nguyên tắc thiết kế database rất thực tế và dễ áp dụng.');