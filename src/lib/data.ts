import { 
  Project, 
  UserProfile, 
  School, 
  ClassGroup, 
  StudentProject, 
  ProjectSubmission, 
  MentorReview, 
  Assignment, 
  Badge, 
  StudentBadge, 
  StudentPortfolio, 
  InAppNotification, 
  AuditLog,
  CodeRevision
} from '@/types';
import { WorkspaceSaveInput, SubmissionInput, ReviewInput, AssignmentInput, ClassGroupInput, PortfolioSettingsInput, ProjectInput } from './validations';

// ============================================================================
// 1. STARTER SEED PROJECTS
// ============================================================================
export const SEED_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    slug: 'obstacle-avoiding-robot-arduino',
    title: 'Autonomous Obstacle-Avoiding Robot with Ultrasonic Sensor',
    summary: 'Build a two-wheeled rover that navigates around obstacles autonomously using an Arduino Uno, HC-SR04 ultrasonic distance sensor, and L298N motor driver.',
    description: `The Obstacle Avoiding Robot is a foundational robotics project designed for Indian STEM students. 

In this project, you will build an intelligent mobile rover capable of detecting walls, furniture, and objects in its path. Using sound waves via an HC-SR04 ultrasonic sensor, the Arduino microcontroller continuously calculates the distance to nearby objects. When an obstacle is detected within 20 centimeters, the robot stops, reverses slightly, pans left and right to find a clear path, and continues navigating autonomously.

You will master PWM speed control, H-Bridge directional switching, sonar time-of-flight physics calculations, and modular C++/Arduino programming.`,
    category: 'Robotics',
    grade_min: 6,
    grade_max: 10,
    difficulty: 'Intermediate',
    estimated_hours: 4.5,
    estimated_cost_inr: 1450,
    tools_required: ['Screwdriver set', 'Wire stripper', 'Hot glue gun (optional)', 'USB A-to-B programming cable'],
    learning_objectives: [
      'Understand H-Bridge dual motor control and pulse-width modulation (PWM)',
      'Calculate distance using ultrasonic speed of sound formulas (Distance = (Duration * 0.034) / 2)',
      'Implement finite-state navigation logic (Forward, Obstacle Detect, Reverse, Pivot)',
      'Manage power distribution between 9V/12V motor battery and 5V logic'
    ],
    safety_notes: [
      'Ensure the motor power supply is disconnected while uploading code through USB to prevent unexpected wheel rotation.',
      'Never short-circuit lithium or 9V battery terminals.',
      'Be cautious with hot glue gun tips when securing sensors.'
    ],
    cover_image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    starter_language: 'arduino',
    starter_code: `// KITE ProjectVerse - Obstacle Avoiding Robot Starter Code
// Board: Arduino Uno | Sensor: HC-SR04 | Driver: L298N

const int TRIG_PIN = 9;
const int ECHO_PIN = 10;

// Motor Pins (L298N)
const int IN1 = 4;
const int IN2 = 5;
const int IN3 = 6;
const int IN4 = 7;
const int ENA = 3; // PWM Speed Pin Left
const int ENB = 11; // PWM Speed Pin Right

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  pinMode(ENA, OUTPUT);
  pinMode(ENB, OUTPUT);

  // Set default speed (0-255)
  analogWrite(ENA, 180);
  analogWrite(ENB, 180);
  Serial.println("Robot Ready!");
}

long getDistanceCM() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH);
  long distance = duration * 0.034 / 2;
  return distance;
}

void moveForward() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}

void moveStop() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
}

void turnRight() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
  delay(350);
}

void loop() {
  long distance = getDistanceCM();
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  if (distance > 0 && distance < 20) {
    moveStop();
    delay(200);
    turnRight();
  } else {
    moveForward();
  }
  delay(50);
}
`,
    troubleshooting_guide: [
      {
        problem: 'Robot turns towards obstacles instead of avoiding them.',
        solution: 'Check the motor wiring polarities on the L298N OUT1/OUT2 and OUT3/OUT4 terminals. Invert IN1/IN2 or IN3/IN4 if the wheel direction is reversed.'
      },
      {
        problem: 'Ultrasonic sensor returns 0 cm or erratic values.',
        solution: 'Verify Trig is connected to Pin 9 and Echo to Pin 10. Ensure Echo is not connected to a floating ground. Check that no cables are dangling directly in front of the ultrasonic transducers.'
      },
      {
        problem: 'Arduino resets whenever motors start moving.',
        solution: 'Do not power the motors directly from the Arduino 5V pin! Use an external 2-cell 18650 Li-ion battery pack (7.4V) connected to the L298N 12V terminal, and connect the battery ground to both L298N GND and Arduino GND.'
      }
    ],
    submission_requirements: [
      'A 30-to-60 second video demonstrating the robot avoiding at least 2 distinct obstacles',
      'Clear photo of your L298N and Arduino wiring diagram or actual breadboard',
      'Your uploaded Arduino sketch with custom speed or turning adjustments',
      'Written reflection detailing how you solved any motor imbalance issues'
    ],
    access_tier: 'free',
    is_published: true,
    is_featured: true,
    circuit_schematic_type: 'arduino_robot',
    wiring_connections: [
      { from_component: 'Arduino Uno', from_pin: 'D9', to_component: 'HC-SR04 Sonar', to_pin: 'TRIG', wire_color: 'blue', signal_type: 'digital', description: 'Triggers 10µs ultrasonic pulse' },
      { from_component: 'Arduino Uno', from_pin: 'D10', to_component: 'HC-SR04 Sonar', to_pin: 'ECHO', wire_color: 'green', signal_type: 'digital', description: 'Receives reflected soundwave pulse duration' },
      { from_component: 'Arduino Uno', from_pin: '5V', to_component: 'HC-SR04 Sonar', to_pin: 'VCC', wire_color: 'red', signal_type: 'power', description: '5V Regulated Logic Power' },
      { from_component: 'Arduino Uno', from_pin: 'GND', to_component: 'HC-SR04 Sonar', to_pin: 'GND', wire_color: 'black', signal_type: 'ground', description: 'Sensor ground reference' },
      { from_component: 'Arduino Uno', from_pin: 'D5', to_component: 'L298N Driver', to_pin: 'IN1', wire_color: 'yellow', signal_type: 'pwm', description: 'Left Motor Forward PWM Speed' },
      { from_component: 'Arduino Uno', from_pin: 'D6', to_component: 'L298N Driver', to_pin: 'IN2', wire_color: 'orange', signal_type: 'pwm', description: 'Left Motor Reverse PWM Speed' },
      { from_component: 'Arduino Uno', from_pin: 'D7', to_component: 'L298N Driver', to_pin: 'IN3', wire_color: 'yellow', signal_type: 'digital', description: 'Right Motor Forward Direction' },
      { from_component: 'Arduino Uno', from_pin: 'D8', to_component: 'L298N Driver', to_pin: 'IN4', wire_color: 'orange', signal_type: 'digital', description: 'Right Motor Reverse Direction' },
      { from_component: 'Battery Pack (7.4V)', from_pin: '+VCC', to_component: 'L298N Driver', to_pin: '+12V', wire_color: 'red', signal_type: 'power', description: 'High-current motor power input' },
      { from_component: 'Arduino Uno', from_pin: 'GND', to_component: 'L298N Driver', to_pin: 'GND', wire_color: 'black', signal_type: 'ground', description: 'Crucial shared common ground' }
    ],
    components: [
      { id: 'c1', project_id: 'proj-001', name: 'Arduino Uno R3 or compatible', quantity: 1, component_type: 'controller', description: 'ATmega328P based microcontroller board' },
      { id: 'c2', project_id: 'proj-001', name: 'L298N Dual H-Bridge Motor Driver', quantity: 1, component_type: 'hardware', description: 'Handles up to 2A per channel with onboard 5V regulator' },
      { id: 'c3', project_id: 'proj-001', name: 'HC-SR04 Ultrasonic Distance Sensor', quantity: 1, component_type: 'sensor', description: '2cm to 400cm range non-contact measurement' },
      { id: 'c4', project_id: 'proj-001', name: '2WD Robot Chassis Kit with BO Motors & Wheels', quantity: 1, component_type: 'hardware', description: 'Dual DC geared motors, castors, and acrylic plate' },
      { id: 'c5', project_id: 'proj-001', name: 'Jumper Wires (Male-to-Female & Male-to-Male)', quantity: 20, component_type: 'hardware', description: 'Breadboard hookup wires' },
      { id: 'c6', project_id: 'proj-001', name: '2x 18650 Battery Holder with Switch', quantity: 1, component_type: 'hardware', description: 'Provides 7.4V-8.4V power for motors and board' }
    ],
    steps: [
      {
        id: 's1-1',
        project_id: 'proj-001',
        step_number: 1,
        title: 'Assembling the 2WD Mechanical Chassis',
        content: 'Mount the two yellow BO (Battery Operated) geared motors underneath the acrylic chassis using the provided M3 screws and brackets. Press-fit the rubber wheels onto the motor shafts. Install the front omnidirectional caster wheel to maintain balance.',
        tips: 'Do not overtighten screws into the acrylic base as it may crack.'
      },
      {
        id: 's1-2',
        project_id: 'proj-001',
        step_number: 2,
        title: 'Mounting the L298N Driver & Arduino Uno',
        content: 'Secure the L298N motor driver board towards the rear of the chassis and the Arduino Uno in the center. Connect the left motor leads to OUT1 and OUT2, and the right motor leads to OUT3 and OUT4.',
        tips: 'Keep motor wires neat with a zip tie to avoid tangling into the wheel axles.'
      },
      {
        id: 's1-3',
        project_id: 'proj-001',
        step_number: 3,
        title: 'Wiring Power & Common Ground',
        content: 'Connect the red positive wire from your battery holder to the L298N "+12V" screw terminal. Connect the black negative wire to L298N "GND". Run a wire from the L298N "GND" to one of the Arduino "GND" pins. Connect L298N "+5V" to Arduino "5V" or Vin depending on regulator jumper state.',
        tips: 'A shared common ground between the motor driver and Arduino is essential for signal transmission!'
      },
      {
        id: 's1-4',
        project_id: 'proj-001',
        step_number: 4,
        title: 'Connecting the HC-SR04 Ultrasonic Sensor',
        content: 'Mount the HC-SR04 sensor at the front facing forward. Connect VCC to 5V, GND to GND, Trig to Arduino Digital Pin 9, and Echo to Digital Pin 10.',
        code_snippet: 'const int TRIG_PIN = 9;\nconst int ECHO_PIN = 10;'
      },
      {
        id: 's1-5',
        project_id: 'proj-001',
        step_number: 5,
        title: 'Uploading & Calibrating Navigation Code',
        content: 'Connect your computer to the Arduino via USB. Open the workspace code editor, review the pin configurations, and click "Download Code" or upload via the Arduino IDE. Test on an open floor and tune the turn duration so the robot makes a 90-degree pivot when obstructed.',
        tips: 'If the robot turns too little, increase the delay in the turnRight() function from 350ms to 450ms.'
      }
    ],
    created_at: '2026-09-01T10:00:00Z',
    updated_at: '2026-10-15T12:00:00Z'
  },
  {
    id: 'proj-002',
    slug: 'smart-plant-watering-iot',
    title: 'Smart Automated Plant Irrigation & Soil Moisture Monitor',
    summary: 'Protect house plants and school garden beds with an automated watering system using a soil moisture sensor, 5V submersible water pump, and relay module.',
    description: `Water conservation and sustainable agriculture are vital challenges for India. In this practical STEM project, students engineer an automated plant irrigation system that monitors soil hygrometry levels in real time and automatically pumps measured water only when the soil is dry.

You will learn analog-to-digital sensor conversion (ADC), calibration curves for various soil compositions (sandy, loamy, clay), relay switching circuitry for inductive loads, and fail-safe safety timers to prevent accidental water overflow.`,
    category: 'Internet of Things',
    grade_min: 5,
    grade_max: 9,
    difficulty: 'Beginner',
    estimated_hours: 3.0,
    estimated_cost_inr: 890,
    tools_required: ['Small water container or bottle', 'Flexible silicon tubing (5mm)', 'Jumper wires', 'Screwdriver'],
    learning_objectives: [
      'Read and calibrate analog resistance values from capacitive or resistive soil probes',
      'Safely trigger high-current DC water pumps using an optocoupler relay module',
      'Implement threshold hysteresis to prevent rapid cycling on/off around the moisture boundary',
      'Design fail-safe timer mechanisms in code'
    ],
    safety_notes: [
      'Keep electrical connections and the Arduino board dry! Place the water pump inside the reservoir and keep electronics in an elevated container.',
      'Only use low-voltage 5V DC pumps. Never work with 230V mains power in student projects.'
    ],
    cover_image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    starter_language: 'arduino',
    starter_code: `// KITE ProjectVerse - Smart Plant Irrigation System
const int SOIL_PIN = A0;
const int RELAY_PIN = 7;
const int STATUS_LED = 13;

// Thresholds: Values below this mean wet, above mean dry (check your calibration)
const int DRY_THRESHOLD = 650;
const int PUMP_DURATION_MS = 2500; // Pump runs for 2.5 seconds maximum

void setup() {
  Serial.begin(9600);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(STATUS_LED, OUTPUT);
  // Relays are typically ACTIVE LOW: HIGH = OFF, LOW = ON
  digitalWrite(RELAY_PIN, HIGH);
  Serial.println("Soil Moisture Monitor Initialized");
}

void loop() {
  int moistureValue = analogRead(SOIL_PIN);
  Serial.print("Current Soil Moisture Reading: ");
  Serial.println(moistureValue);

  if (moistureValue > DRY_THRESHOLD) {
    Serial.println("Soil is DRY! Initiating watering cycle...");
    digitalWrite(STATUS_LED, HIGH);
    digitalWrite(RELAY_PIN, LOW); // Turn on pump
    delay(PUMP_DURATION_MS);
    digitalWrite(RELAY_PIN, HIGH); // Turn off pump
    digitalWrite(STATUS_LED, LOW);
    
    // Wait 10 seconds for water to soak into the roots before re-measuring
    delay(10000);
  } else {
    Serial.println("Soil moisture is optimal. Standby.");
    delay(3000);
  }
}
`,
    troubleshooting_guide: [
      {
        problem: 'Relay clicks but water pump does not run.',
        solution: 'Check the pump power supply. The Arduino 5V pin cannot supply enough current for both the relay coil and pump motor simultaneously. Connect an external 5V 1A adapter or battery pack to the relay common terminal.'
      },
      {
        problem: 'Moisture reading stays stuck at 1023.',
        solution: 'Inspect the probe cables connected to A0 and GND. If using a module with a comparator pot, twist the blue potentiometer until the digital indicator LED illuminates.'
      }
    ],
    submission_requirements: [
      'A photo showing the probe in soil and tubing delivering water into the pot',
      'Demonstration of the pump activating when the sensor is pulled out of water',
      'Calculated dry and wet calibration numbers recorded in your project reflection'
    ],
    access_tier: 'free',
    is_published: true,
    is_featured: false,
    circuit_schematic_type: 'smart_plant',
    wiring_connections: [
      { from_component: 'Arduino Uno', from_pin: 'A0', to_component: 'Soil Hygrometer', to_pin: 'SIG/Analog', wire_color: 'green', signal_type: 'analog', description: 'Reads soil conductivity resistance' },
      { from_component: 'Arduino Uno', from_pin: '5V', to_component: 'Soil Hygrometer', to_pin: 'VCC', wire_color: 'red', signal_type: 'power', description: '5V Power for probe excitation' },
      { from_component: 'Arduino Uno', from_pin: 'GND', to_component: 'Soil Hygrometer', to_pin: 'GND', wire_color: 'black', signal_type: 'ground', description: 'Sensor ground reference' },
      { from_component: 'Arduino Uno', from_pin: 'D7', to_component: '5V Relay Module', to_pin: 'IN', wire_color: 'yellow', signal_type: 'digital', description: 'Active LOW relay coil trigger' },
      { from_component: 'Arduino Uno', from_pin: '5V', to_component: '5V Relay Module', to_pin: 'VCC', wire_color: 'red', signal_type: 'power', description: 'Logic circuit power' },
      { from_component: 'Arduino Uno', from_pin: 'GND', to_component: '5V Relay Module', to_pin: 'GND', wire_color: 'black', signal_type: 'ground', description: 'Common system ground' },
      { from_component: '5V Battery/Adapter', from_pin: 'Positive', to_component: '5V Relay Module', to_pin: 'COM', wire_color: 'red', signal_type: 'power', description: 'Pump power common supply' },
      { from_component: '5V Relay Module', from_pin: 'NO', to_component: 'Submersible Pump', to_pin: '+Positive', wire_color: 'blue', signal_type: 'power', description: 'Switched power to motor' },
      { from_component: 'Submersible Pump', from_pin: '-Negative', to_component: '5V Battery/Adapter', to_pin: 'Negative', wire_color: 'black', signal_type: 'ground', description: 'Pump return ground' }
    ],
    components: [
      { id: 'c2-1', project_id: 'proj-002', name: 'Soil Moisture Sensor Probe with Module', quantity: 1, component_type: 'sensor' },
      { id: 'c2-2', project_id: 'proj-002', name: '5V Single-Channel Relay Module', quantity: 1, component_type: 'hardware' },
      { id: 'c2-3', project_id: 'proj-002', name: '5V Submersible Mini Water Pump with Tubing', quantity: 1, component_type: 'hardware' },
      { id: 'c2-4', project_id: 'proj-002', name: 'Arduino Nano or Uno', quantity: 1, component_type: 'controller' }
    ],
    steps: [
      { id: 's2-1', project_id: 'proj-002', step_number: 1, title: 'Calibrating the Soil Sensor in Air & Water', content: 'Connect sensor VCC to 5V, GND to GND, and SIG to A0. Open the Serial Monitor and note the raw ADC reading when dry in air (~800-1000) versus submerged in a glass of water (~300-450).' },
      { id: 's2-2', project_id: 'proj-002', step_number: 2, title: 'Wiring the 5V Relay & Submersible Pump', content: 'Connect Arduino Pin 7 to the Relay IN pin. Route the pump positive wire through the Relay NO (Normally Open) and COM (Common) terminals.' },
      { id: 's2-3', project_id: 'proj-002', step_number: 3, title: 'Inserting Probe and Testing Soil Absorption', content: 'Place the probe into your potted plant near the roots. Run the sketch and observe automatic cutoff once moisture spreads.' }
    ],
    created_at: '2026-09-10T10:00:00Z',
    updated_at: '2026-10-18T10:00:00Z'
  },
  {
    id: 'proj-003',
    slug: 'ai-gesture-recognition-python',
    title: 'AI Computer Vision Gesture Controller using Python & OpenCV',
    summary: 'Build an AI application that detects hand landmarks using your webcam and controls computer volume, smart lights, or games with hand gestures.',
    description: `Artificial Intelligence is transforming robotics and human-computer interaction. In this software and AI engineering project, students build a real-time computer vision system using Python, OpenCV, and Google MediaPipe.

The application captures frames from any standard computer webcam, identifies 21 3D hand landmarks (wrist, knuckles, fingertips), calculates Euclidean distances and angles between thumb and index fingers, and triggers real-time operating system actions like volume adjustment or virtual drawing.`,
    category: 'Artificial Intelligence',
    grade_min: 7,
    grade_max: 12,
    difficulty: 'Intermediate',
    estimated_hours: 3.5,
    estimated_cost_inr: 0,
    tools_required: ['Computer with standard webcam', 'Python 3.10+ installed'],
    learning_objectives: [
      'Understand how deep neural networks track coordinate landmarks on video frames',
      'Compute Euclidean distance between vector coordinates in Python (hypot formula)',
      'Map physical pixel gestures onto percentage ranges (0% to 100%)',
      'Implement real-time visual feedback overlays with OpenCV drawing primitives'
    ],
    safety_notes: [
      'Take regular 5-minute eye breaks when working with webcam-based vision software.',
      'Ensure your room has good natural lighting so the camera can detect finger contours without straining the CPU.'
    ],
    cover_image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=80',
    starter_language: 'python',
    starter_code: `# KITE ProjectVerse - AI Hand Gesture Vision Controller
# Requirements: pip install opencv-python mediapipe numpy

import cv2
import math
import time

def calculate_distance(p1, p2):
    """Calculates Euclidean distance between two 2D points"""
    return math.hypot(p2[0] - p1[0], p2[1] - p1[1])

print("KITE AI Gesture Controller starting...")
print("Tip: Pinch your thumb and index finger together to adjust level.")

# Simulation demonstration logic for browser & local execution
def run_gesture_simulation():
    landmarks = {
        "wrist": (320, 400),
        "thumb_tip": (280, 220),
        "index_tip": (320, 180)
    }
    dist = calculate_distance(landmarks["thumb_tip"], landmarks["index_tip"])
    print(f"Detected Thumb Tip: {landmarks['thumb_tip']}")
    print(f"Detected Index Tip: {landmarks['index_tip']}")
    print(f"Computed Pinch Distance: {dist:.2f} pixels")
    
    # Scale distance (30px = 0%, 150px = 100%)
    percentage = max(0, min(100, (dist - 30) / (150 - 30) * 100))
    print(f"Gesture Control Output: {percentage:.1f}%")
    return percentage

if __name__ == "__main__":
    run_gesture_simulation()
`,
    troubleshooting_guide: [
      {
        problem: 'Webcam window opens but closes immediately with an error.',
        solution: 'Check camera permissions in your operating system settings. If multiple cameras are attached, change cv2.VideoCapture(0) to cv2.VideoCapture(1).'
      },
      {
        problem: 'Frame rate is laggy and gestures have delay.',
        solution: 'Resize the input frame to 640x480 using cv2.resize before passing it to the MediaPipe inference detector to drastically boost FPS on laptops.'
      }
    ],
    submission_requirements: [
      'Screenshot of your Python console showing detected landmark coordinates',
      'A short screen recording showing the gesture tracking overlay reacting to your hand',
      'Your customized Python code with added gestures (e.g. fist, peace sign, or open palm)'
    ],
    access_tier: 'premium',
    is_published: true,
    is_featured: true,
    components: [
      { id: 'c3-1', project_id: 'proj-003', name: 'Webcam / Laptop Camera', quantity: 1, component_type: 'sensor' },
      { id: 'c3-2', project_id: 'proj-003', name: 'Python 3 runtime & IDE', quantity: 1, component_type: 'software' }
    ],
    steps: [
      { id: 's3-1', project_id: 'proj-003', step_number: 1, title: 'Environment Setup and Package Installation', content: 'Install required dependencies in your terminal using: pip install opencv-python mediapipe numpy' },
      { id: 's3-2', project_id: 'proj-003', step_number: 2, title: 'Initializing VideoCapture and Frame Processing', content: 'Create the main OpenCV loop to grab frames, flip horizontally for a mirror effect, and convert BGR color space to RGB for MediaPipe.' },
      { id: 's3-3', project_id: 'proj-003', step_number: 3, title: 'Extracting Landmark 4 (Thumb) and Landmark 8 (Index)', content: 'Extract pixel coordinates and compute the pinch gap using Pythagoras theorem.' },
      { id: 's3-4', project_id: 'proj-003', step_number: 4, title: 'Mapping to System Volume or Visual Slider', content: 'Draw an on-screen volume bar and trigger system volume updates smoothly with linear interpolation.' }
    ],
    created_at: '2026-09-15T10:00:00Z',
    updated_at: '2026-10-19T14:00:00Z'
  },
  {
    id: 'proj-004',
    slug: 'solar-tracker-sunflower-servo',
    title: 'Dual-Axis Solar Tracker Sun Flower with Servos & LDRs',
    summary: 'Maximize renewable solar energy harvesting by building a sunflower-inspired dual-axis solar tracker using light-dependent resistors and SG90 servo motors.',
    description: `Solar panels operate at peak electrical efficiency when sunlight strikes perpendicularly at a 90-degree angle. Fixed rooftop solar panels lose up to 35% of daily energy potential due to the sun's trajectory across the sky.

In this green technology and electronics build, students construct an active dual-axis solar tracker. Four Light Dependent Resistors (LDRs) positioned in North, South, East, and West quadrants compare differential illumination. An Arduino microcontroller interprets the values and commands two micro-servo motors to orient a miniature solar panel directly towards the brightest light source.`,
    category: 'STEM Science',
    grade_min: 5,
    grade_max: 11,
    difficulty: 'Intermediate',
    estimated_hours: 4.0,
    estimated_cost_inr: 1250,
    tools_required: ['Cardboard or 3D printed gimbal', 'Glue gun', 'Screwdriver', 'Flashlight for testing'],
    learning_objectives: [
      'Learn how photoresistors (LDR) change electrical resistance in response to lux photon intensity',
      'Build voltage divider circuits with fixed 10k ohm pull-down resistors',
      'Control positional micro servos using PWM angle pulses (0 to 180 degrees)',
      'Compare power output between stationary and tracking solar cells'
    ],
    safety_notes: [
      'Do not force servo arms by hand while powered as plastic gears can strip.',
      'Always test indoor tracking with a smartphone flashlight before placing outside in intense sunlight.'
    ],
    cover_image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    starter_language: 'arduino',
    starter_code: `// KITE ProjectVerse - Dual Axis Solar Tracker
#include <Servo.h>

Servo horizontalServo;
Servo verticalServo;

// LDR Pins
const int LDR_TOP_LEFT = A0;
const int LDR_TOP_RIGHT = A1;
const int LDR_BOTTOM_LEFT = A2;
const int LDR_BOTTOM_RIGHT = A3;

int horizPos = 90;
int vertPos = 90;
const int TOLERANCE = 15; // Deadband to prevent jitter

void setup() {
  Serial.begin(9600);
  horizontalServo.attach(9);
  verticalServo.attach(10);
  horizontalServo.write(horizPos);
  verticalServo.write(vertPos);
  delay(1000);
}

void loop() {
  int tl = analogRead(LDR_TOP_LEFT);
  int tr = analogRead(LDR_TOP_RIGHT);
  int bl = analogRead(LDR_BOTTOM_LEFT);
  int br = analogRead(LDR_BOTTOM_RIGHT);

  int avgTop = (tl + tr) / 2;
  int avgBottom = (bl + br) / 2;
  int avgLeft = (tl + bl) / 2;
  int avgRight = (tr + br) / 2;

  // Vertical tilt tracking
  int diffVert = avgTop - avgBottom;
  if (abs(diffVert) > TOLERANCE) {
    if (avgTop > avgBottom && vertPos < 170) vertPos += 1;
    else if (avgTop < avgBottom && vertPos > 10) vertPos -= 1;
    verticalServo.write(vertPos);
  }

  // Horizontal azimuth tracking
  int diffHoriz = avgLeft - avgRight;
  if (abs(diffHoriz) > TOLERANCE) {
    if (avgLeft > avgRight && horizPos > 10) horizPos -= 1;
    else if (avgLeft < avgRight && horizPos < 170) horizPos += 1;
    horizontalServo.write(horizPos);
  }

  delay(30);
}
`,
    troubleshooting_guide: [
      {
        problem: 'Servos are vibrating continuously even in uniform light.',
        solution: 'Increase the TOLERANCE constant from 15 to 30 or 40 to create a larger deadband that prevents hunting.'
      },
      {
        problem: 'The tracker moves in the opposite direction away from the flashlight.',
        solution: 'Invert the servo angle increment (+1 to -1) in the vertical or horizontal comparison condition.'
      }
    ],
    submission_requirements: [
      'Video showing the tracker tilting and rotating to follow a moving flashlight',
      'Multimeter voltage readings comparing fixed vs aligned panel output',
      'Circuit diagram drawing showing 4 LDR voltage divider connections'
    ],
    access_tier: 'free',
    is_published: true,
    is_featured: false,
    circuit_schematic_type: 'smart_plant',
    wiring_connections: [
      { from_component: 'Arduino Uno', from_pin: 'A0', to_component: 'Soil Hygrometer', to_pin: 'SIG/Analog', wire_color: 'green', signal_type: 'analog', description: 'Reads soil conductivity resistance' },
      { from_component: 'Arduino Uno', from_pin: '5V', to_component: 'Soil Hygrometer', to_pin: 'VCC', wire_color: 'red', signal_type: 'power', description: '5V Power for probe excitation' },
      { from_component: 'Arduino Uno', from_pin: 'GND', to_component: 'Soil Hygrometer', to_pin: 'GND', wire_color: 'black', signal_type: 'ground', description: 'Sensor ground reference' },
      { from_component: 'Arduino Uno', from_pin: 'D7', to_component: '5V Relay Module', to_pin: 'IN', wire_color: 'yellow', signal_type: 'digital', description: 'Active LOW relay coil trigger' },
      { from_component: 'Arduino Uno', from_pin: '5V', to_component: '5V Relay Module', to_pin: 'VCC', wire_color: 'red', signal_type: 'power', description: 'Logic circuit power' },
      { from_component: 'Arduino Uno', from_pin: 'GND', to_component: '5V Relay Module', to_pin: 'GND', wire_color: 'black', signal_type: 'ground', description: 'Common system ground' },
      { from_component: '5V Battery/Adapter', from_pin: 'Positive', to_component: '5V Relay Module', to_pin: 'COM', wire_color: 'red', signal_type: 'power', description: 'Pump power common supply' },
      { from_component: '5V Relay Module', from_pin: 'NO', to_component: 'Submersible Pump', to_pin: '+Positive', wire_color: 'blue', signal_type: 'power', description: 'Switched power to motor' },
      { from_component: 'Submersible Pump', from_pin: '-Negative', to_component: '5V Battery/Adapter', to_pin: 'Negative', wire_color: 'black', signal_type: 'ground', description: 'Pump return ground' }
    ],
    components: [
      { id: 'c4-1', project_id: 'proj-004', name: '2x SG90 9g Micro Servo Motors', quantity: 2, component_type: 'hardware' },
      { id: 'c4-2', project_id: 'proj-004', name: '4x LDR Light Dependent Resistors (5mm)', quantity: 4, component_type: 'sensor' },
      { id: 'c4-3', project_id: 'proj-004', name: '4x 10k Ohm Resistors', quantity: 4, component_type: 'hardware' },
      { id: 'c4-4', project_id: 'proj-004', name: '5V Mini Solar Cell (optional for measurement)', quantity: 1, component_type: 'hardware' },
      { id: 'c4-5', project_id: 'proj-004', name: 'Arduino Uno / Nano', quantity: 1, component_type: 'controller' }
    ],
    steps: [
      { id: 's4-1', project_id: 'proj-004', step_number: 1, title: 'Constructing the Cross Partition for LDRs', content: 'Create a cardboard cross separator between the 4 LDRs so that light coming from an angle casts a shadow on the opposite sensors.' },
      { id: 's4-2', project_id: 'proj-004', step_number: 2, title: 'Wiring the 4 Voltage Divider Circuits', content: 'Connect one leg of each LDR to 5V, the other leg to an analog input (A0-A3) and through a 10k resistor to GND.' },
      { id: 's4-3', project_id: 'proj-004', step_number: 3, title: 'Assembling the Pan-and-Tilt Gimbal', content: 'Mount the horizontal servo to the base. Mount the vertical servo onto the horizontal servo horn, and mount the solar panel assembly onto the vertical servo horn.' }
    ],
    created_at: '2026-09-20T10:00:00Z',
    updated_at: '2026-10-16T12:00:00Z'
  },
  {
    id: 'proj-005',
    slug: 'esp32-iot-smart-switch-mqtt',
    title: 'ESP32 Wi-Fi Smart Home Switch with Cloud MQTT & Web Dashboard',
    summary: 'Design a connected IoT home automation appliance switch using an ESP32 microcontroller, web server, and responsive control panel.',
    description: `Internet of Things (IoT) is a cornerstone of modern smart cities. In this advanced electronics and networking project, students build an IoT Smart Switch capable of controlling home lights or appliances over local Wi-Fi and cloud MQTT brokers.

Students explore TCP/IP wireless networking, asynchronous web servers, JSON payload serialization, and how to control real-world appliances with optical isolation.`,
    category: 'Internet of Things',
    grade_min: 8,
    grade_max: 12,
    difficulty: 'Advanced',
    estimated_hours: 5.0,
    estimated_cost_inr: 1100,
    tools_required: ['ESP32 Dev Module', 'Micro USB Cable', 'Wi-Fi Hotspot or Router'],
    learning_objectives: [
      'Configure ESP32 Wi-Fi Station and Access Point modes',
      'Serve embedded HTML/CSS web interfaces directly from ESP32 flash memory',
      'Handle asynchronous REST GET/POST requests to toggle GPIO relays',
      'Understand IoT security, authentication, and token verification'
    ],
    safety_notes: [
      'Do not connect to 230V AC lines during student testing! Use a 5V LED or buzzer as the appliance load during testing.'
    ],
    cover_image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80',
    starter_language: 'cpp',
    starter_code: `// KITE ProjectVerse - ESP32 Smart Switch Web Server
#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

WebServer server(80);
const int RELAY_PIN = 23;
bool relayState = false;

const char INDEX_HTML[] = 
"<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width, initial-scale=1'>"
"<title>KITE Smart Switch</title>"
"<style>body{font-family:sans-serif;text-align:center;padding:40px;background:#0f172a;color:#f8fafc;}"
".btn{background:#6366f1;color:#fff;border:none;padding:16px 32px;font-size:18px;border-radius:12px;cursor:pointer;}"
"</style></head><body>"
"<h1>KITE IoT Smart Switch</h1>"
"<p>Status: <span id='status'>OFF</span></p>"
"<button class='btn' onclick='toggleRelay()'>Toggle Switch</button>"
"<script>function toggleRelay(){fetch('/toggle').then(r=>r.text()).then(t=>{document.getElementById('status').innerText=t;});}</script>"
"</body></html>";

void handleRoot() {
  server.send(200, "text/html", INDEX_HTML);
}

void handleToggle() {
  relayState = !relayState;
  digitalWrite(RELAY_PIN, relayState ? HIGH : LOW);
  server.send(200, "text/plain", relayState ? "ON" : "OFF");
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected! IP address: ");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.on("/toggle", handleToggle);
  server.begin();
  Serial.println("HTTP Server Started");
}

void loop() {
  server.handleClient();
}
`,
    troubleshooting_guide: [
      {
        problem: 'ESP32 continuously prints dots and fails to connect to Wi-Fi.',
        solution: 'ESP32 Wi-Fi only supports 2.4 GHz networks, not 5 GHz! Make sure your mobile hotspot or router has a 2.4 GHz band enabled.'
      }
    ],
    submission_requirements: [
      'Screenshot of serial monitor showing the assigned IP address',
      'Video showing a smartphone browser toggling the relay LED wirelessly',
      'Your modified HTML layout with custom KITE branding'
    ],
    access_tier: 'premium',
    is_published: true,
    is_featured: false,
    components: [
      { id: 'c5-1', project_id: 'proj-005', name: 'ESP32 NodeMCU 38-Pin Development Board', quantity: 1, component_type: 'controller' },
      { id: 'c5-2', project_id: 'proj-005', name: '5V Optocoupler Relay Module', quantity: 1, component_type: 'hardware' },
      { id: 'c5-3', project_id: 'proj-005', name: 'Indicator LED and 220 Ohm Resistor', quantity: 1, component_type: 'hardware' }
    ],
    steps: [
      { id: 's5-1', project_id: 'proj-005', step_number: 1, title: 'Flashing ESP32 Board Drivers & Serial Port Selection', content: 'Connect ESP32 via micro-USB and verify CP2102 or CH340 drivers are recognized in Device Manager.' },
      { id: 's5-2', project_id: 'proj-005', step_number: 2, title: 'Configuring 2.4 GHz Network Credentials', content: 'Input your Wi-Fi SSID and password in the starter code and flash the binary.' },
      { id: 's5-3', project_id: 'proj-005', step_number: 3, title: 'Accessing the Web Portal from Mobile', content: 'Open mobile browser and navigate to http://[ESP32_IP] to toggle your smart device.' }
    ],
    created_at: '2026-09-25T10:00:00Z',
    updated_at: '2026-10-18T16:00:00Z'
  },
  {
    id: 'proj-006',
    slug: 'python-weather-aqi-visualizer',
    title: 'Python Air Quality Index (AQI) & Weather Analytics Dashboard',
    summary: 'Build a data science and environmental analytics tool that fetches real-time pollution data for Indian cities and visualizes PM2.5 and AQI trends.',
    description: `Air quality is one of the most pressing environmental health challenges across Indian metropolises. In this software and data analytics project, students write Python code to interface with open environmental APIs (like Central Pollution Control Board / Open-Meteo), parse JSON data structures, calculate AQI risk tiers, and generate visual charts.

This project introduces computational thinking, HTTP REST APIs, Pandas dataframes, and Matplotlib plotting.`,
    category: 'Coding & Python',
    grade_min: 6,
    grade_max: 12,
    difficulty: 'Beginner',
    estimated_hours: 2.5,
    estimated_cost_inr: 0,
    tools_required: ['Computer with Python installed or web browser'],
    learning_objectives: [
      'Make asynchronous HTTP GET requests to open public data APIs',
      'Parse nested JSON responses and extract critical metrics (PM2.5, PM10, temperature)',
      'Categorize AQI levels according to National Air Quality Index (NAQI) standards',
      'Format data into structured ASCII tables and visual console graphs'
    ],
    safety_notes: [
      'Be mindful of public API rate limits. Do not send queries in an infinite while loop without sleep delays.'
    ],
    cover_image: 'https://images.unsplash.com/photo-1590055531615-f16d36ffe8ec?auto=format&fit=crop&w=1200&q=80',
    starter_language: 'python',
    starter_code: `# KITE ProjectVerse - Indian Cities AQI & Weather Analyzer
import json
import urllib.request

CITIES = {
    "Delhi": {"lat": 28.6139, "lon": 77.2090},
    "Bengaluru": {"lat": 12.9716, "lon": 77.5946},
    "Mumbai": {"lat": 19.0760, "lon": 72.8777},
    "Kolkata": {"lat": 22.5726, "lon": 88.3639},
    "Chennai": {"lat": 13.0827, "lon": 80.2707}
}

def get_naqi_category(aqi_val):
    if aqi_val <= 50:
        return "Good (Minimal Impact)"
    elif aqi_val <= 100:
        return "Satisfactory (Minor breathing discomfort)"
    elif aqi_val <= 200:
        return "Moderate (Breathing discomfort to sensitive people)"
    elif aqi_val <= 300:
        return "Poor (Breathing discomfort to most people)"
    elif aqi_val <= 400:
        return "Very Poor (Respiratory illness on prolonged exposure)"
    else:
        return "Severe (Affects healthy people and seriously impacts sensitive)"

def fetch_weather(city_name):
    if city_name not in CITIES:
        print(f"City {city_name} not found!")
        return
    coords = CITIES[city_name]
    url = f"https://api.open-meteo.com/v1/forecast?latitude={coords['lat']}&longitude={coords['lon']}&current_weather=true"
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'KITE-STEM-App/1.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            current = data.get("current_weather", {})
            temp = current.get("temperature", "N/A")
            wind = current.get("windspeed", "N/A")
            
            print("=" * 45)
            print(f"KITE STEM Weather Report: {city_name}")
            print(f"Temperature: {temp}°C | Wind Speed: {wind} km/h")
            print("=" * 45)
    except Exception as e:
        print(f"Simulation Mode: {city_name} - Temp: 28.5°C | Wind: 12 km/h")

if __name__ == "__main__":
    for city in CITIES.keys():
        fetch_weather(city)
`,
    troubleshooting_guide: [
      {
        problem: 'HTTP 403 Forbidden error from API.',
        solution: 'Make sure you included a custom User-Agent header in the urllib Request object as shown in the starter code.'
      }
    ],
    submission_requirements: [
      'Execution log displaying weather for at least 3 cities',
      'Added feature that calculates advisory recommendation based on weather conditions',
      'Your clean Python script (.py)'
    ],
    access_tier: 'free',
    is_published: true,
    is_featured: false,
    circuit_schematic_type: 'smart_plant',
    wiring_connections: [
      { from_component: 'Arduino Uno', from_pin: 'A0', to_component: 'Soil Hygrometer', to_pin: 'SIG/Analog', wire_color: 'green', signal_type: 'analog', description: 'Reads soil conductivity resistance' },
      { from_component: 'Arduino Uno', from_pin: '5V', to_component: 'Soil Hygrometer', to_pin: 'VCC', wire_color: 'red', signal_type: 'power', description: '5V Power for probe excitation' },
      { from_component: 'Arduino Uno', from_pin: 'GND', to_component: 'Soil Hygrometer', to_pin: 'GND', wire_color: 'black', signal_type: 'ground', description: 'Sensor ground reference' },
      { from_component: 'Arduino Uno', from_pin: 'D7', to_component: '5V Relay Module', to_pin: 'IN', wire_color: 'yellow', signal_type: 'digital', description: 'Active LOW relay coil trigger' },
      { from_component: 'Arduino Uno', from_pin: '5V', to_component: '5V Relay Module', to_pin: 'VCC', wire_color: 'red', signal_type: 'power', description: 'Logic circuit power' },
      { from_component: 'Arduino Uno', from_pin: 'GND', to_component: '5V Relay Module', to_pin: 'GND', wire_color: 'black', signal_type: 'ground', description: 'Common system ground' },
      { from_component: '5V Battery/Adapter', from_pin: 'Positive', to_component: '5V Relay Module', to_pin: 'COM', wire_color: 'red', signal_type: 'power', description: 'Pump power common supply' },
      { from_component: '5V Relay Module', from_pin: 'NO', to_component: 'Submersible Pump', to_pin: '+Positive', wire_color: 'blue', signal_type: 'power', description: 'Switched power to motor' },
      { from_component: 'Submersible Pump', from_pin: '-Negative', to_component: '5V Battery/Adapter', to_pin: 'Negative', wire_color: 'black', signal_type: 'ground', description: 'Pump return ground' }
    ],
    components: [
      { id: 'c6-1', project_id: 'proj-006', name: 'Python 3 installation', quantity: 1, component_type: 'software' }
    ],
    steps: [
      { id: 's6-1', project_id: 'proj-006', step_number: 1, title: 'Understanding Weather APIs and Lat/Long Coordinates', content: 'Explore how coordinates map to meteorological monitoring stations.' },
      { id: 's6-2', project_id: 'proj-006', step_number: 2, title: 'Writing the HTTP Fetch Request', content: 'Use Python urllib.request to query live weather endpoints.' },
      { id: 's6-3', project_id: 'proj-006', step_number: 3, title: 'Formatting NAQI Clean Air Advisory Outputs', content: 'Write conditional functions that recommend outdoor versus indoor activity.' }
    ],
    created_at: '2026-10-01T10:00:00Z',
    updated_at: '2026-10-20T10:00:00Z'
  }
];

// ============================================================================
// 2. SEED USERS & ROLES
// ============================================================================
export const SEED_USERS: Record<string, UserProfile> = {
  'usr-student-1': {
    id: 'usr-student-1',
    email: 'student@kite.test',
    full_name: 'Aarav Sharma',
    username: 'aarav_maker',
    role: 'student',
    grade_level: 'Class 8',
    school_id: 's1111111-1111-1111-1111-111111111111',
    school_name: 'KITE Innovation Model School',
    bio: 'Passionate about robotics, Arduino microcontrollers, and autonomous rovers.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    parent_email: 'parent.sharma@example.in',
    is_active: true,
    created_at: '2026-08-01T10:00:00Z'
  },
  'usr-teacher-1': {
    id: 'usr-teacher-1',
    email: 'teacher@kite.test',
    full_name: 'Priya Raman',
    username: 'priya_stem',
    role: 'teacher',
    grade_level: 'Faculty - STEM Lab',
    school_id: 's1111111-1111-1111-1111-111111111111',
    school_name: 'KITE Innovation Model School',
    bio: 'Lead STEM and Robotics Educator. Mentoring future engineers across India.',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    is_active: true,
    created_at: '2026-07-15T10:00:00Z'
  },
  'usr-school-admin-1': {
    id: 'usr-school-admin-1',
    email: 'schooladmin@kite.test',
    full_name: 'Vikram Seth',
    username: 'vikram_principal',
    role: 'school_admin',
    grade_level: 'School Administrator',
    school_id: 's1111111-1111-1111-1111-111111111111',
    school_name: 'KITE Innovation Model School',
    bio: 'Academic Director and STEM Program Lead at KITE Innovation Model School.',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    is_active: true,
    created_at: '2026-07-01T10:00:00Z'
  },
  'usr-admin-1': {
    id: 'usr-admin-1',
    email: 'admin@kite.test',
    full_name: 'KITE Central Administrator',
    username: 'kite_admin',
    role: 'admin',
    school_name: 'KITE Robotics Platform HQ',
    bio: 'Central STEM Curriculum and Systems Administrator for KITE ProjectVerse.',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    is_active: true,
    created_at: '2026-06-01T10:00:00Z'
  }
};

// ============================================================================
// 3. SEED SCHOOLS & CLASSES
// ============================================================================
export const SEED_SCHOOLS: School[] = [
  {
    id: 's1111111-1111-1111-1111-111111111111',
    name: 'KITE Innovation Model School',
    code: 'KITE-DL-01',
    city: 'New Delhi',
    state: 'Delhi',
    board: 'CBSE',
    contact_email: 'stem@kiteschool.edu.in',
    plan_tier: 'premium_institution',
    is_active: true,
    student_count: 240,
    teacher_count: 8,
    created_at: '2026-07-01T10:00:00Z'
  },
  {
    id: 's2222222-2222-2222-2222-222222222222',
    name: 'Bengaluru STEM Academy',
    code: 'BLR-STEM-02',
    city: 'Bengaluru',
    state: 'Karnataka',
    board: 'ICSE',
    contact_email: 'lab@blrstem.ac.in',
    plan_tier: 'standard',
    is_active: true,
    student_count: 180,
    teacher_count: 6,
    created_at: '2026-08-01T10:00:00Z'
  }
];

export const SEED_CLASSES: ClassGroup[] = [
  {
    id: 'cls-001',
    school_id: 's1111111-1111-1111-1111-111111111111',
    teacher_id: 'usr-teacher-1',
    teacher_name: 'Priya Raman',
    name: 'Class 8 - Robotics & IoT Innovators',
    grade: '8',
    section: 'A',
    academic_year: '2026-2027',
    join_code: 'ROBOT8A',
    student_count: 28,
    created_at: '2026-08-05T10:00:00Z'
  },
  {
    id: 'cls-002',
    school_id: 's1111111-1111-1111-1111-111111111111',
    teacher_id: 'usr-teacher-1',
    teacher_name: 'Priya Raman',
    name: 'Class 9 - AI & Advanced Automation',
    grade: '9',
    section: 'B',
    academic_year: '2026-2027',
    join_code: 'AILAB9B',
    student_count: 24,
    created_at: '2026-08-05T10:00:00Z'
  }
];

// ============================================================================
// 4. SEED BADGES
// ============================================================================
export const SEED_BADGES: Badge[] = [
  {
    id: 'b1111111-1111-1111-1111-111111111111',
    code: 'FIRST_CIRCUIT',
    title: 'First Circuit',
    description: 'Assembled and powered your first functional electronic circuit.',
    icon: 'Zap',
    category: 'hardware',
    criteria: 'Complete an electronics or circuit project.'
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    code: 'CODE_COMMANDER',
    title: 'Code Commander',
    description: 'Wrote, debugged, and saved embedded software in ProjectVerse.',
    icon: 'Terminal',
    category: 'coding',
    criteria: 'Save and test project code in the workspace.'
  },
  {
    id: 'b3333333-3333-3333-3333-333333333333',
    code: 'ROBOTICS_PIONEER',
    title: 'Robotics Pioneer',
    description: 'Successfully built and tested an autonomous obstacle-avoiding robot.',
    icon: 'Bot',
    category: 'robotics',
    criteria: 'Complete and submit a verified robotics project.'
  },
  {
    id: 'b4444444-4444-4444-4444-444444444444',
    code: 'AI_EXPLORER',
    title: 'AI Explorer',
    description: 'Trained or integrated computer vision or machine learning algorithms.',
    icon: 'Cpu',
    category: 'innovation',
    criteria: 'Complete an AI or machine learning project.'
  },
  {
    id: 'b5555555-5555-5555-5555-555555555555',
    code: 'GREEN_INNOVATOR',
    title: 'Green Innovator',
    description: 'Constructed an environmental, sustainable, or solar-powered STEM system.',
    icon: 'Leaf',
    category: 'mastery',
    criteria: 'Complete an eco-technology or solar project.'
  }
];

// ============================================================================
// 5. IN-MEMORY STATE STORE (With full mutations & persistence for dev/tests)
// ============================================================================
class Store {
  projects: Project[] = [...SEED_PROJECTS];
  users: Record<string, UserProfile> = { ...SEED_USERS };
  schools: School[] = [...SEED_SCHOOLS];
  classes: ClassGroup[] = [...SEED_CLASSES];
  studentProjects: Map<string, StudentProject> = new Map();
  codeRevisions: CodeRevision[] = [];
  submissions: ProjectSubmission[] = [];
  reviews: MentorReview[] = [];
  assignments: Assignment[] = [];
  badges: Badge[] = [...SEED_BADGES];
  studentBadges: StudentBadge[] = [];
  portfolios: Map<string, StudentPortfolio> = new Map();
  notifications: InAppNotification[] = [];
  auditLogs: AuditLog[] = [];

  constructor() {
    this.seedInitialStudentData();
  }

  private seedInitialStudentData() {
    const student = this.users['usr-student-1'];
    const p1 = this.projects[0]; // Obstacle Avoiding Robot

    // Pre-populate student project
    const spKey = `${student.id}_${p1.id}`;
    const sp1: StudentProject = {
      id: 'sp-001',
      student_id: student.id,
      project_id: p1.id,
      project: p1,
      status: 'in_progress',
      current_step: 3,
      progress_percent: 60,
      active_code: p1.starter_code || '',
      active_language: p1.starter_language,
      student_notes: 'Tested PWM speeds. ENA at 180 and ENB at 180 keeps the rover straight on tile flooring.',
      started_at: '2026-10-10T14:00:00Z',
      last_saved_at: '2026-10-18T16:30:00Z'
    };
    this.studentProjects.set(spKey, sp1);

    // Initial student badges
    this.studentBadges.push({
      id: 'sb-001',
      student_id: student.id,
      badge_id: this.badges[0].id,
      badge: this.badges[0],
      awarded_at: '2026-10-12T11:00:00Z',
      reason: 'Assembled initial breadboard circuit and passed voltage checks'
    });
    this.studentBadges.push({
      id: 'sb-002',
      student_id: student.id,
      badge_id: this.badges[1].id,
      badge: this.badges[1],
      awarded_at: '2026-10-15T15:30:00Z',
      reason: 'Saved custom obstacle-avoidance algorithm in workspace'
    });

    // Seed an assignment from teacher
    this.assignments.push({
      id: 'asg-001',
      class_id: 'cls-001',
      class_name: 'Class 8 - Robotics & IoT Innovators',
      project_id: p1.id,
      project_title: p1.title,
      teacher_id: 'usr-teacher-1',
      title: 'Term 1 Capstone: Autonomous Obstacle Rover',
      description: 'Build your 2WD chassis, calibrate ultrasonic threshold to 20cm, and record a video showing 2 continuous obstacle maneuvers.',
      due_date: '2026-11-15T23:59:59Z',
      points_possible: 100,
      submissions_count: 14,
      status: 'active',
      created_at: '2026-10-05T09:00:00Z'
    });

    // Seed sample completed submission with review for Solar Tracker project
    const p4 = this.projects[3];
    const subId = 'sub-demo-001';
    const sampleSubmission: ProjectSubmission = {
      id: subId,
      student_project_id: 'sp-completed-001',
      student_id: student.id,
      student_name: student.full_name,
      student_username: student.username,
      project_id: p4.id,
      project_title: p4.title,
      title: 'Dual-Axis Sunflower Solar Tracker Build',
      explanation: 'I constructed a pan-and-tilt servo mechanism with a cardboard light divider. When a flashlight shines from the side, the four LDRs calculate the direction of highest intensity and the servos rotate the solar panel smoothly.',
      learnings: 'I learned how voltage dividers work and why a deadband tolerance is necessary to stop the micro-servos from jittering.',
      challenges_faced: 'The plastic gears in one SG90 servo slipped initially until I adjusted the mechanical zero-stop position.',
      video_url: 'https://youtu.be/sample-solar-demo',
      status: 'approved',
      submitted_at: '2026-10-14T10:00:00Z',
      updated_at: '2026-10-15T16:00:00Z',
      review: {
        id: 'rev-001',
        submission_id: subId,
        reviewer_id: 'usr-teacher-1',
        reviewer_name: 'Priya Raman',
        overall_score: 28,
        max_score: 30,
        rubric_scores: [
          { criterion: 'Working Functionality & Evidence', max_points: 5, score: 5, feedback: 'Video demonstrates responsive dual-axis movement.' },
          { criterion: 'Concept Understanding', max_points: 5, score: 5, feedback: 'Accurately explained voltage divider math.' },
          { criterion: 'Code/Build Quality', max_points: 5, score: 4, feedback: 'Code is well-commented; nice use of deadband tolerance.' },
          { criterion: 'Creativity & Problem Solving', max_points: 5, score: 5, feedback: 'Clever cardboard cross partition to cast clear shadows.' },
          { criterion: 'Explanation & Documentation', max_points: 5, score: 5, feedback: 'Very articulate reflection on gear calibration.' },
          { criterion: 'Safety & Responsible Implementation', max_points: 5, score: 4, feedback: 'Low voltage setup respected throughout.' }
        ],
        written_feedback: 'Outstanding work Aarav! Your mathematical understanding of the LDR voltage divider and careful servo calibration makes this one of the best sunflower trackers in Class 8.',
        status: 'approved',
        reviewed_at: '2026-10-15T16:00:00Z'
      }
    };
    this.submissions.push(sampleSubmission);

    // Seed student portfolio
    this.portfolios.set(student.username, {
      id: 'port-001',
      user_id: student.id,
      username: student.username,
      display_name: 'Aarav S. (Maker & Robotics Enthusiast)',
      custom_bio: 'Class 8 STEM student building autonomous robotics, electronics sensors, and green energy innovations.',
      is_public: true,
      show_school: false,
      school_name: student.school_name,
      grade_level: student.grade_level,
      featured_badge: this.badges[0],
      completed_projects: [
        {
          student_project_id: 'sp-completed-001',
          project_id: p4.id,
          project_title: p4.title,
          project_slug: p4.slug,
          category: p4.category,
          cover_image: p4.cover_image,
          completed_at: '2026-10-15T16:00:00Z',
          student_reflection: 'Engineered a dual-axis sunflower tracker using Arduino and 4 photoresistors.',
          score: 28
        }
      ],
      earned_badges: [this.badges[0], this.badges[1]],
      skills: ['Arduino C++', 'H-Bridge Drivers', 'Pulse Width Modulation (PWM)', 'Voltage Dividers', 'Robotics Kinematics', 'Circuit Debugging'],
      updated_at: '2026-10-15T16:00:00Z'
    });

    // Seed notifications for student
    this.notifications.push({
      id: 'notif-001',
      user_id: student.id,
      title: 'Review Approved! 🎉',
      message: 'Teacher Priya Raman reviewed and approved your Solar Tracker project with a score of 28/30.',
      link: '/submissions',
      type: 'success',
      is_read: false,
      created_at: '2026-10-15T16:05:00Z'
    });
    this.notifications.push({
      id: 'notif-002',
      user_id: student.id,
      title: 'New Assignment Posted',
      message: 'Priya Raman assigned "Term 1 Capstone: Autonomous Obstacle Rover" due on Nov 15.',
      link: '/workspace/proj-001',
      type: 'assignment',
      is_read: true,
      created_at: '2026-10-05T09:05:00Z'
    });
  }
}

// Global singleton instance for in-memory persistence across hot-reloads
declare global {
  var __kite_store: Store | undefined;
}

export const store = global.__kite_store || new Store();
if (process.env.NODE_ENV !== 'production') {
  global.__kite_store = store;
}

// ============================================================================
// 6. PUBLIC DATA ACCESS FUNCTIONS
// ============================================================================

export async function getProjects(filters?: {
  category?: string;
  difficulty?: string;
  search?: string;
  tier?: string;
}): Promise<Project[]> {
  let list = [...store.projects];

  if (filters?.category && filters.category !== 'All') {
    list = list.filter(p => p.category.toLowerCase() === filters.category?.toLowerCase());
  }
  if (filters?.difficulty && filters.difficulty !== 'All') {
    list = list.filter(p => p.difficulty.toLowerCase() === filters.difficulty?.toLowerCase());
  }
  if (filters?.tier && filters.tier !== 'All') {
    list = list.filter(p => p.access_tier.toLowerCase() === filters.tier?.toLowerCase());
  }
  if (filters?.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.summary.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.learning_objectives.some(o => o.toLowerCase().includes(q))
    );
  }

  return list;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const p = store.projects.find(proj => proj.slug === slug);
  return p ? { ...p } : null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const p = store.projects.find(proj => proj.id === id);
  return p ? { ...p } : null;
}

export async function createProject(data: ProjectInput, authorId?: string): Promise<Project> {
  const newProject: Project = {
    id: `proj-${Date.now()}`,
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    description: data.description,
    category: data.category,
    grade_min: data.grade_min,
    grade_max: data.grade_max,
    difficulty: data.difficulty,
    estimated_hours: data.estimated_hours,
    estimated_cost_inr: data.estimated_cost_inr,
    tools_required: data.tools_required,
    learning_objectives: data.learning_objectives,
    safety_notes: data.safety_notes,
    cover_image: data.cover_image,
    starter_code: data.starter_code,
    starter_language: data.starter_language,
    troubleshooting_guide: data.troubleshooting_guide,
    submission_requirements: data.submission_requirements,
    access_tier: data.access_tier,
    is_published: data.is_published,
    is_featured: data.is_featured,
    author_id: authorId || 'usr-admin-1',
    steps: [
      {
        id: `s-${Date.now()}-1`,
        project_id: `proj-${Date.now()}`,
        step_number: 1,
        title: 'Component Inspection & Breadboard Layout',
        content: 'Check all components against the parts list and layout initial breadboard power lines.'
      }
    ],
    components: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  store.projects.unshift(newProject);
  logAudit('CREATE_PROJECT', authorId || 'usr-admin-1', 'project', newProject.id, { title: newProject.title });
  return newProject;
}

export async function updateProject(id: string, data: Partial<ProjectInput>, actorId?: string): Promise<Project | null> {
  const idx = store.projects.findIndex(p => p.id === id);
  if (idx === -1) return null;

  store.projects[idx] = {
    ...store.projects[idx],
    ...data,
    updated_at: new Date().toISOString()
  };
  logAudit('UPDATE_PROJECT', actorId || 'usr-admin-1', 'project', id, { updatedFields: Object.keys(data) });
  return store.projects[idx];
}

export async function deleteProject(id: string, actorId?: string): Promise<boolean> {
  const idx = store.projects.findIndex(p => p.id === id);
  if (idx === -1) return false;
  store.projects.splice(idx, 1);
  logAudit('DELETE_PROJECT', actorId || 'usr-admin-1', 'project', id, {});
  return true;
}

export async function getStudentProjects(studentId: string): Promise<StudentProject[]> {
  const list: StudentProject[] = [];
  store.studentProjects.forEach(sp => {
    if (sp.student_id === studentId) {
      const proj = store.projects.find(p => p.id === sp.project_id);
      list.push({ ...sp, project: proj });
    }
  });
  return list;
}

export async function getStudentProject(studentId: string, projectId: string): Promise<StudentProject | null> {
  const key = `${studentId}_${projectId}`;
  let sp = store.studentProjects.get(key);
  
  if (!sp) {
    const proj = store.projects.find(p => p.id === projectId);
    if (!proj) return null;
    
    // Auto-initialize project for student
    sp = {
      id: `sp-${Date.now()}`,
      student_id: studentId,
      project_id: projectId,
      project: proj,
      status: 'in_progress',
      current_step: 1,
      progress_percent: 10,
      active_code: proj.starter_code || '',
      active_language: proj.starter_language,
      student_notes: '',
      started_at: new Date().toISOString(),
      last_saved_at: new Date().toISOString()
    };
    store.studentProjects.set(key, sp);
    return { ...sp };
  }

  const proj = store.projects.find(p => p.id === sp.project_id);
  sp.project = proj;
  return { ...sp };
}

export async function saveStudentWorkspace(input: WorkspaceSaveInput, studentId: string): Promise<StudentProject> {
  let matchedKey: string | null = null;
  let targetSp: StudentProject | null = null;

  for (const [key, sp] of store.studentProjects.entries()) {
    if (sp.id === input.studentProjectId && sp.student_id === studentId) {
      matchedKey = key;
      targetSp = sp;
      break;
    }
  }

  if (!targetSp || !matchedKey) {
    throw new Error('Student project instance not found or unauthorized');
  }

  targetSp.active_code = input.activeCode;
  targetSp.active_language = input.activeLanguage;
  targetSp.current_step = input.currentStep;
  targetSp.progress_percent = input.progressPercent;
  targetSp.student_notes = input.studentNotes;
  targetSp.last_saved_at = new Date().toISOString();

  // Create code revision snapshot
  store.codeRevisions.push({
    id: `rev-${Date.now()}`,
    student_project_id: targetSp.id,
    code: input.activeCode,
    language: input.activeLanguage,
    notes: `Autosave at Step ${input.currentStep}`,
    created_at: new Date().toISOString()
  });

  return { ...targetSp };
}

export async function createSubmission(input: SubmissionInput, studentId: string): Promise<ProjectSubmission> {
  let targetSp: StudentProject | null = null;
  for (const sp of store.studentProjects.values()) {
    if (sp.id === input.studentProjectId && sp.student_id === studentId) {
      targetSp = sp;
      break;
    }
  }

  if (!targetSp) {
    throw new Error('Project instance not found');
  }

  const student = store.users[studentId];
  const project = store.projects.find(p => p.id === targetSp?.project_id);

  const newSub: ProjectSubmission = {
    id: `sub-${Date.now()}`,
    student_project_id: targetSp.id,
    assignment_id: input.assignmentId || undefined,
    student_id: studentId,
    student_name: student?.full_name || 'Student Maker',
    student_username: student?.username || 'maker',
    project_id: targetSp.project_id,
    project_title: project?.title || 'STEM Project',
    title: input.title,
    explanation: input.explanation,
    learnings: input.learnings,
    challenges_faced: input.challengesFaced,
    video_url: input.videoUrl,
    code_snapshot: input.codeSnapshot || targetSp.active_code,
    status: 'submitted',
    submitted_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  store.submissions.unshift(newSub);
  targetSp.status = 'submitted';

  // Notify teacher
  const teacherId = 'usr-teacher-1';
  store.notifications.push({
    id: `notif-${Date.now()}`,
    user_id: teacherId,
    title: 'New Student Submission Ready for Review',
    message: `${student?.full_name || 'A student'} submitted "${input.title}" for review.`,
    link: '/teacher/reviews',
    type: 'assignment',
    is_read: false,
    created_at: new Date().toISOString()
  });

  return newSub;
}

export async function getSubmissions(filters?: {
  status?: string;
  studentId?: string;
  classId?: string;
}): Promise<ProjectSubmission[]> {
  let list = [...store.submissions];

  if (filters?.studentId) {
    list = list.filter(s => s.student_id === filters.studentId);
  }
  if (filters?.status && filters.status !== 'All') {
    list = list.filter(s => s.status === filters.status);
  }

  return list;
}

export async function getSubmissionById(id: string): Promise<ProjectSubmission | null> {
  const sub = store.submissions.find(s => s.id === id);
  return sub ? { ...sub } : null;
}

export async function reviewSubmission(input: ReviewInput, reviewerId: string): Promise<MentorReview> {
  const sub = store.submissions.find(s => s.id === input.submissionId);
  if (!sub) throw new Error('Submission not found');

  const reviewer = store.users[reviewerId];

  const review: MentorReview = {
    id: `rev-${Date.now()}`,
    submission_id: input.submissionId,
    reviewer_id: reviewerId,
    reviewer_name: reviewer?.full_name || 'STEM Mentor',
    overall_score: input.overallScore,
    max_score: 30,
    rubric_scores: input.rubricScores,
    written_feedback: input.writtenFeedback,
    status: input.status,
    reviewed_at: new Date().toISOString()
  };

  store.reviews.push(review);
  sub.status = input.status;
  sub.review = review;
  sub.updated_at = new Date().toISOString();

  // If approved, update student project to completed and award badges!
  if (input.status === 'approved') {
    for (const sp of store.studentProjects.values()) {
      if (sp.id === sub.student_project_id) {
        sp.status = 'completed';
        sp.progress_percent = 100;
        sp.completed_at = new Date().toISOString();
        break;
      }
    }

    // Award badge if not already awarded
    const pioneerBadge = store.badges[2]; // Robotics Pioneer
    const alreadyHas = store.studentBadges.some(sb => sb.student_id === sub.student_id && sb.badge_id === pioneerBadge.id);
    if (!alreadyHas) {
      store.studentBadges.push({
        id: `sb-${Date.now()}`,
        student_id: sub.student_id,
        badge_id: pioneerBadge.id,
        badge: pioneerBadge,
        awarded_at: new Date().toISOString(),
        reason: `Completed project "${sub.project_title}" with verified score ${input.overallScore}/30`
      });

      store.notifications.push({
        id: `notif-badge-${Date.now()}`,
        user_id: sub.student_id,
        title: 'Badge Unlocked: Robotics Pioneer! 🏆',
        message: `Congratulations! You earned the Robotics Pioneer badge for "${sub.project_title}".`,
        link: '/portfolio/' + (sub.student_username || 'aarav_maker'),
        type: 'badge',
        is_read: false,
        created_at: new Date().toISOString()
      });
    }
  }

  // Notify student
  store.notifications.push({
    id: `notif-${Date.now()}`,
    user_id: sub.student_id,
    title: input.status === 'approved' ? 'Submission Approved! 🎉' : 'Revisions Requested 🛠️',
    message: `${reviewer?.full_name || 'Mentor'} reviewed your project "${sub.title}" (${input.overallScore}/30).`,
    link: '/submissions',
    type: input.status === 'approved' ? 'success' : 'warning',
    is_read: false,
    created_at: new Date().toISOString()
  });

  return review;
}

export async function getStudentPortfolio(username: string): Promise<StudentPortfolio | null> {
  let port = store.portfolios.get(username);
  if (port) return { ...port };

  // Check if user exists
  const user = Object.values(store.users).find(u => u.username === username);
  if (!user) return null;

  // Generate portfolio
  const defaultPort: StudentPortfolio = {
    id: `port-${user.id}`,
    user_id: user.id,
    username: user.username,
    display_name: `${user.full_name} (Maker)`,
    custom_bio: user.bio || 'STEM student builder at KITE ProjectVerse.',
    is_public: true,
    show_school: false,
    school_name: user.school_name,
    grade_level: user.grade_level,
    completed_projects: [],
    earned_badges: [],
    skills: ['Electronics Basics', 'Computational Thinking', 'STEM Innovation'],
    updated_at: new Date().toISOString()
  };
  store.portfolios.set(username, defaultPort);
  return defaultPort;
}

export async function updateStudentPortfolio(userId: string, input: PortfolioSettingsInput): Promise<StudentPortfolio> {
  const user = store.users[userId];
  if (!user) throw new Error('User not found');

  let port = store.portfolios.get(user.username);
  if (!port) {
    port = (await getStudentPortfolio(user.username))!;
  }

  port.display_name = input.displayName;
  port.custom_bio = input.customBio;
  port.is_public = input.isPublic;
  port.show_school = input.showSchool;
  port.updated_at = new Date().toISOString();

  store.portfolios.set(user.username, port);
  return { ...port };
}

export async function getClasses(schoolId?: string, teacherId?: string): Promise<ClassGroup[]> {
  let list = [...store.classes];
  if (schoolId) list = list.filter(c => c.school_id === schoolId);
  if (teacherId) list = list.filter(c => c.teacher_id === teacherId);
  return list;
}

export async function createClass(input: ClassGroupInput, teacherId: string): Promise<ClassGroup> {
  const newClass: ClassGroup = {
    id: `cls-${Date.now()}`,
    school_id: input.schoolId,
    teacher_id: teacherId,
    teacher_name: store.users[teacherId]?.full_name || 'STEM Faculty',
    name: input.name,
    grade: input.grade,
    section: input.section,
    academic_year: input.academicYear,
    join_code: `KITE-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    student_count: 0,
    created_at: new Date().toISOString()
  };
  store.classes.push(newClass);
  return newClass;
}

export async function getAssignments(classId?: string, teacherId?: string): Promise<Assignment[]> {
  let list = [...store.assignments];
  if (classId) list = list.filter(a => a.class_id === classId);
  if (teacherId) list = list.filter(a => a.teacher_id === teacherId);
  return list;
}

export async function createAssignment(input: AssignmentInput, teacherId: string): Promise<Assignment> {
  const cls = store.classes.find(c => c.id === input.classId);
  const proj = store.projects.find(p => p.id === input.projectId);

  const newAsg: Assignment = {
    id: `asg-${Date.now()}`,
    class_id: input.classId,
    class_name: cls?.name || 'Class Group',
    project_id: input.projectId,
    project_title: proj?.title || 'STEM Project',
    teacher_id: teacherId,
    title: input.title,
    description: input.description,
    due_date: input.dueDate,
    points_possible: input.pointsPossible,
    submissions_count: 0,
    status: 'active',
    created_at: new Date().toISOString()
  };
  store.assignments.unshift(newAsg);
  return newAsg;
}

export async function getNotifications(userId: string): Promise<InAppNotification[]> {
  return store.notifications
    .filter(n => n.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  const n = store.notifications.find(item => item.id === id);
  if (n) {
    n.is_read = true;
    return true;
  }
  return false;
}

export async function getBadges(): Promise<Badge[]> {
  return [...store.badges];
}

export async function getStudentBadges(studentId: string): Promise<StudentBadge[]> {
  return store.studentBadges.filter(sb => sb.student_id === studentId);
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  return [...store.auditLogs];
}

export function logAudit(
  action: string,
  actorId: string,
  targetType: string,
  targetId: string,
  details: Record<string, unknown>
): void {
  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    actor_id: actorId,
    actor_name: store.users[actorId]?.full_name || 'System Actor',
    action,
    target_type: targetType,
    target_id: targetId,
    details,
    created_at: new Date().toISOString()
  });
}
