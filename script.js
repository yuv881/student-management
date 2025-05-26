// DOM Elements
const addStudentModal = document.getElementById('addStudentModal');
const addStudentForm = document.getElementById('addStudentForm');
const closeModal = document.querySelector('.close');
const searchInput = document.querySelector('.search-bar input');
const classSelect = document.getElementById('class-select');
const subjectSelect = document.getElementById('subject-select');
const examTypeSelect = document.getElementById('exam-type');
const attendanceDate = document.getElementById('attendance-date');

// Sample data (In a real application, this would come from a backend)
let students = [];

// Sample subjects data
const subjects = {
    // Primary School (Classes 1-5)
    '1A': ['English', 'Mathematics', 'Environmental Studies', 'Art', 'Physical Education', 'Music'],
    '1B': ['English', 'Mathematics', 'Environmental Studies', 'Art', 'Physical Education', 'Music'],
    '2A': ['English', 'Mathematics', 'Environmental Studies', 'Art', 'Physical Education', 'Music'],
    '2B': ['English', 'Mathematics', 'Environmental Studies', 'Art', 'Physical Education', 'Music'],
    '3A': ['English', 'Mathematics', 'Environmental Studies', 'Art', 'Physical Education', 'Music'],
    '3B': ['English', 'Mathematics', 'Environmental Studies', 'Art', 'Physical Education', 'Music'],
    '4A': ['English', 'Mathematics', 'Science', 'Social Studies', 'Art', 'Physical Education', 'Music'],
    '4B': ['English', 'Mathematics', 'Science', 'Social Studies', 'Art', 'Physical Education', 'Music'],
    '5A': ['English', 'Mathematics', 'Science', 'Social Studies', 'Art', 'Physical Education', 'Music'],
    '5B': ['English', 'Mathematics', 'Science', 'Social Studies', 'Art', 'Physical Education', 'Music'],
    
    // Middle School (Classes 6-8)
    '6A': ['English', 'Mathematics', 'Science', 'Social Studies', 'Computer Science', 'Art', 'Physical Education'],
    '6B': ['English', 'Mathematics', 'Science', 'Social Studies', 'Computer Science', 'Art', 'Physical Education'],
    '7A': ['English', 'Mathematics', 'Science', 'Social Studies', 'Computer Science', 'Art', 'Physical Education'],
    '7B': ['English', 'Mathematics', 'Science', 'Social Studies', 'Computer Science', 'Art', 'Physical Education'],
    '8A': ['English', 'Mathematics', 'Science', 'Social Studies', 'Computer Science', 'Art', 'Physical Education'],
    '8B': ['English', 'Mathematics', 'Science', 'Social Studies', 'Computer Science', 'Art', 'Physical Education'],
    
    // High School (Classes 9-12)
    '9A': ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Art', 'Physical Education'],
    '9B': ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Art', 'Physical Education'],
    '10A': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'],
    '10B': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'],
    '11A': ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'Computer Science'],
    '11B': ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'Computer Science'],
    '12A': ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'Computer Science', 'Economics'],
    '12B': ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'Computer Science', 'Business Studies']
};

// Attendance data
let attendanceRecords = {};

// Grade data
let gradeRecords = {};

// Modal functions
function showAddStudentModal() {
    addStudentModal.style.display = 'block';
}

function closeAddStudentModal() {
    addStudentModal.style.display = 'none';
}

// Event Listeners
closeModal.addEventListener('click', closeAddStudentModal);
window.addEventListener('click', (e) => {
    if (e.target === addStudentModal) {
        closeAddStudentModal();
    }
});

// Form submission
addStudentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newStudent = {
        id: generateStudentId(),
        name: document.getElementById('studentName').value,
        class: document.getElementById('studentClass').value,
        email: document.getElementById('studentEmail').value,
        phone: document.getElementById('studentPhone').value
    };

    students.push(newStudent);
    updateStudentsTable();
    updateDashboardStats();
    closeAddStudentModal();
    addStudentForm.reset();
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm) ||
        student.id.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm)
    );
    updateStudentsTable(filteredStudents);
});

// Update students table
function updateStudentsTable(studentsToShow = students) {
    const tbody = document.querySelector('.students-table tbody');
    tbody.innerHTML = '';

    studentsToShow.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.class}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>
                <button class="btn-icon" onclick="editStudent('${student.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" onclick="deleteStudent('${student.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Generate unique student ID
function generateStudentId() {
    const lastId = students.length > 0 ? 
        parseInt(students[students.length - 1].id) : 0;
    return String(lastId + 1).padStart(3, '0');
}

// Edit student
function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (student) {
        document.getElementById('studentName').value = student.name;
        document.getElementById('studentClass').value = student.class;
        document.getElementById('studentEmail').value = student.email;
        document.getElementById('studentPhone').value = student.phone;
        showAddStudentModal();
    }
}

// Delete student
function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(student => student.id !== id);
        updateStudentsTable();
        updateDashboardStats();
    }
}

// Attendance management
classSelect.addEventListener('change', updateAttendanceTable);
attendanceDate.addEventListener('change', updateAttendanceTable);

function updateAttendanceTable() {
    const selectedClass = classSelect.value;
    const selectedDate = attendanceDate.value;
    
    if (selectedClass && selectedDate) {
        const attendanceTable = document.querySelector('.attendance-table tbody');
        attendanceTable.innerHTML = '';
        
        // Filter students by selected class
        const classStudents = students.filter(student => student.class === `Class ${selectedClass}`);
        
        classStudents.forEach(student => {
            const existingRecord = attendanceRecords[selectedDate]?.[student.id];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>
                    <select class="attendance-status" onchange="saveAttendance('${student.id}', this.value, this.parentElement.nextElementSibling.querySelector('input').value)">
                        <option value="present" ${existingRecord?.status === 'present' ? 'selected' : ''}>Present</option>
                        <option value="absent" ${existingRecord?.status === 'absent' ? 'selected' : ''}>Absent</option>
                        <option value="late" ${existingRecord?.status === 'late' ? 'selected' : ''}>Late</option>
                    </select>
                </td>
                <td>
                    <input type="text" placeholder="Add remarks" value="${existingRecord?.remarks || ''}" 
                           onchange="saveAttendance('${student.id}', this.parentElement.previousElementSibling.querySelector('select').value, this.value)">
                </td>
            `;
            attendanceTable.appendChild(row);
        });
    }
}

// Grade management
subjectSelect.addEventListener('change', updateGradesTable);
examTypeSelect.addEventListener('change', updateGradesTable);

function updateGradesTable() {
    const selectedSubject = subjectSelect.value;
    const selectedExamType = examTypeSelect.value;
    const selectedClass = document.getElementById('class-select').value;
    
    if (selectedSubject && selectedExamType && selectedClass) {
        const gradesTable = document.querySelector('.grades-table tbody');
        gradesTable.innerHTML = '';
        
        // Filter students by selected class
        const classStudents = students.filter(student => student.class === `Class ${selectedClass}`);
        
        classStudents.forEach(student => {
            const existingGrade = gradeRecords[selectedClass]?.[selectedSubject]?.[selectedExamType]?.[student.id];
            const row = document.createElement('tr');
            row.setAttribute('data-student-id', student.id);
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>
                    <input type="number" min="0" max="100" placeholder="Enter marks" 
                           value="${existingGrade?.marks || ''}" 
                           onchange="saveGrade('${student.id}')">
                </td>
                <td>${existingGrade?.grade || '-'}</td>
                <td>
                    <button class="btn-icon" onclick="saveGrade('${student.id}')">
                        <i class="fas fa-save"></i>
                    </button>
                </td>
            `;
            gradesTable.appendChild(row);
        });
    }
}

// Add function to calculate grade based on marks
function calculateGrade(marks) {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    if (marks >= 50) return 'D';
    return 'F';
}

// Add function to save grade
function saveGrade(studentId) {
    const row = document.querySelector(`tr[data-student-id="${studentId}"]`);
    const marks = parseInt(row.querySelector('input[type="number"]').value);
    const gradeCell = row.querySelector('td:nth-child(4)');
    const grade = calculateGrade(marks);
    gradeCell.textContent = grade;

    // Save grade record
    const selectedSubject = subjectSelect.value;
    const selectedExamType = examTypeSelect.value;
    const selectedClass = document.getElementById('class-select').value;

    if (!gradeRecords[selectedClass]) {
        gradeRecords[selectedClass] = {};
    }
    if (!gradeRecords[selectedClass][selectedSubject]) {
        gradeRecords[selectedClass][selectedSubject] = {};
    }
    if (!gradeRecords[selectedClass][selectedSubject][selectedExamType]) {
        gradeRecords[selectedClass][selectedSubject][selectedExamType] = {};
    }

    gradeRecords[selectedClass][selectedSubject][selectedExamType][studentId] = {
        marks,
        grade,
        timestamp: new Date().toISOString()
    };
}

// Update subject options based on selected class
function updateSubjectOptions(selectedClass) {
    const subjectSelect = document.getElementById('subject-select');
    subjectSelect.innerHTML = '<option value="">Select Subject</option>';
    
    if (selectedClass && subjects[selectedClass]) {
        subjects[selectedClass].forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.toLowerCase().replace(/\s+/g, '_');
            option.textContent = subject;
            subjectSelect.appendChild(option);
        });
    }
}

// Add event listener for class selection
document.getElementById('studentClass').addEventListener('change', (e) => {
    updateSubjectOptions(e.target.value);
});

// Update dashboard statistics
function updateDashboardStats() {
    // Update total students
    const totalStudentsElement = document.querySelector('.stat-card:nth-child(1) p');
    totalStudentsElement.textContent = students.length;

    // Update total teachers (sample data)
    const totalTeachersElement = document.querySelector('.stat-card:nth-child(2) p');
    totalTeachersElement.textContent = '45';

    // Update total courses
    const totalCoursesElement = document.querySelector('.stat-card:nth-child(3) p');
    const uniqueSubjects = new Set();
    Object.values(subjects).forEach(classSubjects => {
        classSubjects.forEach(subject => uniqueSubjects.add(subject));
    });
    totalCoursesElement.textContent = uniqueSubjects.size;

    // Update attendance rate
    const attendanceRateElement = document.querySelector('.stat-card:nth-child(4) p');
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendanceRecords[today] || {};
    let totalPresent = 0;
    let totalStudents = 0;

    Object.values(todayAttendance).forEach(record => {
        if (record.status === 'present') {
            totalPresent++;
        }
        totalStudents++;
    });

    const attendanceRate = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;
    attendanceRateElement.textContent = `${attendanceRate}%`;
}

// Save attendance record
function saveAttendance(studentId, status, remarks) {
    const date = attendanceDate.value;
    if (!attendanceRecords[date]) {
        attendanceRecords[date] = {};
    }
    attendanceRecords[date][studentId] = {
        status,
        remarks,
        timestamp: new Date().toISOString()
    };
    updateDashboardStats();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    updateStudentsTable();
    updateDashboardStats();
    attendanceDate.valueAsDate = new Date();
    
    // Initialize subject options for the first class
    const firstClass = document.getElementById('studentClass').value;
    if (firstClass) {
        updateSubjectOptions(firstClass);
    }
}); 