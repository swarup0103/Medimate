// =====================================
// MEDIMATE DASHBOARD & MEDICINE MANAGEMENT
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // USER NAME
    // =====================================

    const storedName = localStorage.getItem("userName");

    const userNameElement = document.getElementById("userName");
    const welcomeNameElement = document.getElementById("welcomeName");

    if (storedName) {
        if (userNameElement) {
            userNameElement.textContent = storedName;
        }

        if (welcomeNameElement) {
            welcomeNameElement.textContent = storedName;
        }
    }

    // =====================================
    // SIDEBAR NAVIGATION
    // =====================================

    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(function (item) {

        item.addEventListener("click", function () {

            navItems.forEach(function (button) {
                button.classList.remove("active");
            });

            item.classList.add("active");

            const page = item.dataset.page;

            if (page === "dashboard") {
                window.location.href = "Dashboard.html";
                return;
            }

            if (page === "medicines") {
                renderMedicinesPage();
                return;
            }

            alert(
                page.replace(/-/g, " ").replace(/\b\w/g, function (letter) {
                    return letter.toUpperCase();
                }) + " page is not created yet."
            );

        });

    });

    // =====================================
    // BACK TO HOME
    // =====================================

    const backHomeButton = document.getElementById("backHome");

    if (backHomeButton) {
        backHomeButton.addEventListener("click", function () {
            window.location.href = "Index.html";
        });
    }

    // =====================================
    // DASHBOARD VALUES
    // =====================================

    const totalMedicines = document.getElementById("totalMedicines");
    const todayDoses = document.getElementById("todayDoses");
    const nextDose = document.getElementById("nextDose");
    const lowStock = document.getElementById("lowStock");

    if (totalMedicines) {
        totalMedicines.textContent = medicines.length;
    }

    if (todayDoses) {
        todayDoses.textContent = "0";
    }

    if (nextDose) {
        nextDose.textContent = "--:--";
    }

    if (lowStock) {
        lowStock.textContent = medicines.filter(
            medicine => medicine.quantity <= 5
        ).length;
    }

});


// =====================================
// MEDICINE STORAGE
// =====================================

let medicines = [];

try {
    const savedMedicines = JSON.parse(
        localStorage.getItem("mediMateMedicines") || "[]"
    );

    medicines = Array.isArray(savedMedicines) ? savedMedicines : [];

} catch (error) {
    console.error("Unable to load medicines:", error);
    medicines = [];
}


// =====================================
// SAVE MEDICINES
// =====================================

function saveMedicines() {
    localStorage.setItem(
        "mediMateMedicines",
        JSON.stringify(medicines)
    );
}


// =====================================
// RENDER MEDICINES PAGE
// =====================================

function renderMedicinesPage() {

    const main = document.querySelector(".main-content");

    if (!main) {
        console.error("Dashboard .main-content element was not found.");
        alert("Dashboard content area was not found. Check Dashboard.html.");
        return;
    }

    main.innerHTML = `
        <section class="medicines-page">

            <div class="medicines-header">
                <div>
                    <span class="medicines-badge">
                        💊 MEDICATION MANAGER
                    </span>

                    <h1>My Medicines</h1>

                    <p>Add, manage and track your medicines easily.</p>
                </div>

                <button type="button" class="add-medicine-btn">
                    + Add Medicine
                </button>
            </div>

            <div class="medicine-summary">

                <div class="medicine-summary-card">
                    <span>💊</span>

                    <div>
                        <h2 id="medicineCount">0</h2>
                        <p>Total Medicines</p>
                    </div>
                </div>

                <div class="medicine-summary-card">
                    <span>📦</span>

                    <div>
                        <h2 id="medicineStockCount">0</h2>
                        <p>Total Tablets</p>
                    </div>
                </div>

            </div>

            <div class="medicine-form-card"
                 id="medicineFormCard"
                 style="display:none;">

                <h2 id="medicineFormTitle">Add New Medicine</h2>

                <form id="medicineForm">

                    <input type="hidden" id="medicineEditId">

                    <div class="medicine-form-grid">

                        <div class="medicine-input-group">
                            <label for="medicineName">Medicine Name *</label>

                            <input
                                type="text"
                                id="medicineName"
                                placeholder="e.g. Paracetamol"
                                required
                            >
                        </div>

                        <div class="medicine-input-group">
                            <label for="medicineDosage">Dosage *</label>

                            <input
                                type="text"
                                id="medicineDosage"
                                placeholder="e.g. 500 mg"
                                required
                            >
                        </div>

                        <div class="medicine-input-group">
                            <label for="medicineQuantity">Quantity *</label>

                            <input
                                type="number"
                                id="medicineQuantity"
                                placeholder="Number of tablets"
                                min="1"
                                step="1"
                                required
                            >
                        </div>

                        <div class="medicine-input-group">
                            <label for="medicineFrequency">Frequency *</label>

                            <select id="medicineFrequency" required>
                                <option value="">Select frequency</option>
                                <option value="Once daily">Once daily</option>
                                <option value="Twice daily">Twice daily</option>
                                <option value="Three times daily">
                                    Three times daily
                                </option>
                                <option value="As prescribed">
                                    As prescribed
                                </option>
                            </select>
                        </div>

                        <div class="medicine-input-group">
                            <label for="medicineTime">Medicine Time</label>

                            <input type="time" id="medicineTime">
                        </div>

                        <div class="medicine-input-group">
                            <label for="medicineDate">Start Date</label>

                            <input type="date" id="medicineDate">
                        </div>

                    </div>

                    <div class="medicine-form-actions">

                        <button type="submit" class="save-medicine-btn">
                            Save Medicine
                        </button>

                        <button
                            type="button"
                            class="cancel-medicine-btn"
                            id="cancelMedicineButton"
                        >
                            Cancel
                        </button>

                    </div>

                </form>
            </div>

            <div class="medicine-search">
                <input
                    type="search"
                    id="medicineSearch"
                    placeholder="🔍 Search medicine by name..."
                >
            </div>

            <div class="medicine-cards-grid" id="medicineCards"></div>

        </section>
    `;

    initializeMedicinesPage();
}


// =====================================
// OPEN MEDICINE FORM
// =====================================

function openMedicineForm(medicineId = null) {

    const formCard = document.getElementById("medicineFormCard");
    const form = document.getElementById("medicineForm");
    const title = document.getElementById("medicineFormTitle");

    if (!formCard || !form || !title) {
        return;
    }

    form.reset();

    document.getElementById("medicineEditId").value = "";

    if (medicineId !== null) {

        const medicine = medicines.find(
            item => item.id === medicineId
        );

        if (!medicine) {
            return;
        }

        document.getElementById("medicineEditId").value = medicine.id;
        document.getElementById("medicineName").value = medicine.name;
        document.getElementById("medicineDosage").value = medicine.dosage;
        document.getElementById("medicineQuantity").value = medicine.quantity;
        document.getElementById("medicineFrequency").value = medicine.frequency;
        document.getElementById("medicineTime").value = medicine.time || "";
        document.getElementById("medicineDate").value = medicine.date || "";

        title.textContent = "Edit Medicine";

    } else {

        title.textContent = "Add New Medicine";

    }

    formCard.style.display = "block";

    formCard.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// =====================================
// CLOSE MEDICINE FORM
// =====================================

function closeMedicineForm() {

    const formCard = document.getElementById("medicineFormCard");

    if (formCard) {
        formCard.style.display = "none";
    }

}


// =====================================
// INITIALIZE MEDICINES PAGE
// =====================================

function initializeMedicinesPage() {

    const form = document.getElementById("medicineForm");
    const search = document.getElementById("medicineSearch");
    const addButton = document.querySelector(".add-medicine-btn");
    const cancelButton = document.getElementById("cancelMedicineButton");

    if (!form) {
        console.error("Medicine form was not found.");
        return;
    }

    if (addButton) {
        addButton.addEventListener("click", function () {
            openMedicineForm();
        });
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", closeMedicineForm);
    }

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const editId = document.getElementById("medicineEditId").value;

        const name = document.getElementById("medicineName").value.trim();

        const dosage = document.getElementById("medicineDosage").value.trim();

        const quantity = Number(
            document.getElementById("medicineQuantity").value
        );

        const frequency = document.getElementById("medicineFrequency").value;

        const time = document.getElementById("medicineTime").value;

        const date = document.getElementById("medicineDate").value;

        if (
            !name ||
            !dosage ||
            !frequency ||
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {
            alert("Please enter valid medicine details.");
            return;
        }

        const medicineData = {
            name,
            dosage,
            quantity,
            frequency,
            time,
            date
        };

        if (editId) {

            const index = medicines.findIndex(
                item => item.id === Number(editId)
            );

            if (index !== -1) {
                medicines[index] = {
                    ...medicines[index],
                    ...medicineData
                };
            }

        } else {

            medicines.push({
                id: Date.now(),
                ...medicineData
            });

        }

        try {

            saveMedicines();

        } catch (error) {

            console.error("Unable to save medicines:", error);
            alert("Unable to save medicine in browser storage.");
            return;

        }

        renderMedicines();

        form.reset();
        closeMedicineForm();

        alert(
            editId
                ? "Medicine updated successfully!"
                : "Medicine added successfully!"
        );

    });

    if (search) {
        search.addEventListener("input", renderMedicines);
    }

    renderMedicines();

}


// =====================================
// RENDER MEDICINE CARDS
// =====================================

function renderMedicines() {

    const container = document.getElementById("medicineCards");

    if (!container) {
        return;
    }

    const searchTerm = (
        document.getElementById("medicineSearch")?.value || ""
    ).trim().toLowerCase();

    const filteredMedicines = medicines.filter(medicine =>
        String(medicine.name || "").toLowerCase().includes(searchTerm)
    );

    const countElement = document.getElementById("medicineCount");
    const stockElement = document.getElementById("medicineStockCount");

    if (countElement) {
        countElement.textContent = medicines.length;
    }

    if (stockElement) {
        stockElement.textContent = medicines.reduce(
            (total, medicine) => total + Number(medicine.quantity || 0),
            0
        );
    }

    if (filteredMedicines.length === 0) {

        container.innerHTML = `
            <div class="medicine-empty">
                <div>💊</div>

                <h3>
                    ${
                        searchTerm
                            ? "No Matching Medicines"
                            : "No Medicines Added Yet"
                    }
                </h3>

                <p>
                    ${
                        searchTerm
                            ? "Try searching with another medicine name."
                            : "Click Add Medicine to create your first medicine card."
                    }
                </p>
            </div>
        `;

        return;
    }

    container.innerHTML = filteredMedicines.map(medicine => `

        <article class="medicine-card">

            <div class="medicine-card-header">

                <div class="medicine-card-title">

                    <div class="medicine-card-icon">💊</div>

                    <div>
                        <h3>${escapeMedicineText(medicine.name)}</h3>
                        <p>${escapeMedicineText(medicine.dosage)}</p>
                    </div>

                </div>

                <span class="medicine-status">Added</span>

            </div>

            <div class="medicine-card-details">

                <div>
                    <p class="medicine-detail-label">Quantity</p>
                    <p class="medicine-detail-value">
                        ${Number(medicine.quantity)} tablets
                    </p>
                </div>

                <div>
                    <p class="medicine-detail-label">Frequency</p>
                    <p class="medicine-detail-value">
                        ${escapeMedicineText(medicine.frequency)}
                    </p>
                </div>

                <div>
                    <p class="medicine-detail-label">Medicine Time</p>
                    <p class="medicine-detail-value">
                        ${escapeMedicineText(medicine.time || "Not set")}
                    </p>
                </div>

                <div>
                    <p class="medicine-detail-label">Start Date</p>
                    <p class="medicine-detail-value">
                        ${escapeMedicineText(medicine.date || "Not set")}
                    </p>
                </div>

            </div>

            <div class="medicine-card-actions">

                <button
                    type="button"
                    class="medicine-edit-btn"
                    data-edit-id="${medicine.id}"
                >
                    ✏️ Edit
                </button>

                <button
                    type="button"
                    class="medicine-delete-btn"
                    data-delete-id="${medicine.id}"
                >
                    🗑️ Delete
                </button>

            </div>

        </article>

    `).join("");

    container.querySelectorAll("[data-edit-id]").forEach(button => {

        button.addEventListener("click", function () {
            openMedicineForm(Number(this.dataset.editId));
        });

    });

    container.querySelectorAll("[data-delete-id]").forEach(button => {

        button.addEventListener("click", function () {
            deleteMedicine(Number(this.dataset.deleteId));
        });

    });

}


// =====================================
// DELETE MEDICINE
// =====================================

function deleteMedicine(medicineId) {

    const medicine = medicines.find(
        item => item.id === medicineId
    );

    if (!medicine) {
        return;
    }

    const confirmed = confirm(
        `Are you sure you want to delete ${medicine.name}?`
    );

    if (!confirmed) {
        return;
    }

    medicines = medicines.filter(
        item => item.id !== medicineId
    );

    saveMedicines();
    renderMedicines();

}


// =====================================
// ESCAPE HTML TEXT
// =====================================

function escapeMedicineText(value) {

    return String(value ?? "").replace(/[&<>"']/g, function (character) {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];

    });

}

// =====================================
// MEDIMATE USER PROFILE
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    const profileTrigger = document.getElementById("userProfileTrigger");
    const mainContent = document.querySelector(".main-content");

    if (!profileTrigger || !mainContent) {
        console.error("Profile trigger or main content not found.");
        return;
    }

    // Save original dashboard HTML
    const originalDashboardHTML = mainContent.innerHTML;

    let profileLoaded = false;
    let savedProfile = null;
    let isEditing = false;

    // Open Profile
    profileTrigger.addEventListener("click", async function () {
        openProfilePage();
        await loadUserProfile();
    });

    function openProfilePage() {

        // Restore original HTML before finding profile section
        mainContent.innerHTML = originalDashboardHTML;

        const profileSection =
            mainContent.querySelector("#userProfileSection");

        if (!profileSection) {
            alert("Profile section not found in Dashboard.html");
            return;
        }

        // Hide dashboard sections except profile
        Array.from(mainContent.children).forEach(element => {
            element.style.display = "none";
        });

        profileSection.style.display = "block";

        // Attach listeners to the current profile elements
        initializeProfileForm();
    }

    function initializeProfileForm() {

        const form = document.getElementById("userProfileForm");
        const editBtn = document.getElementById("editProfileBtn");
        const saveBtn = document.getElementById("saveProfileBtn");
        const cancelBtn = document.getElementById("cancelProfileBtn");
        const photoInput = document.getElementById("userPhoto");
        const photoPreview = document.getElementById("profilePhotoPreview");

        if (!form) return;

        // Edit button
        editBtn.addEventListener("click", function () {
            setProfileFieldsDisabled(false);

            editBtn.style.display = "none";
            saveBtn.style.display = "inline-block";

            isEditing = true;
        });

        // Photo preview
        photoInput.addEventListener("change", function () {

            const file = this.files[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {
                alert("Please select an image file.");
                this.value = "";
                return;
            }

            // Keep image size manageable for database storage
            if (file.size > 1024 * 1024) {
                alert("Please select an image smaller than 1 MB.");
                this.value = "";
                return;
            }

            const reader = new FileReader();

            reader.onload = function (event) {
                photoPreview.src = event.target.result;
            };

            reader.readAsDataURL(file);
        });

        // Cancel changes
        cancelBtn.addEventListener("click", function () {
            form.reset();

            if (savedProfile) {
                fillProfileForm(savedProfile);
            }

            setProfileFieldsDisabled(true);

            editBtn.style.display = "inline-block";
            saveBtn.style.display = "none";

            showProfileMessage("Changes cancelled.", false);
            isEditing = false;
        });

        // Save Profile
        form.addEventListener("submit", async function (event) {

            event.preventDefault();

            if (!isEditing) return;

            const message = document.getElementById("profileMessage");

            const photo = document.getElementById("profilePhotoPreview");

            const profileData = {
                first_name: document.getElementById("first_name").value.trim(),
                middle_name: document.getElementById("middle_name").value.trim(),
                last_name: document.getElementById("last_name").value.trim(),
                age: document.getElementById("age").value,
                gender: document.getElementById("gender").value,
                blood_group: document.getElementById("blood_group").value,
                mobile_number: document.getElementById("mobile_number").value.trim(),
                address: document.getElementById("address").value.trim(),
                bp: document.getElementById("bp").value,
                diabetes: document.getElementById("diabetes").value,
                heart_disease: document.getElementById("heart_disease").value,
                medicine_allergies: document.getElementById("medicine_allergies").value.trim(),
                other_medical_conditions: document.getElementById("other_medical_conditions").value.trim(),
                family_doctor_name: document.getElementById("family_doctor_name").value.trim(),
                family_doctor_contact: document.getElementById("family_doctor_contact").value.trim(),
                emergency_contact_number: document.getElementById("emergency_contact_number").value.trim(),
                user_photo: photo.src.startsWith("data:image/") ? photo.src : ""
            };

            if (!profileData.first_name ||
                !profileData.last_name ||
                !profileData.age ||
                !profileData.gender ||
                !profileData.mobile_number ||
                !profileData.emergency_contact_number) {

                showProfileMessage("Please fill in all required fields.", true);
                return;
            }

            profileData.age = Number(profileData.age);

            try {
                saveBtn.disabled = true;
                saveBtn.textContent = "Saving...";

                const response = await fetch(
                    "http://127.0.0.1:5000/api/profile",
                    {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(profileData)
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || result.message ||
                        "Unable to save profile.");
                }

                savedProfile = { ...profileData };

                setProfileFieldsDisabled(true);

                editBtn.style.display = "inline-block";
                saveBtn.style.display = "none";

                isEditing = false;

                showProfileMessage(
                    result.message || "Profile saved successfully!",
                    false
                );

                updateDashboardProfilePhoto(profileData.user_photo);

            } catch (error) {
                console.error("Profile save error:", error);

                showProfileMessage(
                    error.message || "Server connection failed.",
                    true
                );

            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = "Save Profile";
            }
        });
    }

    // Load profile from Flask
    async function loadUserProfile() {

        const editBtn = document.getElementById("editProfileBtn");
        const saveBtn = document.getElementById("saveProfileBtn");

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/api/profile",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const result = await response.json();

            if (response.status === 404) {
                savedProfile = null;
                setProfileFieldsDisabled(false);

                editBtn.style.display = "none";
                saveBtn.style.display = "inline-block";

                isEditing = true;

                showProfileMessage(
                    "Complete your profile and click Save Profile.",
                    false
                );

                return;
            }

            if (!response.ok) {
                throw new Error(result.error || result.message ||
                    "Unable to load profile.");
            }

            savedProfile = result.profile || null;

            if (savedProfile) {
                fillProfileForm(savedProfile);
                setProfileFieldsDisabled(true);

                editBtn.style.display = "inline-block";
                saveBtn.style.display = "none";

                isEditing = false;

                if (savedProfile.user_photo) {
                    updateDashboardProfilePhoto(savedProfile.user_photo);
                }
            }

        } catch (error) {
            console.error("Profile load error:", error);

            showProfileMessage(
                "Could not load profile. Check Flask server and login session.",
                true
            );
        }
    }

    // Fill the form
    function fillProfileForm(profile) {

        Object.keys(profile).forEach(key => {

            const field = document.getElementById(key);

            if (field && key !== "user_photo") {
                field.value = profile[key] ?? "";
            }
        });

        const photoPreview =
            document.getElementById("profilePhotoPreview");

        if (photoPreview && profile.user_photo) {
            photoPreview.src = profile.user_photo;
        }
    }

    // Enable/disable form fields
    function setProfileFieldsDisabled(disabled) {

        const form = document.getElementById("userProfileForm");

        if (!form) return;

        form.querySelectorAll("input, select, textarea")
            .forEach(field => {
                field.disabled = disabled;
            });
    }

    // Show success/error message
    function showProfileMessage(message, isError) {

        const element = document.getElementById("profileMessage");

        if (!element) return;

        element.textContent = message;
        element.style.color = isError ? "#d92d20" : "#16865d";
    }

    // Update dashboard avatar
    function updateDashboardProfilePhoto(photoData) {

        if (!photoData) return;

        const avatar = document.querySelector(".profile-avatar");

        if (!avatar) return;

        avatar.innerHTML = "";

        const image = document.createElement("img");

        image.src = photoData;
        image.alt = "Profile Photo";

        image.style.width = "100%";
        image.style.height = "100%";
        image.style.objectFit = "cover";
        image.style.borderRadius = "50%";

        avatar.appendChild(image);
    }

});
