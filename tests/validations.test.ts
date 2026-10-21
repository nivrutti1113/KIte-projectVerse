import { describe, it, expect } from 'vitest';
import { 
  loginSchema, 
  signupSchema, 
  projectSchema, 
  workspaceSaveSchema, 
  submissionSchema, 
  reviewSchema 
} from '../src/lib/validations';

describe('Validation Schemas (Zod)', () => {
  it('validates correct login credentials', () => {
    const valid = loginSchema.safeParse({
      email: 'student@kite.test',
      password: 'password123'
    });
    expect(valid.success).toBe(true);
  });

  it('rejects invalid login email', () => {
    const invalid = loginSchema.safeParse({
      email: 'not-an-email',
      password: '123'
    });
    expect(invalid.success).toBe(false);
  });

  it('validates student signup data with role and parent email', () => {
    const valid = signupSchema.safeParse({
      email: 'aarav@school.edu.in',
      password: 'strongPassword123',
      fullName: 'Aarav Sharma',
      username: 'aarav_maker',
      role: 'student',
      gradeLevel: 'Class 8',
      parentEmail: 'parent.sharma@example.in'
    });
    expect(valid.success).toBe(true);
  });

  it('validates project creation schema', () => {
    const valid = projectSchema.safeParse({
      title: 'Smart Plant Waterer',
      slug: 'smart-plant-waterer',
      summary: 'Automated irrigation monitor for potted plants using moisture sensor.',
      description: 'Full description explaining capacitive soil physics and ADC conversion math.',
      category: 'Internet of Things',
      grade_min: 5,
      grade_max: 9,
      difficulty: 'Beginner',
      estimated_hours: 3,
      estimated_cost_inr: 850,
      tools_required: ['Screwdriver'],
      learning_objectives: ['ADC sensor conversion', 'Relay logic'],
      safety_notes: ['Keep electronics dry'],
      cover_image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae',
      starter_code: 'void setup() {} void loop() {}',
      starter_language: 'arduino',
      troubleshooting_guide: [{ problem: 'No water', solution: 'Check relay' }],
      submission_requirements: ['Video', 'Photos'],
      access_tier: 'free',
      is_published: true,
      is_featured: false
    });
    expect(valid.success).toBe(true);
  });

  it('validates student workspace save payload', () => {
    const valid = workspaceSaveSchema.safeParse({
      studentProjectId: 'sp-001',
      activeCode: 'digitalWrite(13, HIGH);',
      activeLanguage: 'arduino',
      currentStep: 2,
      progressPercent: 40,
      studentNotes: 'Tested motor pins.'
    });
    expect(valid.success).toBe(true);
  });

  it('validates student submission requirements', () => {
    const valid = submissionSchema.safeParse({
      studentProjectId: 'sp-001',
      title: 'Obstacle Rover Final Build',
      explanation: 'Constructed 2WD robot with ultrasonic distance sensor on Arduino Uno.',
      learnings: 'Understood pulse width modulation and sonar time of flight.',
      challengesFaced: 'One motor turned backwards until I swapped IN1 and IN2.',
      videoUrl: 'https://youtu.be/sample-rover'
    });
    expect(valid.success).toBe(true);
  });

  it('validates mentor review rubric scores', () => {
    const valid = reviewSchema.safeParse({
      submissionId: 'sub-001',
      overallScore: 28,
      rubricScores: [
        { criterion: 'Functionality', max_points: 5, score: 5 },
        { criterion: 'Understanding', max_points: 5, score: 5 },
        { criterion: 'Code Quality', max_points: 5, score: 4 },
        { criterion: 'Creativity', max_points: 5, score: 5 },
        { criterion: 'Documentation', max_points: 5, score: 5 },
        { criterion: 'Safety', max_points: 5, score: 4 }
      ],
      writtenFeedback: 'Excellent autonomous navigation and well-commented code.',
      status: 'approved'
    });
    expect(valid.success).toBe(true);
  });
});
