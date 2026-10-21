import { z } from 'zod';

export const userRoleEnum = z.enum(['student', 'teacher', 'school_admin', 'admin']);
export const projectCategoryEnum = z.enum([
  'Robotics',
  'Electronics',
  'Arduino & Microcontrollers',
  'Coding & Python',
  'Artificial Intelligence',
  'Internet of Things',
  'STEM Science',
  'Advanced Innovation'
]);
export const difficultyEnum = z.enum(['Beginner', 'Intermediate', 'Advanced']);
export const accessTierEnum = z.enum(['free', 'premium']);

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name is required (min 2 characters)'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
  role: userRoleEnum.default('student'),
  gradeLevel: z.string().optional(),
  schoolId: z.string().optional(),
  parentEmail: z.string().email().optional().or(z.literal(''))
});

export const projectSchema = z.object({
  title: z.string().min(3, 'Title is required (min 3 chars)'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug must be lower-case kebab-case'),
  summary: z.string().min(10, 'Summary is required (min 10 chars)'),
  description: z.string().min(20, 'Detailed description is required'),
  category: projectCategoryEnum,
  grade_min: z.number().int().min(1).max(12),
  grade_max: z.number().int().min(1).max(12),
  difficulty: difficultyEnum,
  estimated_hours: z.number().positive(),
  estimated_cost_inr: z.number().nonnegative().optional(),
  tools_required: z.array(z.string()).default([]),
  learning_objectives: z.array(z.string()).min(1, 'Provide at least one learning objective'),
  safety_notes: z.array(z.string()).default([]),
  cover_image: z.string().url().or(z.string().startsWith('/')),
  starter_code: z.string().optional(),
  starter_language: z.enum(['python', 'javascript', 'arduino', 'cpp']).default('python'),
  troubleshooting_guide: z.array(z.object({
    problem: z.string(),
    solution: z.string()
  })).default([]),
  submission_requirements: z.array(z.string()).default([]),
  access_tier: accessTierEnum.default('free'),
  is_published: z.boolean().default(true),
  is_featured: z.boolean().default(false)
});

export const workspaceSaveSchema = z.object({
  studentProjectId: z.string().min(1),
  activeCode: z.string(),
  activeLanguage: z.string(),
  currentStep: z.number().int().min(1),
  progressPercent: z.number().min(0).max(100),
  studentNotes: z.string().default('')
});

export const submissionSchema = z.object({
  studentProjectId: z.string().min(1),
  assignmentId: z.string().optional().nullable(),
  title: z.string().min(3, 'Submission title must be at least 3 characters'),
  explanation: z.string().min(20, 'Please explain how your project works (min 20 characters)'),
  learnings: z.string().min(15, 'Tell us what you learned during this build'),
  challengesFaced: z.string().min(10, 'Mention any challenges or bugs you solved'),
  videoUrl: z.string().url('Must be a valid video link').optional().or(z.literal('')),
  codeSnapshot: z.string().optional()
});

export const rubricScoreSchema = z.object({
  criterion: z.string(),
  max_points: z.number(),
  score: z.number().min(0),
  feedback: z.string().optional()
});

export const reviewSchema = z.object({
  submissionId: z.string().min(1),
  overallScore: z.number().min(0).max(30),
  rubricScores: z.array(rubricScoreSchema),
  writtenFeedback: z.string().min(10, 'Feedback must provide constructive details (min 10 characters)'),
  status: z.enum(['approved', 'changes_requested'])
});

export const assignmentSchema = z.object({
  classId: z.string().min(1, 'Class is required'),
  projectId: z.string().min(1, 'Project is required'),
  title: z.string().min(3, 'Title is required'),
  description: z.string().default(''),
  dueDate: z.string().min(1, 'Due date is required'),
  pointsPossible: z.number().int().positive().default(100)
});

export const classGroupSchema = z.object({
  schoolId: z.string().min(1, 'School is required'),
  name: z.string().min(2, 'Class name is required (e.g. Grade 8 Robotics)'),
  grade: z.string().min(1, 'Grade is required'),
  section: z.string().min(1, 'Section is required (e.g. A)'),
  academicYear: z.string().default('2026-2027')
});

export const portfolioSettingsSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  customBio: z.string().max(500, 'Bio cannot exceed 500 characters'),
  isPublic: z.boolean(),
  showSchool: z.boolean()
});

export const aiMentorRequestSchema = z.object({
  projectId: z.string().optional(),
  projectTitle: z.string().optional(),
  currentStep: z.number().optional(),
  code: z.string().max(8000, 'Code snapshot is too large').optional(),
  language: z.string().optional(),
  userQuestion: z.string().min(2, 'Question is required').max(1000, 'Question too long')
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type WorkspaceSaveInput = z.infer<typeof workspaceSaveSchema>;
export type SubmissionInput = z.infer<typeof submissionSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type AssignmentInput = z.infer<typeof assignmentSchema>;
export type ClassGroupInput = z.infer<typeof classGroupSchema>;
export type PortfolioSettingsInput = z.infer<typeof portfolioSettingsSchema>;
export type AIMentorRequestInput = z.infer<typeof aiMentorRequestSchema>;
