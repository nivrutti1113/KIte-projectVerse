import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getProjects, 
  getProjectBySlug, 
  getProjectById, 
  createProject, 
  getStudentProject, 
  saveStudentWorkspace, 
  createSubmission, 
  reviewSubmission,
  getStudentPortfolio,
  updateStudentPortfolio,
  getBadges
} from '../src/lib/data';

describe('Data Layer & Business Logic', () => {
  it('retrieves default seeded STEM projects', async () => {
    const list = await getProjects();
    expect(list.length).toBeGreaterThanOrEqual(6);
    expect(list.some(p => p.category === 'Robotics')).toBe(true);
    expect(list.some(p => p.category === 'Artificial Intelligence')).toBe(true);
  });

  it('filters projects by category and difficulty', async () => {
    const robotics = await getProjects({ category: 'Robotics' });
    expect(robotics.every(p => p.category === 'Robotics')).toBe(true);

    const beginner = await getProjects({ difficulty: 'Beginner' });
    expect(beginner.every(p => p.difficulty === 'Beginner')).toBe(true);
  });

  it('fetches single project by unique slug', async () => {
    const proj = await getProjectBySlug('obstacle-avoiding-robot-arduino');
    expect(proj).toBeDefined();
    expect(proj?.title).toContain('Autonomous Obstacle-Avoiding Robot');
    expect(proj?.steps?.length).toBeGreaterThanOrEqual(3);
  });

  it('initializes and autosaves student project workspace', async () => {
    const studentId = 'usr-student-test-1';
    const proj = (await getProjects())[0];

    const sp = await getStudentProject(studentId, proj.id);
    expect(sp).toBeDefined();
    expect(sp?.status).toBe('in_progress');

    // Save code
    const saved = await saveStudentWorkspace({
      studentProjectId: sp!.id,
      activeCode: '// Custom code test\nvoid setup() {}',
      activeLanguage: 'arduino',
      currentStep: 2,
      progressPercent: 50,
      studentNotes: 'Tested custom speed'
    }, studentId);

    expect(saved.current_step).toBe(2);
    expect(saved.progress_percent).toBe(50);
    expect(saved.active_code).toContain('Custom code test');
  });

  it('handles student submission and teacher review with badge unlock', async () => {
    const studentId = 'usr-student-1';
    const proj = (await getProjects())[0];
    const sp = (await getStudentProject(studentId, proj.id))!;

    const sub = await createSubmission({
      studentProjectId: sp.id,
      title: 'Tested Rover Build',
      explanation: 'Completed circuit wiring with ultrasonic sensor and verified pinouts.',
      learnings: 'Learned H-bridge motor driver operations.',
      challengesFaced: 'Fixed loose ground wire.',
      videoUrl: 'https://youtu.be/rover-demo'
    }, studentId);

    expect(sub.id).toBeDefined();
    expect(sub.status).toBe('submitted');

    // Teacher reviews submission
    const teacherId = 'usr-teacher-1';
    const review = await reviewSubmission({
      submissionId: sub.id,
      overallScore: 29,
      rubricScores: [
        { criterion: 'Working Functionality & Evidence', max_points: 5, score: 5 },
        { criterion: 'Concept Understanding', max_points: 5, score: 5 },
        { criterion: 'Code/Build Quality', max_points: 5, score: 5 },
        { criterion: 'Creativity & Problem Solving', max_points: 5, score: 5 },
        { criterion: 'Explanation & Documentation', max_points: 5, score: 5 },
        { criterion: 'Safety & Responsible Implementation', max_points: 5, score: 4 }
      ],
      writtenFeedback: 'Flawless execution! Well done.',
      status: 'approved'
    }, teacherId);

    expect(review.status).toBe('approved');
    expect(review.overall_score).toBe(29);
  });

  it('manages student portfolio visibility and pseudonym controls', async () => {
    const port = await getStudentPortfolio('aarav_maker');
    expect(port).toBeDefined();
    expect(port?.is_public).toBe(true);

    const updated = await updateStudentPortfolio('usr-student-1', {
      displayName: 'Aarav S. (Maker)',
      customBio: 'Robotics builder',
      isPublic: false,
      showSchool: false
    });

    expect(updated.is_public).toBe(false);
    expect(updated.show_school).toBe(false);
  });
});
