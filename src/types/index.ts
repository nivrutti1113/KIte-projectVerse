// Core domain types for KITE ProjectVerse

export type UserRole = 'student' | 'teacher' | 'school_admin' | 'admin';

export type ProjectCategory = 
  | 'Robotics'
  | 'Electronics'
  | 'Arduino & Microcontrollers'
  | 'Coding & Python'
  | 'Artificial Intelligence'
  | 'Internet of Things'
  | 'STEM Science'
  | 'Advanced Innovation';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type AccessTier = 'free' | 'premium';

export type ProjectStatus = 
  | 'not_started'
  | 'in_progress'
  | 'submitted'
  | 'changes_requested'
  | 'completed';

export type SubmissionStatus = 
  | 'submitted'
  | 'under_review'
  | 'changes_requested'
  | 'approved';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  username: string;
  role: UserRole;
  grade_level?: string;
  school_id?: string;
  school_name?: string;
  bio?: string;
  avatar_url?: string;
  parent_email?: string;
  is_active: boolean;
  created_at: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  board: 'CBSE' | 'ICSE' | 'State Board' | 'IB' | 'Other';
  contact_email: string;
  plan_tier: 'standard' | 'premium_institution';
  is_active: boolean;
  student_count?: number;
  teacher_count?: number;
  created_at: string;
}

export interface ClassGroup {
  id: string;
  school_id: string;
  teacher_id: string;
  teacher_name?: string;
  name: string;
  grade: string;
  section: string;
  academic_year: string;
  join_code: string;
  student_count?: number;
  created_at: string;
}

export interface ProjectComponent {
  id: string;
  project_id: string;
  name: string;
  quantity: number;
  description?: string;
  component_type: 'hardware' | 'sensor' | 'controller' | 'tool' | 'software';
  purchase_url?: string;
}

export interface WiringConnection {
  from_component: string;
  from_pin: string;
  to_component: string;
  to_pin: string;
  wire_color: 'red' | 'black' | 'blue' | 'green' | 'yellow' | 'orange' | 'purple' | 'white';
  signal_type: 'power' | 'ground' | 'digital' | 'analog' | 'pwm' | 'i2c' | 'spi';
  description: string;
}

export interface ProjectStep {
  id: string;
  project_id: string;
  step_number: number;
  title: string;
  content: string;
  media_url?: string;
  code_snippet?: string;
  tips?: string;
  wiring_connections?: WiringConnection[];
  diagram_focus?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: ProjectCategory;
  grade_min: number;
  grade_max: number;
  difficulty: DifficultyLevel;
  estimated_hours: number;
  estimated_cost_inr?: number;
  tools_required: string[];
  learning_objectives: string[];
  safety_notes: string[];
  cover_image: string;
  starter_code?: string;
  starter_language: 'python' | 'javascript' | 'arduino' | 'cpp';
  troubleshooting_guide: { problem: string; solution: string }[];
  submission_requirements: string[];
  access_tier: AccessTier;
  is_published: boolean;
  is_featured: boolean;
  author_id?: string;
  author_name?: string;
  components?: ProjectComponent[];
  steps?: ProjectStep[];
  wiring_connections?: WiringConnection[];
  circuit_schematic_type?: 'arduino_robot' | 'smart_plant' | 'solar_tracker' | 'iot_esp32' | 'ai_camera' | 'smart_home';
  created_at: string;
  updated_at: string;
}

export interface StudentProject {
  id: string;
  student_id: string;
  project_id: string;
  project?: Project;
  status: ProjectStatus;
  current_step: number;
  progress_percent: number;
  active_code: string;
  active_language: string;
  student_notes: string;
  started_at: string;
  last_saved_at: string;
  completed_at?: string;
}

export interface CodeRevision {
  id: string;
  student_project_id: string;
  code: string;
  language: string;
  notes?: string;
  created_at: string;
}

export interface ProjectSubmission {
  id: string;
  student_project_id: string;
  assignment_id?: string;
  student_id: string;
  student_name?: string;
  student_username?: string;
  project_id: string;
  project_title?: string;
  title: string;
  explanation: string;
  learnings: string;
  challenges_faced: string;
  video_url?: string;
  code_snapshot?: string;
  files?: SubmissionFile[];
  status: SubmissionStatus;
  review?: MentorReview;
  submitted_at: string;
  updated_at: string;
}

export interface SubmissionFile {
  id: string;
  submission_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size_bytes: number;
  uploaded_at: string;
}

export interface RubricScore {
  criterion: string;
  max_points: number;
  score: number;
  feedback?: string;
}

export interface MentorReview {
  id: string;
  submission_id: string;
  reviewer_id: string;
  reviewer_name?: string;
  overall_score: number;
  max_score: number;
  rubric_scores: RubricScore[];
  written_feedback: string;
  status: 'approved' | 'changes_requested';
  reviewed_at: string;
}

export interface Assignment {
  id: string;
  class_id: string;
  class_name?: string;
  project_id: string;
  project_title?: string;
  teacher_id: string;
  title: string;
  description: string;
  due_date: string;
  points_possible: number;
  submissions_count?: number;
  status: 'active' | 'closed';
  created_at: string;
}

export interface Badge {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  category: 'robotics' | 'coding' | 'hardware' | 'innovation' | 'mastery';
  criteria: string;
  awarded_at?: string;
}

export interface StudentBadge {
  id: string;
  student_id: string;
  badge_id: string;
  badge?: Badge;
  awarded_at: string;
  reason: string;
}

export interface StudentPortfolio {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  custom_bio: string;
  is_public: boolean;
  show_school: boolean;
  school_name?: string;
  grade_level?: string;
  featured_badge?: Badge;
  completed_projects: {
    student_project_id: string;
    project_id: string;
    project_title: string;
    project_slug: string;
    category: ProjectCategory;
    cover_image: string;
    completed_at: string;
    student_reflection: string;
    score?: number;
  }[];
  earned_badges: Badge[];
  skills: string[];
  updated_at: string;
}

export interface InAppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  link?: string;
  type: 'info' | 'success' | 'warning' | 'assignment' | 'badge';
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name?: string;
  action: string;
  target_type: string;
  target_id: string;
  details: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}
