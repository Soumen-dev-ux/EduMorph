-- Insert sample courses
INSERT INTO courses (title, description, instructor, category, level, duration, price, rating, students_count) VALUES
('Advanced Calculus Mastery', 'Master advanced calculus concepts with AI-powered personalized learning paths', 'Dr. Sarah Johnson', 'Mathematics', 'advanced', '12 weeks', 89.00, 4.9, 2847),
('Machine Learning Fundamentals', 'Learn ML from scratch with hands-on projects and AI-guided practice', 'Prof. Michael Chen', 'Computer Science', 'intermediate', '16 weeks', 129.00, 4.8, 5234),
('Creative Writing Workshop', 'Develop your writing skills with AI-powered feedback and peer collaboration', 'Emma Rodriguez', 'Literature', 'beginner', '8 weeks', 59.00, 4.7, 1892),
('Quantum Physics Basics', 'Introduction to quantum mechanics with interactive simulations', 'Dr. Robert Wilson', 'Physics', 'intermediate', '10 weeks', 79.00, 4.6, 1456),
('Digital Marketing Strategy', 'Learn modern digital marketing with real-world case studies', 'Maria Garcia', 'Business', 'beginner', '6 weeks', 49.00, 4.5, 3421),
('Data Structures & Algorithms', 'Comprehensive course on fundamental CS concepts', 'Dr. Alex Kumar', 'Computer Science', 'intermediate', '14 weeks', 99.00, 4.8, 4567),
('World History: Modern Era', 'Explore modern world history with interactive timelines', 'Prof. Lisa Thompson', 'History', 'beginner', '12 weeks', 69.00, 4.6, 2134),
('Organic Chemistry', 'Master organic chemistry with 3D molecular visualizations', 'Dr. James Park', 'Chemistry', 'advanced', '16 weeks', 119.00, 4.7, 1876);

-- Insert sample users (for testing)
INSERT INTO users (email, name, role, institution, learning_style) VALUES
('student@example.com', 'Jordan Smith', 'student', 'University of Technology', 'visual'),
('teacher@example.com', 'Dr. Emily Davis', 'teacher', 'University of Technology', 'kinesthetic'),
('admin@example.com', 'Admin User', 'admin', 'EduMorph', 'auditory');
