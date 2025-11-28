-- Simplified seed data (without ON CONFLICT)
-- Run this in Supabase SQL Editor

-- 1. Salary Roles
INSERT INTO salary_roles (role_name, min_salary, max_salary, median_salary, demand_level, growth_trend, competition_level, top_skills) VALUES
('software engineer', 80000, 180000, 120000, 'High', 'Stable', 'High', '["System Design", "AWS", "Kubernetes"]'),
('senior software engineer', 120000, 220000, 160000, 'High', 'Growing (↑ 8%)', 'High', '["System Design", "AWS", "Kubernetes"]'),
('data scientist', 90000, 190000, 130000, 'High', 'Growing (↑ 15%)', 'High', '["Deep Learning", "MLOps", "Python"]'),
('product manager', 100000, 200000, 140000, 'Medium', 'Stable', 'High', '["Cloud", "Agile", "Leadership"]'),
('frontend developer', 70000, 150000, 100000, 'Medium', 'Stable', 'Medium', '["React", "TypeScript", "Next.js"]'),
('backend developer', 80000, 170000, 115000, 'High', 'Stable', 'High', '["Microservices", "Docker", "PostgreSQL"]'),
('full stack developer', 85000, 175000, 120000, 'High', 'Growing (↑ 8%)', 'High', '["System Design", "AWS", "Kubernetes"]'),
('devops engineer', 90000, 180000, 125000, 'High', 'Growing (↑ 15%)', 'High', '["Cloud", "Agile", "Leadership"]'),
('machine learning engineer', 100000, 210000, 145000, 'High', 'Growing (↑ 15%)', 'High', '["Deep Learning", "MLOps", "Python"]'),
('ui ux designer', 65000, 140000, 95000, 'Medium', 'Stable', 'Medium', '["Cloud", "Agile", "Leadership"]'),
('qa engineer', 60000, 130000, 85000, 'Medium', 'Stable', 'Medium', '["Cloud", "Agile", "Leadership"]');

-- 2. Location Multipliers
INSERT INTO location_multipliers (location_name, multiplier) VALUES
('san francisco', 1.4),
('new york', 1.3),
('seattle', 1.25),
('boston', 1.2),
('austin', 1.1),
('remote', 1.0),
('bangalore', 0.3),
('london', 1.25);

-- 3. Interview Questions - Technical
INSERT INTO interview_questions (category, question_template, tip) VALUES
('technical', 'Explain your experience with {skill}', 'Prepare a specific example of using this skill in a project'),
('technical', 'How would you approach a problem involving {skill}?', 'Prepare a specific example of using this skill in a project'),
('technical', 'What is your proficiency level with {skill}?', 'Prepare a specific example of using this skill in a project'),
('technical', 'Can you walk me through a project where you used {skill}?', 'Prepare a specific example of using this skill in a project'),
('technical', 'What are the pros and cons of {skill} compared to alternatives?', 'Prepare a specific example of using this skill in a project');

-- 4. Interview Questions - Behavioral
INSERT INTO interview_questions (category, question_template, tip) VALUES
('behavioral', 'Tell me about a time when you faced a challenging project', 'Use the STAR method (Situation, Task, Action, Result)'),
('behavioral', 'How do you handle tight deadlines?', 'Use the STAR method (Situation, Task, Action, Result)'),
('behavioral', 'Describe a situation where you had to work with a difficult team member', 'Use the STAR method (Situation, Task, Action, Result)'),
('behavioral', 'What is your greatest professional achievement?', 'Use the STAR method (Situation, Task, Action, Result)'),
('behavioral', 'How do you stay updated with industry trends?', 'Use the STAR method (Situation, Task, Action, Result)'),
('behavioral', 'Describe a failure and what you learned from it', 'Use the STAR method (Situation, Task, Action, Result)');

-- 5. Interview Questions - Company
INSERT INTO interview_questions (category, question_template, tip) VALUES
('company', 'Why do you want to work at {company}?', 'Research the company''s mission, values, and recent news'),
('company', 'What do you know about {company}''s products/services?', 'Research the company''s mission, values, and recent news'),
('company', 'How do you align with {company}''s values?', 'Research the company''s mission, values, and recent news'),
('company', 'Where do you see yourself in 5 years at {company}?', 'Research the company''s mission, values, and recent news');

-- 6. Interview Questions - Role Specific
INSERT INTO interview_questions (category, question_template, tip) VALUES
('role_specific', 'Why are you interested in the {role} position?', 'Connect your experience to the job requirements'),
('role_specific', 'What makes you a good fit for {role}?', 'Connect your experience to the job requirements'),
('role_specific', 'What challenges do you anticipate in this {role}?', 'Connect your experience to the job requirements'),
('role_specific', 'How would you contribute to our team as a {role}?', 'Connect your experience to the job requirements');

-- 7. Interview Tips - Preparation
INSERT INTO interview_tips (stage, tip_text) VALUES
('preparation', 'Research the company thoroughly before the interview'),
('preparation', 'Practice your answers using the STAR method (Situation, Task, Action, Result)'),
('preparation', 'Prepare questions to ask the interviewer'),
('preparation', 'Review your resume and be ready to discuss each point'),
('preparation', 'Test your tech setup if it''s a virtual interview');

-- 8. Interview Tips - During
INSERT INTO interview_tips (stage, tip_text) VALUES
('during', 'Arrive 10-15 minutes early (or join virtual meeting early)'),
('during', 'Make eye contact and show enthusiasm'),
('during', 'Listen carefully to questions before answering'),
('during', 'Use specific examples from your experience'),
('during', 'It''s okay to ask for clarification if you don''t understand a question');

-- 9. Interview Tips - After
INSERT INTO interview_tips (stage, tip_text) VALUES
('after', 'Send a thank-you email within 24 hours'),
('after', 'Reflect on questions you found challenging'),
('after', 'Follow up on any action items mentioned'),
('after', 'Stay patient while waiting for a response'),
('after', 'Keep applying to other positions meanwhile');

-- 10. Domain Skills
INSERT INTO domain_skills (domain_name, skills_list) VALUES
('full_stack', '["react", "node.js", "javascript", "typescript", "mongodb", "express", "vue", "angular"]'),
('backend', '["python", "java", "spring boot", "django", "flask", "microservices", "rest api", "graphql"]'),
('frontend', '["react", "vue", "angular", "html", "css", "javascript", "typescript", "tailwind"]'),
('ai_ml', '["python", "tensorflow", "pytorch", "machine learning", "deep learning", "nlp", "computer vision"]'),
('data', '["python", "sql", "pandas", "numpy", "data analysis", "tableau", "power bi", "spark"]'),
('devops', '["docker", "kubernetes", "aws", "azure", "ci/cd", "jenkins", "terraform", "ansible"]'),
('mobile', '["react native", "flutter", "android", "ios", "swift", "kotlin", "java"]');
