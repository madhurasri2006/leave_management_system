
const API_URL = 'https://leave-management-system-mh1o.onrender.com';

const token = localStorage.getItem('token');

if (!token || localStorage.getItem('role') !== 'employee') {
    window.location.href = 'employee-login.html';
}

const leaveForm = document.getElementById('leaveForm');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');

const myLeaveList = document.getElementById('myLeaveList');

function getToday() {
    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function setMinimumDates() {
    startDateInput.min = getToday();
    endDateInput.min = startDateInput.value || getToday();
}

startDateInput.addEventListener('change', () => {
    endDateInput.min = startDateInput.value || getToday();
});

setMinimumDates();

// Load only the logged-in employee's leave applications
async function loadMyLeaves() {
    try {
        const response = await fetch(`${API_URL}/api/leaves/my-leaves`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const leaves = await response.json();

        if (!response.ok) {
            throw new Error(leaves.message || 'Could not load your applications');
        }

        document.getElementById('totalMyLeaves').textContent = leaves.length;

        document.getElementById('pendingMyLeaves').textContent =
            leaves.filter(leave => leave.status === 'Pending').length;

        document.getElementById('approvedMyLeaves').textContent =
            leaves.filter(leave => leave.status === 'Approved').length;

        document.getElementById('rejectedMyLeaves').textContent =
            leaves.filter(leave => leave.status === 'Rejected').length;

        myLeaveList.replaceChildren();

        if (leaves.length === 0) {
            myLeaveList.textContent = 'You have not applied for any leave yet.';
            return;
        }

        leaves.forEach((leave) => {
            const card = document.createElement('div');
            card.className = 'leave-card';

            const heading = document.createElement('h3');
            heading.textContent = leave.leaveType;

            const dates = document.createElement('p');
            dates.textContent = `From: ${leave.startDate} | To: ${leave.endDate}`;

            const reason = document.createElement('p');
            reason.textContent = `Reason: ${leave.reason}`;

            const status = document.createElement('p');
            status.textContent = `Status: ${leave.status}`;

            const message = document.createElement('p');

            if (leave.status === 'Approved') {
                message.textContent = 'Your leave application has been approved.';
            } else if (leave.status === 'Rejected') {
                message.textContent = 'Your leave application has been rejected.';
            } else {
                message.textContent = 'Your leave application is waiting for admin approval.';
            }

            card.append(heading, dates, reason, status, message);

            myLeaveList.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        myLeaveList.textContent = error.message;
    }
}

// Submit leave application
leaveForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (endDateInput.value < startDateInput.value) {
        alert('End date cannot be before start date.');
        return;
    }

    const data = {
        leaveType: document.getElementById('leaveType').value,
        startDate: startDateInput.value,
        endDate: endDateInput.value,
        reason: document.getElementById('reason').value.trim()
    };

    try {
        const response = await fetch(`${API_URL}/api/leaves`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Unable to submit application');
        }

        alert('Leave application submitted successfully!');

        leaveForm.reset();
        setMinimumDates();

        await loadMyLeaves();

    } catch (error) {
        alert(error.message);
    }
});

// Load applications when dashboard opens
loadMyLeaves();
