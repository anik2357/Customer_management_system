
const API_URL =
    "https://customer-management-system-1-7ser.onrender.com";

// HTML elements
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

// Show message
function showMessage(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? "red" : "green";
}

// API request handler
async function apiRequest(url, options = {}) {
    let response;

    try {
        response = await fetch(url, options);
    } catch (error) {
        throw new Error(
            "Cannot connect to Render API. Check server status and CORS settings."
        );
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const detail = data?.detail;

        const errorMessage = Array.isArray(detail)
            ? detail.map(item => item.msg).join(", ")
            : detail || `Request failed (${response.status})`;

        throw new Error(errorMessage);
    }

    return data;
}

// Load all customers from Render
async function loadCustomers() {
    table.replaceChildren();

    const loadingRow = table.insertRow();
    const loadingCell = loadingRow.insertCell();
    loadingCell.colSpan = 7;
    loadingCell.textContent = "Loading customers from Render...";

    try {
        const customers = await apiRequest(API_URL);

        if (!Array.isArray(customers)) {
            throw new Error("API response is not a customer list.");
        }

        table.replaceChildren();

        if (customers.length === 0) {
            const row = table.insertRow();
            const cell = row.insertCell();

            cell.colSpan = 7;
            cell.textContent = "No customers found.";
            showMessage("API connected, but no customers were returned.");

            return;
        }

        customers.forEach(customer => {
            const row = table.insertRow();

            const values = [
                customer.id,
                customer.name,
                customer.email,
                customer.phone,
                customer.address || "",
                customer.is_active ? "Active" : "Inactive"
            ];

            values.forEach(value => {
                const cell = row.insertCell();
                cell.textContent = value ?? "";
            });

            const actionCell = row.insertCell();

            const editBtn = document.createElement("button");
            editBtn.type = "button";
            editBtn.textContent = "Edit";

            editBtn.addEventListener("click", () => {
                editCustomer(customer.id);
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.textContent = "Delete";

            deleteBtn.addEventListener("click", () => {
                deleteCustomer(customer.id);
            });

            actionCell.append(editBtn, deleteBtn);
        });

        showMessage(`Loaded ${customers.length} customer(s).`);

    } catch (error) {
        table.replaceChildren();

        const row = table.insertRow();
        const cell = row.insertCell();

        cell.colSpan = 7;
        cell.textContent = "Unable to load customers.";

        showMessage(error.message, true);
        console.error("Load customers error:", error);
    }
}

// Add or update customer
form.addEventListener("submit", async event => {
    event.preventDefault();

    const id = customerId.value.trim();
    const isEditing = Boolean(id);

    const customerData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        address: addressInput.value.trim() || null,
        is_active: activeInput.value === "true"
    };

    if (
        !customerData.name ||
        !customerData.email ||
        !customerData.phone
    ) {
        showMessage("Name, email and phone are required.", true);
        return;
    }

    const url = isEditing
        ? `${API_URL}${encodeURIComponent(id)}`
        : API_URL;

    saveBtn.disabled = true;

    try {
        await apiRequest(url, {
            method: isEditing ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(customerData)
        });

        showMessage(
            isEditing
                ? "Customer updated successfully!"
                : "Customer added successfully!"
        );

        resetForm();
        await loadCustomers();

    } catch (error) {
        showMessage(error.message, true);
        console.error("Save customer error:", error);
    } finally {
        saveBtn.disabled = false;
    }
});

// Load customer details into form
async function editCustomer(id) {
    try {
        const customer = await apiRequest(
            `${API_URL}${encodeURIComponent(id)}`
        );

        customerId.value = customer.id;
        nameInput.value = customer.name ?? "";
        emailInput.value = customer.email ?? "";
        phoneInput.value = customer.phone ?? "";
        addressInput.value = customer.address ?? "";
        activeInput.value = String(customer.is_active);

        saveBtn.textContent = "Update Customer";
        cancelBtn.hidden = false;

        showMessage(`Editing customer #${customer.id}`);

        form.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } catch (error) {
        showMessage(error.message, true);
        console.error("Edit customer error:", error);
    }
}

// Delete customer
async function deleteCustomer(id) {
    if (!confirm("Are you sure you want to delete this customer?")) {
        return;
    }

    try {
        await apiRequest(
            `${API_URL}${encodeURIComponent(id)}`,
            { method: "DELETE" }
        );

        if (customerId.value === String(id)) {
            resetForm();
        }

        showMessage("Customer deleted successfully!");
        await loadCustomers();

    } catch (error) {
        showMessage(error.message, true);
        console.error("Delete customer error:", error);
    }
}

// Reset form
function resetForm() {
    form.reset();

    customerId.value = "";
    activeInput.value = "true";

    saveBtn.textContent = "Add Customer";
    cancelBtn.hidden = true;
}

// Cancel editing
cancelBtn.addEventListener("click", () => {
    resetForm();
    showMessage("Edit cancelled.");
});

// Reload customer list
const refreshBtn = document.getElementById("refreshBtn");

if (refreshBtn) {
    refreshBtn.addEventListener("click", loadCustomers);
}

// Start application
loadCustomers();
