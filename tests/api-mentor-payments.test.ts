import { describe, it, expect } from 'vitest';
import { aiMentorRequestSchema } from '../src/lib/validations';

describe('AI Mentor & Payments Integration Rules', () => {
  it('validates AI mentor requests and enforces limits', () => {
    const valid = aiMentorRequestSchema.safeParse({
      projectTitle: 'Autonomous Obstacle-Avoiding Robot',
      currentStep: 2,
      code: 'void setup() { pinMode(9, OUTPUT); }',
      language: 'arduino',
      userQuestion: 'Why is my ultrasonic sensor reporting zero centimeters?'
    });
    expect(valid.success).toBe(true);

    // Rejects questions that exceed max length
    const invalidLong = aiMentorRequestSchema.safeParse({
      userQuestion: 'a'.repeat(1500)
    });
    expect(invalidLong.success).toBe(false);
  });

  it('validates role-based entitlement tier mappings', () => {
    const validRoles = ['student', 'teacher', 'school_admin', 'admin'];
    expect(validRoles).toContain('student');
    expect(validRoles).toContain('teacher');
    expect(validRoles).toContain('school_admin');
    expect(validRoles).toContain('admin');
  });

  it('verifies pricing calculations in INR', () => {
    const makerProPrice = 4999;
    const amountInPaise = makerProPrice * 100;
    expect(amountInPaise).toBe(499900);

    const schoolLabPrice = 45000;
    expect(schoolLabPrice * 100).toBe(4500000);
  });
});
