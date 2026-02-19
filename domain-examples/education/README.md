# Education - Learning Management & Student Information System

## Overview

Comprehensive education platform demonstrating learning management, student information systems, online assessment, grade management, and educational analytics for K-12 and higher education.

## 🎯 Domain Requirements

### Business Goals

- **Learning Management**: Course delivery, content management, assignments, discussions
- **Student Information**: Enrollment, grades, attendance, transcripts
- **Assessment**: Online testing, automated grading, plagiarism detection
- **Communication**: Parent portals, announcements, messaging
- **Analytics**: Learning outcomes, student progress, institutional effectiveness

### Technical Challenges

- **Scale**: Thousands of concurrent users during peak times (exam periods)
- **Accessibility**: WCAG 2.1 AA compliance, multi-language support
- **Privacy**: FERPA, COPPA compliance for student data
- **Integration**: SIS, LMS, authentication (SSO, SAML, LTI)
- **Content Delivery**: Video streaming, document rendering, interactive content
- **Offline Access**: Mobile apps with sync capabilities

## 🏗️ Architecture

### Pattern: Microservices + Event-Driven + Content Delivery

```
┌──────────────────────────────────────────────────────────────────┐
│              Student/Faculty/Parent Portals                       │
│        (Web, Mobile, LTI-integrated Tools)                       │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│         API Gateway + Authentication (SSO/SAML)                   │
└───┬────────────┬─────────────────┬────────────────────────────┬──┘
    │            │                 │                            │
    ▼            ▼                 ▼                            ▼
┌─────────┐ ┌──────────┐ ┌────────────────┐ ┌─────────────────┐
│ Course  │ │ Student  │ │   Assessment   │ │   Gradebook     │
│ Service │ │Information│ │   Engine       │ │   Service       │
└────┬────┘ └────┬─────┘ └────────┬───────┘ └────────┬────────┘
     │           │                 │                   │
     │ Events    │ Events          │ Events            │ Events
     ▼           ▼                 ▼                   ▼
┌──────────────────────────────────────────────────────────────────┐
│                 Event Bus (Kafka)                                 │
│   - EnrollmentCreated  - AssignmentSubmitted                     │
│   - GradePosted        - CourseCompleted                         │
└───┬────────────┬────────────────┬─────────────────────────────┬─┘
    │            │                │                             │
    ▼            ▼                ▼                             ▼
┌─────────┐ ┌──────────┐ ┌────────────┐ ┌──────────────────────┐
│Content  │ │Analytics │ │Notification│ │   Communication      │
│Delivery │ │& Reports │ │Service     │ │   (Email/SMS/Push)   │
│(CDN/S3) │ │          │ │            │ │                      │
└────┬────┘ └────┬─────┘ └────────────┘ └──────────────────────┘
     │           │
     ▼           ▼
┌──────────────────────────────────────────┐
│     Database (PostgreSQL + MongoDB)      │
│   - Student Records  - Course Content    │
│   - Grades          - Learning Analytics │
└──────────────────────────────────────────┘
```

## 💻 Code Examples

### Student and Course Models

```python
# models/student.py
from dataclasses import dataclass
from datetime import date, datetime
from typing import List, Optional
from enum import Enum

class EnrollmentStatus(Enum):
    ACTIVE = "active"
    DROPPED = "dropped"
    COMPLETED = "completed"
    WITHDRAWN = "withdrawn"

class GradeLevel(Enum):
    K = "kindergarten"
    G1 = "grade_1"
    # ... G2-G12
    FRESHMAN = "freshman"
    SOPHOMORE = "sophomore"
    JUNIOR = "junior"
    SENIOR = "senior"

@dataclass
class Student:
    student_id: str
    first_name: str
    last_name: str
    email: str
    date_of_birth: date

    # Academic
    grade_level: GradeLevel
    major: Optional[str] = None
    advisor_id: Optional[str] = None

    # Contact
    phone: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[dict] = None

    # Status
    active: bool = True
    enrollment_date: date = None
    expected_graduation: date = None

    # Parents (for K-12)
    parent_ids: List[str] = None

    def __post_init__(self):
        if self.parent_ids is None:
            self.parent_ids = []

@dataclass
class Course:
    course_id: str
    course_code: str
    title: str
    description: str

    # Academic
    credits: int
    department: str
    instructor_ids: List[str]

    # Schedule
    term: str  # Fall 2024, Spring 2025, etc.
    start_date: date
    end_date: date
    meeting_times: List[dict]  # [{day: 'MWF', time: '10:00-11:00', room: '101'}]

    # Enrollment
    max_students: int
    enrolled_count: int = 0
    waitlist_count: int = 0

    # Prerequisites
    prerequisite_course_ids: List[str] = None

    def __post_init__(self):
        if self.prerequisite_course_ids is None:
            self.prerequisite_course_ids = []

@dataclass
class Enrollment:
    enrollment_id: str
    student_id: str
    course_id: str
    term: str

    status: EnrollmentStatus
    enrollment_date: datetime
    drop_date: Optional[datetime] = None

    # Grades
    grade: Optional[str] = None  # A, B+, C, etc.
    grade_points: Optional[float] = None
    credits_earned: Optional[int] = None

@dataclass
class Assignment:
    assignment_id: str
    course_id: str
    title: str
    description: str

    # Dates
    assigned_date: datetime
    due_date: datetime
    available_until: Optional[datetime] = None

    # Grading
    points_possible: int
    weight: float  # Percentage of final grade

    # Settings
    allow_late_submission: bool = False
    late_penalty_pct: float = 0.0

    # Content
    instructions_url: Optional[str] = None
    rubric: Optional[dict] = None

@dataclass
class Submission:
    submission_id: str
    assignment_id: str
    student_id: str

    submitted_at: datetime
    late: bool

    # Content
    submission_files: List[str]
    submission_text: Optional[str] = None

    # Grading
    points_earned: Optional[float] = None
    feedback: Optional[str] = None
    graded_at: Optional[datetime] = None
    graded_by: Optional[str] = None

    # Plagiarism check
    similarity_score: Optional[float] = None
```

### Gradebook Service

```python
# services/gradebook_service.py
from decimal import Decimal
from typing import List, Dict
from datetime import datetime

class GradebookService:
    """Grade calculation and management"""

    # Standard grading scale
    GRADE_SCALE = {
        'A': (93, 100),
        'A-': (90, 92.99),
        'B+': (87, 89.99),
        'B': (83, 86.99),
        'B-': (80, 82.99),
        'C+': (77, 79.99),
        'C': (73, 76.99),
        'C-': (70, 72.99),
        'D+': (67, 69.99),
        'D': (63, 66.99),
        'D-': (60, 62.99),
        'F': (0, 59.99)
    }

    GRADE_POINTS = {
        'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'F': 0.0
    }

    async def calculate_course_grade(
        self,
        student_id: str,
        course_id: str
    ) -> Dict:
        """Calculate student's grade for a course"""

        # Get all assignments and submissions
        assignments = await self._get_course_assignments(course_id)
        submissions = await self._get_student_submissions(student_id, course_id)

        submission_map = {s.assignment_id: s for s in submissions}

        # Calculate weighted score
        total_weight = Decimal('0')
        earned_points = Decimal('0')

        category_scores = {}

        for assignment in assignments:
            submission = submission_map.get(assignment.assignment_id)

            if submission and submission.points_earned is not None:
                # Assignment is graded
                points = Decimal(str(submission.points_earned))
                possible = Decimal(str(assignment.points_possible))
                weight = Decimal(str(assignment.weight))

                # Calculate percentage
                if possible > 0:
                    percentage = points / possible
                    weighted_score = percentage * weight

                    earned_points += weighted_score
                    total_weight += weight

                    # Track by category if applicable
                    category = assignment.get('category', 'other')
                    if category not in category_scores:
                        category_scores[category] = {
                            'earned': Decimal('0'),
                            'weight': Decimal('0')
                        }

                    category_scores[category]['earned'] += weighted_score
                    category_scores[category]['weight'] += weight

        # Calculate final percentage
        if total_weight > 0:
            final_percentage = (earned_points / total_weight) * 100
        else:
            final_percentage = Decimal('0')

        # Convert to letter grade
        letter_grade = self._percentage_to_letter(float(final_percentage))
        grade_points = self.GRADE_POINTS[letter_grade]

        return {
            'student_id': student_id,
            'course_id': course_id,
            'percentage': float(final_percentage),
            'letter_grade': letter_grade,
            'grade_points': grade_points,
            'category_breakdown': {
                cat: {
                    'percentage': float((scores['earned'] / scores['weight']) * 100)
                    if scores['weight'] > 0 else 0
                }
                for cat, scores in category_scores.items()
            },
            'calculated_at': datetime.utcnow().isoformat()
        }

    def _percentage_to_letter(self, percentage: float) -> str:
        """Convert percentage to letter grade"""
        for grade, (min_pct, max_pct) in self.GRADE_SCALE.items():
            if min_pct <= percentage <= max_pct:
                return grade
        return 'F'

    async def calculate_gpa(
        self,
        student_id: str,
        term: Optional[str] = None
    ) -> Dict:
        """Calculate GPA (cumulative or term-specific)"""

        # Get all enrollments
        enrollments = await self._get_student_enrollments(
            student_id,
            term=term,
            status=EnrollmentStatus.COMPLETED
        )

        total_points = Decimal('0')
        total_credits = Decimal('0')

        for enrollment in enrollments:
            if enrollment.grade and enrollment.credits_earned:
                grade_points = Decimal(str(self.GRADE_POINTS.get(enrollment.grade, 0)))
                credits = Decimal(str(enrollment.credits_earned))

                total_points += grade_points * credits
                total_credits += credits

        if total_credits > 0:
            gpa = total_points / total_credits
        else:
            gpa = Decimal('0')

        return {
            'student_id': student_id,
            'term': term,
            'gpa': float(gpa.quantize(Decimal('0.01'))),
            'credits_earned': float(total_credits),
            'courses_completed': len(enrollments)
        }
```

### Assessment Engine

```python
# services/assessment_engine.py
from typing import List, Dict
from datetime import datetime
import asyncio

class AssessmentEngine:
    """Online testing and automated grading"""

    async def grade_submission(
        self,
        submission: Submission,
        assignment: Assignment
    ) -> Dict:
        """Grade a student submission"""

        # Get rubric
        rubric = assignment.rubric

        if not rubric:
            # Manual grading required
            return {
                'status': 'pending_manual_grading',
                'submission_id': submission.submission_id
            }

        # Auto-grade based on question types
        total_points = 0
        earned_points = 0
        feedback_items = []

        for question in rubric['questions']:
            question_id = question['id']
            question_type = question['type']
            points_possible = question['points']

            # Get student answer
            student_answer = submission.get('answers', {}).get(question_id)

            if not student_answer:
                feedback_items.append({
                    'question_id': question_id,
                    'points_earned': 0,
                    'points_possible': points_possible,
                    'feedback': 'No answer provided'
                })
                total_points += points_possible
                continue

            # Grade based on type
            if question_type == 'multiple_choice':
                points = self._grade_multiple_choice(
                    student_answer,
                    question['correct_answer'],
                    points_possible
                )
            elif question_type == 'true_false':
                points = self._grade_true_false(
                    student_answer,
                    question['correct_answer'],
                    points_possible
                )
            elif question_type == 'short_answer':
                points = await self._grade_short_answer(
                    student_answer,
                    question['acceptable_answers'],
                    points_possible
                )
            elif question_type == 'essay':
                # Requires manual grading
                points = None
            else:
                points = 0

            if points is not None:
                earned_points += points
                total_points += points_possible

                feedback_items.append({
                    'question_id': question_id,
                    'points_earned': points,
                    'points_possible': points_possible,
                    'correct': points == points_possible
                })

        # Calculate percentage
        if total_points > 0:
            percentage = (earned_points / total_points) * 100
        else:
            percentage = 0

        return {
            'submission_id': submission.submission_id,
            'status': 'graded',
            'points_earned': earned_points,
            'points_possible': total_points,
            'percentage': percentage,
            'feedback': feedback_items,
            'graded_at': datetime.utcnow().isoformat()
        }

    def _grade_multiple_choice(
        self,
        student_answer: str,
        correct_answer: str,
        points: int
    ) -> int:
        """Grade multiple choice question"""
        return points if student_answer == correct_answer else 0

    async def _grade_short_answer(
        self,
        student_answer: str,
        acceptable_answers: List[str],
        points: int
    ) -> int:
        """Grade short answer with fuzzy matching"""
        from fuzzywuzzy import fuzz

        # Normalize
        student_normalized = student_answer.lower().strip()

        for acceptable in acceptable_answers:
            acceptable_normalized = acceptable.lower().strip()

            # Exact match
            if student_normalized == acceptable_normalized:
                return points

            # Fuzzy match (90% similarity)
            similarity = fuzz.ratio(student_normalized, acceptable_normalized)
            if similarity >= 90:
                return points

        return 0

    async def check_plagiarism(
        self,
        submission: Submission,
        assignment: Assignment
    ) -> Dict:
        """Check submission for plagiarism"""

        # Get submission content
        content = await self._get_submission_content(submission)

        # Compare against previous submissions
        previous_submissions = await self._get_previous_submissions(
            assignment.course_id,
            assignment.assignment_id
        )

        # Compare against external sources (simplified)
        # Real implementation would use Turnitin, Copyscape, etc.

        max_similarity = 0
        similar_submission = None

        for prev in previous_submissions:
            if prev.submission_id == submission.submission_id:
                continue

            prev_content = await self._get_submission_content(prev)

            # Calculate similarity (simplified - use proper text similarity)
            similarity = self._calculate_text_similarity(content, prev_content)

            if similarity > max_similarity:
                max_similarity = similarity
                similar_submission = prev

        return {
            'submission_id': submission.submission_id,
            'similarity_score': max_similarity,
            'flagged': max_similarity > 0.7,  # Flag if > 70% similar
            'similar_submission_id': similar_submission.submission_id if similar_submission else None,
            'checked_at': datetime.utcnow().isoformat()
        }
```

## 🚀 Quick Start

```bash
cd domain-examples/education

# Start infrastructure
docker-compose up -d

# Run database migrations
python manage.py migrate

# Load sample courses and students
python scripts/load_sample_data.py

# Start application
python manage.py runserver &

# Start background workers
celery -A education_platform worker -l info &
```

## 📊 Key Features

1. **Course Management**: Content delivery, syllabus, resources
2. **Assignment System**: Submission, grading, feedback
3. **Online Assessment**: Quizzes, exams with auto-grading
4. **Gradebook**: Grade calculation, GPA tracking
5. **Student Portal**: Course registration, grades, transcripts
6. **Parent Portal**: Progress monitoring, communication
7. **Analytics**: Learning outcomes, student progress
8. **Mobile Apps**: Offline access, notifications

## 🔒 Security & Compliance

- **FERPA**: Family Educational Rights and Privacy Act
- **COPPA**: Children's Online Privacy Protection (< 13 years)
- **Accessibility**: WCAG 2.1 AA compliance
- **Data Encryption**: AES-256 at rest, TLS 1.3 in transit
- **SSO Integration**: SAML, OAuth, LTI for seamless auth
- **Audit Logging**: All grade changes, access to student records

## 📈 Performance Targets

- **Page Load**: < 2 seconds
- **Assignment Submission**: < 5 seconds
- **Auto-grading**: < 10 seconds for objective assessments
- **Video Streaming**: Adaptive bitrate, < 3s start time
- **Concurrent Users**: Support 10K+ during exams
- **System Availability**: 99.9% uptime

## 🤖 AI/ML Applications

- **Plagiarism Detection**: Text similarity, pattern matching
- **Adaptive Learning**: Personalized content recommendations
- **Early Warning**: At-risk student identification
- **Essay Grading**: NLP for automated essay scoring
- **Chatbots**: Student support, FAQ answering

## 🔗 Related Patterns

- [Content Delivery](../social-media/README.md)
- [User Management](../healthcare/README.md)
- [Analytics](../finance/README.md)

---

**Note**: Educational systems require accessibility compliance and strong privacy protections. This is a learning template.
