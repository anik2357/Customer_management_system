const API_URL = "http://127.0.0.1:8000/customers/";

const form = document.getElementById("customerForm");
const customerId = document.getElementById("customerId");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const activeInput = document.getElementById("is_active");
const table = document.getElementById("customerTable");
const message = document.getElementById("message");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

function showMessage(text) {
    message.textContent = text;
}

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;",
        '"': "&quot;", "'": "&#39;"
    })[char]);
}

async function apiRequest(url, options = {}) {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const detail = data.detail;
        const errorMessage = Array.isArray(detail)
            ? detail.map(item => item.msg).join(", ")
            : detail || "Request failed";
        throw new Error(errorMessage);
    }
    return data;
}

async function loadCustomers() {
    table.innerHTML = '<tr><td colspan="7">Loading customers...</td></tr>';

    try {
        const customers = await apiRequest(API_URL);
        table.innerHTML = "";

        if (!customers.length) {
            table.innerHTML = '<tr><td colspan="7">No customers found.</td></tr>';
            return;
        }

        customers.forEach(customer => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${customer.id}</td>
                <td>${escapeHtml(customer.name)}</td>
                <td>${escapeHtml(customer.email)}</td>
                <td>${escapeHtml(customer.phone)}</td>
                <td>${escapeHtml(customer.address)}</td>
                <td>${customer.is_active ? "Active" : "Inactive"}</td>
                <td>
                    <button type="button" class="edit-btn"
                        data-action="edit" data-id="${customer.id}">Edit</button>
                    <button type="button" class="delete-btn"
                        data-action="delete" data-id="${customer.id}">Delete</button>
                </td>`;
            table.appendChild(row);
        });
    } catch (error) {
        table.innerHTML = '<tr><td colspan="7">Unable to load customers.</td></tr>';
        showMessage(error.message);
    }
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    const id = customerId.value;
    const isEditing = Boolean(id);
    const customer = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        address: addressInput.value.trim() || null,
        is_active: activeInput.value === "true"
    };

    if (!customer.name || !customer.email || !customer.phone) {
        showMessage("Please fill in all required fields.");
        return;
    }

    saveBtn.disabled = true;
    try {
        await apiRequest(isEditing ? `${API_URL}${id}` : API_URL, {
            method: isEditing ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customer)
        });
        showMessage(isEditing ? "Customer updated successfully!" : "Customer added successfully!");
        resetForm();
        await loadCustomers();
    } catch (error) {
        showMessage(error.message);
    } finally {
        saveBtn.disabled = false;
    }
});

async function editCustomer(id) {
    try {
        const customer = await apiRequest(`${API_URL}${id}`);
        customerId.value = customer.id;
        nameInput.value = customer.name;
        emailInput.value = customer.email;
        phoneInput.value = customer.phone;
        addressInput.value = customer.address || "";
        activeInput.value = String(customer.is_active);
        saveBtn.textContent = "Update Customer";
        cancelBtn.hidden = false;
        showMessage(`Editing customer #${customer.id}`);
        form.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
        showMessage(error.message);
    }
}

async function deleteCustomer(id) {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
        await apiRequest(`${API_URL}${id}`, { method: "DELETE" });
        if (customerId.value === String(id)) resetForm();
        showMessage("Customer deleted successfully!");
        await loadCustomers();
    } catch (error) {
        showMessage(error.message);
    }
}

table.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = Number(button.dataset.id);
    if (!Number.isInteger(id) || id <= 0) return;

    if (button.dataset.action === "edit") editCustomer(id);
    if (button.dataset.action === "delete") deleteCustomer(id);
});

function resetForm() {
    form.reset();
    customerId.value = "";
    activeInput.value = "true";
    saveBtn.textContent = "Add Customer";
    cancelBtn.hidden = true;
}

cancelBtn.addEventListener("click", () => {
    resetForm();
    showMessage("Edit cancelled.");
});

loadCustomers();
