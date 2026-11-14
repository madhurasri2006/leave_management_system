
const API_URL = 'https://leave-management-system-mh1o.onrender.com';

const token = localStorage.getItem('token');

if (!token || localStorage.getItem('role') !== 'admin') {
    window.location.href = 'admin-login.html';
}

const leaveList = document.getElementById('leaveList');

// Get today's date in YYYY-MM-DD format
function getToday() {
    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// Update dashboard summary
function updateSummary(leaves) {
    const totalApplied = leaves.length;

    const accepted = leaves.filter(
        leave => leave.status === 'Approved'
    ).length;

    const rejected = leaves.filter(
        leave => leave.status === 'Rejected'
    ).length;

    const today = getToday();

    const employeesOnLeave = new Set(
        leaves
            .filter(leave =>
                leave.status === 'Approved' &&
                leave.startDate <= today &&
                leave.endDate >= today
            )
            .map(leave => leave.email)
    );

    document.getElementById('totalApplied').textContent = totalApplied;
    document.getElementById('totalAccepted').textContent = accepted;
    document.getElementById('totalRejected').textContent = rejected;
    document.getElementById('onLeaveToday').textContent = employeesOnLeave.size;
}

// Load all leave applications
async function loadLeaves() {
    try {
        const response = await fetch(`${API_URL}/api/leaves`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const leaves = await response.json();

        if (!response.ok) {
            throw new Error(leaves.message || 'Could not load leave applications');
        }

        updateSummary(leaves);

        leaveList.replaceChildren();

        if (leaves.length === 0) {
            leaveList.textContent = 'No leave applications yet.';
            return;
        }

        leaves.forEach((leave) => {
            const card = document.createElement('div');
            card.className = 'leave-card';

            const heading = document.createElement('h3');
            heading.textContent = leave.name;

            const email = document.createElement('p');
            email.textContent = `Email: ${leave.email}`;

            const details = document.createElement('p');
            details.textContent = `Type: ${leave.leaveType} | From: ${leave.startDate} | To: ${leave.endDate}`;

            const reason = document.createElement('p');
            reason.textContent = `Reason: ${leave.reason}`;

            const status = document.createElement('p');
            status.textContent = `Status: ${leave.status}`;

            card.append(heading, email, details, reason, status);

            if (leave.status === 'Pending') {
                const approve = document.createElement('button');
                approve.textContent = 'Approve';

                approve.addEventListener('click', () => {
                    updateLeaveStatus(leave._id, 'Approved');
                });

                const reject = document.createElement('button');
                reject.textContent = 'Reject';

                reject.addEventListener('click', () => {
                    updateLeaveStatus(leave._id, 'Rejected');
                });

                card.append(approve, reject);
            }

            leaveList.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        leaveList.textContent = error.message;
    }
}

// Approve or reject leave application
async function updateLeaveStatus(id, status) {
    try {
        const response = await fetch(`${API_URL}/api/leaves/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Unable to update status');
        }

        alert(`Leave status updated to ${status}`);

        await loadLeaves();

    } catch (error) {
        alert(error.message);
    }
}

// Load dashboard data
loadLeaves();
