
// ========================================
// STUDENT DATA
// ========================================

let students = JSON.parse(
    localStorage.getItem("students")
) || [];


// ========================================
// PAGE NAVIGATION
// ========================================

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.remove("active");
    });

    document
        .getElementById(sectionId)
        .classList.add("active");


    // Update navigation

    const navButtons =
        document.querySelectorAll(".nav-btn");

    navButtons.forEach(button => {
        button.classList.remove("active");
    });


    if (sectionId === "dashboard") {

        navButtons[0].classList.add("active");

    } else if (sectionId === "students") {

        navButtons[1].classList.add("active");

    } else {

        navButtons[2].classList.add("active");
    }
}


// ========================================
// SAVE DATA
// ========================================

function saveData() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}


// ========================================
// ADD / SAVE STUDENT
// ========================================

function saveStudent(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "studentId"
        ).value.trim();

    const name =
        document.getElementById(
            "studentName"
        ).value.trim();

    const email =
        document.getElementById(
            "studentEmail"
        ).value.trim();

    const phone =
        document.getElementById(
            "studentPhone"
        ).value.trim();

    const course =
        document.getElementById(
            "studentCourse"
        ).value;

    const year =
        document.getElementById(
            "studentYear"
        ).value;

    const cgpa =
        parseFloat(
            document.getElementById(
                "studentCGPA"
            ).value
        );

    const attendance =
        parseFloat(
            document.getElementById(
                "studentAttendance"
            ).value
        );


    // Check duplicate ID

    const duplicate =
        students.some(
            student =>
                student.id.toLowerCase() ===
                id.toLowerCase()
        );


    if (duplicate) {

        alert(
            "Student ID already exists!"
        );

        return;
    }


    const student = {

        id,
        name,
        email,
        phone,
        course,
        year,
        cgpa,
        attendance,

        createdAt:
            new Date().toISOString()
    };


    students.push(student);

    saveData();

    updateDashboard();

    displayStudents();

    document
        .getElementById("studentForm")
        .reset();


    alert(
        "Student added successfully!"
    );


    showSection("students");
}


// ========================================
// DISPLAY STUDENTS
// ========================================

function displayStudents(
    studentList = students
) {

    const table =
        document.getElementById(
            "studentTable"
        );


    if (studentList.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8">
                    <div class="empty">
                        No students found.
                    </div>
                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML =
        studentList.map(student => {

            const attendanceClass =
                getAttendanceClass(
                    student.attendance
                );


            return `

                <tr>

                    <td>
                        <strong>
                            ${student.id}
                        </strong>
                    </td>


                    <td>

                        <div class="student-name">
                            ${student.name}
                        </div>

                    </td>


                    <td>

                        <div class="student-email">
                            ${student.email}
                        </div>

                    </td>


                    <td>
                        ${student.course}
                    </td>


                    <td>
                        ${student.year}
                    </td>


                    <td>
                        <strong>
                            ${student.cgpa.toFixed(2)}
                        </strong>
                    </td>


                    <td>

                        <span
                            class="badge ${attendanceClass}"
                        >
                            ${student.attendance}%
                        </span>

                    </td>


                    <td>

                        <button
                            class="action-btn edit-btn"
                            onclick="openEditModal('${student.id}')"
                        >
                            ✏️
                        </button>


                        <button
                            class="action-btn delete-btn"
                            onclick="deleteStudent('${student.id}')"
                        >
                            🗑️
                        </button>

                    </td>

                </tr>

            `;

        }).join("");
}


// ========================================
// ATTENDANCE COLOR
// ========================================

function getAttendanceClass(
    attendance
) {

    if (attendance >= 75) {

        return "badge-green";

    }

    if (attendance >= 60) {

        return "badge-yellow";

    }

    return "badge-red";
}


// ========================================
// SEARCH STUDENTS
// ========================================

function searchStudents() {

    const search =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase()
            .trim();


    const course =
        document
            .getElementById(
                "courseFilter"
            )
            .value;


    const filtered =
        students.filter(student => {

            const matchesSearch =

                student.name
                    .toLowerCase()
                    .includes(search)

                ||

                student.id
                    .toLowerCase()
                    .includes(search)

                ||

                student.email
                    .toLowerCase()
                    .includes(search)

                ||

                student.course
                    .toLowerCase()
                    .includes(search);


            const matchesCourse =
                course === "all" ||
                student.course === course;


            return (
                matchesSearch &&
                matchesCourse
            );

        });


    displayStudents(filtered);
}


// ========================================
// DELETE STUDENT
// ========================================

function deleteStudent(id) {

    const student =
        students.find(
            student =>
                student.id === id
        );


    if (!student) return;


    const confirmDelete =
        confirm(
            `Are you sure you want to delete ${student.name}?`
        );


    if (!confirmDelete) return;


    students =
        students.filter(
            student =>
                student.id !== id
        );


    saveData();

    displayStudents();

    updateDashboard();


    alert(
        "Student deleted successfully!"
    );
}


// ========================================
// EDIT MODAL
// ========================================

function openEditModal(id) {

    const student =
        students.find(
            student =>
                student.id === id
        );


    if (!student) return;


    document.getElementById(
        "modalId"
    ).value = student.id;


    document.getElementById(
        "modalName"
    ).value = student.name;


    document.getElementById(
        "modalEmail"
    ).value = student.email;


    document.getElementById(
        "modalPhone"
    ).value = student.phone;


    document.getElementById(
        "modalCGPA"
    ).value = student.cgpa;


    document.getElementById(
        "modalAttendance"
    ).value = student.attendance;


    document
        .getElementById("studentModal")
        .classList.add("show");
}


// ========================================
// UPDATE STUDENT
// ========================================

function updateStudent(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "modalId"
        ).value;


    const student =
        students.find(
            student =>
                student.id === id
        );


    if (!student) return;


    student.name =
        document.getElementById(
            "modalName"
        ).value.trim();


    student.email =
        document.getElementById(
            "modalEmail"
        ).value.trim();


    student.phone =
        document.getElementById(
            "modalPhone"
        ).value.trim();


    student.cgpa =
        parseFloat(
            document.getElementById(
                "modalCGPA"
            ).value
        );


    student.attendance =
        parseFloat(
            document.getElementById(
                "modalAttendance"
            ).value
        );


    saveData();

    displayStudents();

    updateDashboard();

    closeModal();


    alert(
        "Student updated successfully!"
    );
}


// ========================================
// CLOSE MODAL
// ========================================

function closeModal() {

    document
        .getElementById(
            "studentModal"
        )
        .classList.remove("show");
}


// ========================================
// RESET FORM
// ========================================

function resetForm() {

    document.getElementById(
        "editId"
    ).value = "";

    document.getElementById(
        "formTitle"
    ).textContent =
        "Add New Student";
}


// ========================================
// UPDATE DASHBOARD
// ========================================

function updateDashboard() {

    // Total Students

    document.getElementById(
        "totalStudents"
    ).textContent =
        students.length;


    // Courses

    const courses =
        new Set(
            students.map(
                student =>
                    student.course
            )
        );

    document.getElementById(
        "totalCourses"
    ).textContent =
        courses.size;


    // Average CGPA

    if (students.length > 0) {

        const totalCGPA =
            students.reduce(
                (total, student) =>
                    total + student.cgpa,
                0
            );


        const averageCGPA =
            totalCGPA /
            students.length;


        document.getElementById(
            "averageCGPA"
        ).textContent =
            averageCGPA.toFixed(2);


    } else {

        document.getElementById(
            "averageCGPA"
        ).textContent =
            "0.00";
    }


    // Average Attendance

    if (students.length > 0) {

        const totalAttendance =
            students.reduce(
                (total, student) =>
                    total + student.attendance,
                0
            );


        const averageAttendance =
            totalAttendance /
            students.length;


        document.getElementById(
            "averageAttendance"
        ).textContent =
            averageAttendance.toFixed(1)
            + "%";


    } else {

        document.getElementById(
            "averageAttendance"
        ).textContent =
            "0%";
    }


    displayRecentStudents();
}


// ========================================
// RECENT STUDENTS
// ========================================

function displayRecentStudents() {

    const container =
        document.getElementById(
            "recentStudents"
        );


    if (students.length === 0) {

        container.innerHTML = `
            <div class="empty">
                No students added yet.
            </div>
        `;

        return;
    }


    const recent =
        [...students]
            .reverse()
            .slice(0, 5);


    container.innerHTML = `

        <table>

            <thead>

                <tr>

                    <th>ID</th>
                    <th>Name</th>
                    <th>Course</th>
                    <th>CGPA</th>
                    <th>Attendance</th>

                </tr>

            </thead>


            <tbody>

                ${recent.map(student => `

                    <tr>

                        <td>
                            ${student.id}
                        </td>

                        <td>
                            <strong>
                                ${student.name}
                            </strong>
                        </td>

                        <td>
                            ${student.course}
                        </td>

                        <td>
                            ${student.cgpa.toFixed(2)}
                        </td>

                        <td>
                            ${student.attendance}%
                        </td>

                    </tr>

                `).join("")}

            </tbody>

        </table>

    `;
}


// ========================================
// INITIALIZE
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateDashboard();

        displayStudents();

    }
);