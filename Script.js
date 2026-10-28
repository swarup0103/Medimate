function ShowPage(pagename) {

    const main = document.getElementById("main");
    if (pagename === "dashboard") {
    main.innerHTML = `

        <section class="dashboard">

            <div class="dashboard-layout">

                <!-- LEFT SIDEBAR -->
                <aside class="quick-sidebar">

                    <div class="sidebar-header">

                        <div class="sidebar-logo">💚</div>

                        <div>
                            <h2>MediMate</h2>
                            <p>Quick Navigation</p>
                        </div>

                    </div>

                    <div class="sidebar-section-title">
                        MAIN MENU
                    </div>

                    <button
                        type="button"
                        class="sidebar-button active"
                        onclick="ShowPage('dashboard')">

                        <span class="sidebar-button-icon">🏠</span>
                        <span>Dashboard</span>

                    </button>

                    <button
                        type="button"
                        class="sidebar-button"
                        onclick="ShowPage('medicines')">

                        <span class="sidebar-button-icon">💊</span>
                        <span>My Medicines</span>

                    </button>

                    <button
                        type="button"
                        class="sidebar-button"
                        onclick="ShowPage('schedule')">

                        <span class="sidebar-button-icon">⏰</span>
                        <span>Medicine Schedule</span>

                    </button>

                    <button
                        type="button"
                        class="sidebar-button"
                        onclick="ShowPage('stock')">

                        <span class="sidebar-button-icon">📦</span>
                        <span>Medicine Stock</span>

                    </button>

                    <div class="sidebar-section-title">
                        MANAGEMENT
                    </div>

                    <button
                        type="button"
                        class="sidebar-button"
                        onclick="ShowPage('history')">

                        <span class="sidebar-button-icon">📋</span>
                        <span>Medicine History</span>

                    </button>

                    <button
                        type="button"
                        class="sidebar-button"
                        onclick="ShowPage('caretakers')">

                        <span class="sidebar-button-icon">👨‍👩‍👧</span>
                        <span>Caretakers</span>

                    </button>

                    <button
                        type="button"
                        class="sidebar-button"
                        onclick="ShowPage('reports')">

                        <span class="sidebar-button-icon">📊</span>
                        <span>Reports</span>

                    </button>

                    <!-- HEALTH TIP -->
                    <div class="sidebar-help-card">

                        <div class="help-icon">💡</div>

                        <h3>Stay Healthy!</h3>

                        <p>
                            Never miss your prescribed medicine.
                            Follow your daily schedule.
                        </p>

                    </div>

                    <!-- BACK TO HOME -->
                    <button
                        type="button"
                        class="sidebar-logout"
                        onclick="ShowPage('home')">

                        <span>↩</span>
                        Back to Home

                    </button>

                </aside>


                <!-- RIGHT MAIN DASHBOARD -->
                <main class="dashboard-main">

                    <!-- WELCOME SECTION -->
                    <div class="dashboard-welcome">

                        <div>
                            <p class="welcome-label">
                                MEDIMATE DASHBOARD
                            </p>

                            <h1>Welcome to MediMate! 💚</h1>

                            <p>
                                Manage your medicines, track your doses,
                                and stay healthy every day.
                            </p>
                        </div>

                        <div class="welcome-icon">
                            💊
                        </div>

                    </div>


                    <!-- SUMMARY CARDS -->
                    <div class="dashboard-cards">

                        <div class="dashboard-card medicine-card">

                            <div class="card-top">

                                <div class="card-icon">💊</div>

                                <span class="card-label">
                                    MEDICINES
                                </span>

                            </div>

                            <h2 id="totalMedicines">0</h2>

                            <p>Total Medicines</p>

                        </div>


                        <div class="dashboard-card doses-card">

                            <div class="card-top">

                                <div class="card-icon">⏰</div>

                                <span class="card-label">
                                    TODAY
                                </span>

                            </div>

                            <h2 id="todayDoses">0</h2>

                            <p>Today's Doses</p>

                        </div>


                        <div class="dashboard-card next-dose-card">

                            <div class="card-top">

                                <div class="card-icon">🔔</div>

                                <span class="card-label">
                                    UPCOMING
                                </span>

                            </div>

                            <h2 id="nextDose">--:--</h2>

                            <p>Next Dose</p>

                        </div>


                        <div class="dashboard-card stock-card">

                            <div class="card-top">

                                <div class="card-icon">📦</div>

                                <span class="card-label">
                                    STOCK
                                </span>

                            </div>

                            <h2 id="lowStock">0</h2>

                            <p>Low Stock Medicines</p>

                        </div>

                    </div>


                    <!-- DASHBOARD CONTENT -->
                    <div class="dashboard-content">

                        <!-- TODAY'S SCHEDULE -->
                        <div class="dashboard-panel">

                            <div class="panel-heading">

                                <div>
                                    <h2>
                                        Today's Medicine Schedule
                                    </h2>

                                    <p>
                                        Your daily medicine routine
                                    </p>
                                </div>

                                <span class="panel-heading-icon">
                                    📅
                                </span>

                            </div>

                            <div
                                id="dashboardSchedule"
                                class="dashboard-list">

                                <div class="empty-state">

                                    <span>💊</span>

                                    <h3>No Schedule Available</h3>

                                    <p>
                                        Your medicine schedule will
                                        appear here.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <!-- MEDICINE STOCK -->
                        <div class="dashboard-panel">

                            <div class="panel-heading">

                                <div>
                                    <h2>Medicine Stock</h2>

                                    <p>
                                        Keep track of your medicine supply
                                    </p>
                                </div>

                                <span class="panel-heading-icon">
                                    📦
                                </span>

                            </div>

                            <div
                                id="dashboardStock"
                                class="dashboard-list">

                                <div class="empty-state">

                                    <span>📋</span>

                                    <h3>No Stock Information</h3>

                                    <p>
                                        Your medicine stock details
                                        will appear here.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <!-- RECENT ACTIVITY -->
                        <div class="dashboard-panel">

                            <div class="panel-heading">

                                <div>
                                    <h2>Recent Activity</h2>

                                    <p>
                                        Your latest medicine activities
                                    </p>
                                </div>

                                <span class="panel-heading-icon">
                                    📈
                                </span>

                            </div>

                            <div
                                id="dashboardActivity"
                                class="dashboard-list">

                                <div class="empty-state">

                                    <span>📝</span>

                                    <h3>No Recent Activity</h3>

                                    <p>
                                        Your recent activities will
                                        appear here.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <!-- HEALTH TIP -->
                        <div class="health-tip-card">

                            <div class="health-tip-icon">
                                🌿
                            </div>

                            <div>
                                <h3>Today's Health Tip</h3>

                                <p>
                                    Take your medicines at the prescribed
                                    time and follow your doctor's
                                    instructions.
                                </p>
                            </div>

                        </div>

                    </div>


                    <!-- FOOTER -->
                    <footer class="dashboard-footer">

                        <p>
                            © 2026 MediMate |
                            Your Health, Our Priority 💚
                        </p>

                    </footer>

                </main>

            </div>

        </section>

    `;

    return;
}

    if (pagename == "home") {

        main.innerHTML = `
        
        <section class="hero">

                <h1>
                    Welcome to <span>MediMate</span>
                </h1>

                <h2>
                    Your Health, Our Priority
                </h2>

                <p>
                    MediMate is a smart healthcare assistance system designed 
                    to help patients stay connected, informed, and safe. It
                     combines health monitoring, emergency assistance, and
                      smart communication to provide timely support when it 
                      is needed most. The system is designed with a simple 
                      and user-friendly approach, making it easy for patients, 
                      elderly people, and their families to stay informed about 
                      important health conditions. MediMate aims to make healthcare
                       assistance more accessible, reliable, and responsive through 
                       the use of modern technology.

                </p>
            </div>

            <div class="hero-image">

                <img src="MEDICAL BODY.png"
                     alt="Medical Body" id="heroImage">

            </div>

        </section>


        <section class="home-features">

            <h2>Why Choose MediMate?</h2>

            <p class="section-text">
                Simple, smart and reliable healthcare assistance.
            </p>

            <div class="feature-cards">

                <div class="card">
                    <div class="card-img">
                        <img src="monitoring2.png" alt="Monitoring">
                    </div>
                    <h3>Health Monitoring</h3>
                    <p>
                        Monitor important health information
                        and stay aware of your condition.
                    </p>
                </div>

                <div class="card">
                    <div class="card-img">
                        <img src="smart alert.png" alt="Monitoring">
                    </div>
                    <h3>Missed Medicine Alert</h3>
                    <p>
                        Quickly notify your family or
                        emergency contacts when help is needed.
                    </p>
                </div>


                <div class="card">
                <div class="card-img-m">
                        <img src="medicine.png" alt="Monitoring">
                    </div>

                    <h3>Medication Reminder</h3>

                    <p>
                        Get timely reminders for medicines and
                        maintain your medication schedule easily.
                    </p>

                </div>

                <div class="card">
                    <div class="card-img-c">
                        <img src="smart connectivity.png" alt="Monitoring">
                    </div>
                    <h3>Smart Connectivity</h3>
                    <p>
                        Stay connected through modern
                        communication technologies.
                    </p>
                </div>

            </div>

        </section>
        
        `;
    }

    else if (pagename == "featuers") {

        main.innerHTML = `

        <section class="page-section">

            <h1>Smart Features</h1>

            <p class="section-text">
                MediMate combines healthcare monitoring,
                communication and emergency assistance
                into one smart system.
            </p>

            <div class="feature-grid">

                <div class="feature-box">
                    <div class="feature-img">
                        <img src="Medicine2.png" alt="Monitoring">
                    </div>

                    <div class="feature-card">
                        <h3>Remaining Medicine Track</h3>

                        <ul>
                            <li>Track the remaining tablets.</li>
                            <li>Calculate the remaining doses.</li>
                            <li>Update stock after each dose.</li>
                            <li>Get a low-stock alert.</li>
                            <li>Receive a refill reminder.</li>
                        </ul>                        
                    </div>

                </div>

                <div class="feature-box">
                    <div class="feature-img">
                        <img src="Notification Alert.png" alt="Monitoring">
                    </div>

                    <div class="feature-card">
                        <h3>Medicine History</h3>

                        <ul>
                            <li>Store medicine name and dosage.</li>
                            <li>Record date and time.</li>
                            <li>Track taken and missed doses.</li>
                            <li>Maintain complete medication history.</li>
                            <li>View previous medicine records.</li>
                        </ul>
                    </div>

                </div>

                <div class="feature-box">
                    <div class="feature-img">
                        <img src="Medicine Shedual.png" alt="Monitoring">
                    </div>

                    <div class="feature-card">
                        <h3>Missed Medicine Alert</h3>

                        <ul>
                            <li>Detect missed scheduled doses.</li>
                            <li>Send a reminder to the patient.</li>
                            <li>Wait for a predefined time.</li>
                            <li>Alert the caretaker if the dose is still missed.</li>
                            <li>Send a priority alert for repeated missed doses.</li>
                        </ul>
                    </div>

                </div>

                <div class="feature-box">
                    <div class="feature-img">
                        <img src="Dashboard.png" alt="Monitoring">
                    </div>

                    <div class="feature-card">
                        <h3>Smart Medicine Schedule</h3>

                        <ul>
                            <li>Set morning, afternoon, and night schedules.</li>
                            <li>Add medicine name and dosage.</li>
                            <li>Set specific medicine timings.</li>
                            <li>Add before/after food instructions.</li>
                            <li>Provide automatic reminders.</li>
                        </ul>
                    </div>

                </div>

                <div class="feature-box">
                    <div class="feature-img">
                        <img src="Medical Clipboard.png" id="Clipboard">
                    </div>

                    <div class="feature-card" id="heading">
                        <h3>Medicine Adherence</h3>

                        <ul id="pad">
                            <li>Track the remaining tablets.</li>
                            <li>Calculate the remaining doses.</li>
                            <li>Update stock after each dose.</li>
                            <li>Get a low-stock alert.</li>
                            <li>Receive a refill reminder.</li>
                        </ul>
                    </div>

                </div>
            </div>

        </section>

        `;
    }

    else if (pagename == "faq") {

        main.innerHTML = `

        <section class="page-section faq-section">


            <h1>Frequently Asked Questions</h1>

            <p class="section-text">
                Find answers to commonly asked questions
                about MediMate.
            </p>


            <div class="faq-container">

                <details>
                    <summary>
                        What is MediMate?
                    </summary>

                    <p>
                        MediMate is a smart healthcare assistance
                        system designed to help users monitor
                        health information and receive emergency
                        assistance.
                    </p>
                </details>


                <details>
                    <summary>
                        Who can use MediMate?
                    </summary>

                    <p>
                        MediMate can be useful for patients,
                        elderly people, families and anyone who
                        needs quick access to healthcare assistance.
                    </p>
                </details>


                <details>
                    <summary>
                        Can MediMate send emergency alerts?
                    </summary>

                    <p>
                        Yes. The system can be designed to send
                        emergency notifications to predefined
                        contacts.
                    </p>
                </details>


                <details>
                    <summary>
                        Does MediMate require internet?
                    </summary>

                    <p>
                        Depending on the communication method,
                        MediMate can use internet connectivity
                        or cellular communication.
                    </p>
                </details>


                <details>
                    <summary>
                        Is MediMate mobile friendly?
                    </summary>

                    <p>
                        Yes. The website interface is designed
                        to work on mobile, tablet and desktop
                        devices.
                    </p>
                </details>

            </div>

        </section>

        `;
    }

    else if (pagename == "about") {

        main.innerHTML = `

        <section class="page-section about-section">


            <h1>About MediMate</h1>

            <p class="about-intro">
                MediMate is a technology-based healthcare
                assistance platform developed to make
                healthcare monitoring easier, smarter and
                more accessible.
            </p>

            <div class="about-grid">

                <div class="about-card">

                    <div class="about-icon">🎯</div>

                    <h2>Our Mission</h2>

                    <p>
                        Our mission is to use technology to
                        provide simple and effective healthcare
                        assistance whenever it is needed.
                    </p>

                </div>


                <div class="about-card">

                    <div class="about-icon">💡</div>

                    <h2>Our Vision</h2>

                    <p>
                        We aim to create a connected healthcare
                        environment where technology can help
                        people respond faster during important
                        situations.
                    </p>

                </div>


                <div class="about-card">

                    <div class="about-icon">🤝</div>

                    <h2>Our Goal</h2>

                    <p>
                        To build an affordable, reliable and
                        user-friendly healthcare assistance
                        system.
                    </p>

                </div>

            </div>


            <div class="about-highlight">

                <h2>Why MediMate?</h2>

                <p>
                    Healthcare should be simple, accessible
                    and connected. MediMate brings multiple
                    assistance features together in one platform.
                </p>

            </div>

        </section>

        `;
    }

    else if (pagename == "login") {

        main.innerHTML = `

        <section class="auth-section">

            <div class="auth-card">

                <div class="auth-icon">
                    <img src="Logo.png" alt="Login Icon">
                </div>

                <h1>Welcome Back</h1>

                <p>
                    Login to your MediMate account
                </p>


                <form onsubmit="loginUser(event)">

                    <div class="input-group">

                        <label>Email</label>

                        <input
                            type="email"
                            id="loginEmail"
                            placeholder="Enter your email"
                            required
                        >

                    </div>


                    <div class="input-group">

                        <label>Password</label>

                        <input
                            type="password"
                            id="loginPassword"
                            placeholder="Enter your password"
                            required
                        >

                    </div>


                    <button type="submit" class="auth-btn">
                        Login
                    </button>

                </form>


                <p class="auth-bottom">
                    Don't have an account?

                    <span onclick="ShowPage('register')">
                        Register
                    </span>
                </p>

            </div>

        </section>

        `;
    }

    else if (pagename == "register") {

        main.innerHTML = `

        <section class="auth-section">

            <div class="auth-card2">

                <div class="auth-icon">
                    <img src="Logo.png" alt="Login Icon">
                </div>

                <h1>Create Account</h1>

                <p>
                    Join MediMate today
                </p>


                <form onsubmit="registerUser(event)">

                    <div class="input-group">

                        <label>Full Name</label>

                        <input
                            type="text"
                            id="registerName"
                            placeholder="Enter your name"
                            required
                        >

                    </div>

                    <div class="input-group">

                        <label>Date Of Birth</label>

                        <input
                            type="date"
                            id="registerDOB"
                            placeholder="Select Date Using Calender"
                            required
                        >

                    </div>

                    <div class="input-group">

                        <label>Contact Number</label>

                        <input
                            type="tel"
                            id="registerPhone"
                            placeholder="+91-1542638975"
                            required
                        >

                    </div>

                    <div class="input-group">

                        <label>Email</label>

                        <input
                            type="email"
                            id="registerEmail"
                            placeholder="Enter your email"
                            required
                        >

                    </div>


                    <div class="input-group">

                        <label>Password</label>

                        <input
                            type="password"
                            id="registerPassword"
                            placeholder="Create password"
                            required
                        >

                    </div>


                    <div class="input-group">

                        <label>Confirm Password</label>

                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm password"
                            required
                        >

                    </div>


                    <button type="submit" class="auth-btn">
                        Create Account
                    </button>

                </form>


                <p class="auth-bottom">

                    Already have an account?

                    <span onclick="ShowPage('login')">
                        Login
                    </span>

                </p>

            </div>

        </section>

        `;
    }
}

async function registerUser(event) {

    event.preventDefault();

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const phone =
        document.getElementById("registerPhone").value.trim();

    const DOB =
        document.getElementById("registerDOB").value;

    const password =
        document.getElementById("registerPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // Check empty fields
    if (!name || !email || !phone || !DOB || !password || !confirmPassword) {
        alert("Please fill in all fields!");
        return;
    }


    // Check password
    if (password !== confirmPassword) {

        alert("Passwords do not match ❌");

        return;
    }


    // Send data to Flask
    try {

        const response = await fetch("http://127.0.0.1:5000/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                full_name: name,
                DOB: DOB,
                phone: phone,
                email: email,
                password: password
            })

        });


        const result = await response.json();


        if (!response.ok) {

            alert(result.message || "Registration failed!");
            return;

        }


        alert(
            "Registration successful! \nWelcome " + name
        );

        console.log("Name:", name);
        console.log("Email:", email);
        console.log("Server:", result);

        // Reset form after successful registration
        event.target.reset();

    }

    catch (error) {

        console.error("Registration error:", error);

        alert("Server connection failed! Please check Flask.");

    }

}
async function loginUser(event) {

    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();

    const password = document.getElementById("loginPassword").value;

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || "Login failed!");
            return;
        }

        // Get logged-in user's name
        const fullName = result.user?.full_name || "User";

        // Save user's name for Dashboard
        localStorage.setItem("userName", fullName);

        // Show success message
        alert("Welcome " + fullName + "!");

        // Clear login form
        event.target.reset();

        // Open separate Dashboard HTML page
        window.location.href = "Dashboard.html";

    } catch (error) {

        console.error("Login Error:", error);

        alert("Server connection failed!");

    }
}
