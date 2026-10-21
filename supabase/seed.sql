-- ==============================================================================
-- KITE ProjectVerse - Starter Seed Data
-- ==============================================================================

-- 1. Insert Default Badges
INSERT INTO public.badges (id, code, title, description, icon, category, criteria) VALUES
('b1111111-1111-1111-1111-111111111111', 'FIRST_CIRCUIT', 'First Circuit', 'Assembled and powered your first functional electronic circuit.', 'Zap', 'hardware', 'Complete an electronics or circuit project.'),
('b2222222-2222-2222-2222-222222222222', 'CODE_COMMANDER', 'Code Commander', 'Wrote, debugged, and saved embedded software in ProjectVerse.', 'Terminal', 'coding', 'Save and test project code in the workspace.'),
('b3333333-3333-3333-3333-333333333333', 'ROBOTICS_PIONEER', 'Robotics Pioneer', 'Successfully built and tested an autonomous obstacle-avoiding robot.', 'Bot', 'robotics', 'Complete and submit a verified robotics project.'),
('b4444444-4444-4444-4444-444444444444', 'AI_EXPLORER', 'AI Explorer', 'Trained or integrated computer vision or machine learning algorithms.', 'Cpu', 'innovation', 'Complete an AI or machine learning project.'),
('b5555555-5555-5555-5555-555555555555', 'GREEN_INNOVATOR', 'Green Innovator', 'Constructed an environmental, sustainable, or solar-powered STEM system.', 'Leaf', 'mastery', 'Complete an eco-technology or solar project.')
ON CONFLICT (code) DO NOTHING;

-- 2. Insert Default Subscription Plans
INSERT INTO public.plans (id, code, name, price_inr, billing_interval, description, features, is_active) VALUES
('p1111111-1111-1111-1111-111111111111', 'FREE_EXPLORER', 'Explorer (Free)', 0, 'lifetime', 'For curious young makers starting their STEM journey', '["Access to 10+ core beginner projects", "Standard Web Code Editor", "Public STEM Maker Portfolio", "Basic AI Mentor guidance (5 queries/day)"]'::jsonb, true),
('p2222222-2222-2222-2222-222222222222', 'MAKER_PRO', 'Maker Pro', 4999, 'year', 'Full access to advanced AI, IoT, and competitive robotics kits', '["Unlimited access to 100+ projects", "Advanced AI Mentor with code explanation", "Direct Mentor Feedback & Scoring Rubrics", "Verified Digital Certificates & Badges", "Competition Readiness Projects"]'::jsonb, true)
ON CONFLICT (code) DO NOTHING;

-- 3. Insert Demo Schools
INSERT INTO public.schools (id, name, code, city, state, board, contact_email, plan_tier, is_active) VALUES
('s1111111-1111-1111-1111-111111111111', 'KITE Innovation Model School', 'KITE-DL-01', 'New Delhi', 'Delhi', 'CBSE', 'stem@kiteschool.edu.in', 'premium_institution', true),
('s2222222-2222-2222-2222-222222222222', 'Bengaluru STEM Academy', 'BLR-STEM-02', 'Bengaluru', 'Karnataka', 'ICSE', 'lab@blrstem.ac.in', 'standard', true)
ON CONFLICT (code) DO NOTHING;

-- 4. Projects are seeded in the local repository and DB migrations.
