document.addEventListener("DOMContentLoaded", () => {

  // ---------------- SIGNUP ----------------
  const signupForm = document.getElementById("signupForm");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = {
        name: document.getElementById("name").value.trim(),
        age: document.getElementById("age").value,
        phone: document.getElementById("number").value,
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value
      };

      try {
        const response = await fetch("/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        alert(result.message || result.error);

        if (response.ok) {
          window.location.href = "login.html";
        }

      } catch (error) {
        alert("Server error. Please try again.");
      }
    });
  }

  // ---------------- LOGIN ----------------
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = {
        email: document.getElementById("loginEmail").value.trim(),
        password: document.getElementById("loginPassword").value
      };

      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        alert(result.message || result.error);

        if (response.ok) {
          sessionStorage.setItem("isLoggedIn", "true");
          window.location.href = "index.html";
        }

      } catch (error) {
        alert("Server error. Please try again.");
      }
    });
  }

  // ---------------- QR SCANNER ----------------
  const qrReader = document.getElementById("qr-reader");

  if (qrReader) {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {

      const qrResult = document.getElementById("qr-result");
      const errorMessage = document.getElementById("error-message");

      function onScanSuccess(decodedText) {
        qrResult.textContent = `Scanned Data: ${decodedText}`;
        html5QrcodeScanner.clear();
      }

      function onScanError(error) {
        // silent error
      }

      const html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        false
      );

      html5QrcodeScanner.render(onScanSuccess, onScanError);

      errorMessage.textContent = "";

    } else {
      qrReader.innerHTML = "<p>Please <a href='login.html'>Login</a> to use the QR scanner.</p>";
    }
  }

});
