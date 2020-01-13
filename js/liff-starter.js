window.onload = function() {
  const useNodeJS = false;
  const defaultLiffId = ""; // change the default LIFF value if you are not using a node server

  let myLiffId = "";

  if (useNodeJS) {
    fetch("/send-id")
      .then(function(reqResponse) {
        return reqResponse.json();
      })
      .then(function(jsonResponse) {
        myLiffId = jsonResponse.id;
        initializeLiffOrDie(myLiffId);
      })
      .catch(function(error) {
        document.getElementById("liffAppContent").classList.add("hidden");
        document.getElementById("liffAppLogin").classList.add("hidden");
        document.getElementById("body-content").classList.add("hidden");
        document
          .getElementById("nodeLiffIdErrorMessage")
          .classList.remove("hidden");
      });
  } else {
    myLiffId = defaultLiffId;
    initializeLiffOrDie(myLiffId);
  }
};

/**
 * Check if myLiffId is null. If null do not initiate liff.
 * @param {string} myLiffId The LIFF ID of the selected element
 */
function initializeLiffOrDie(myLiffId) {
  if (!myLiffId) {
    document.getElementById("liffAppContent").classList.add("hidden");
    document.getElementById("liffAppLogin").classList.add("hidden");
    document.getElementById("body-content").classList.add("hidden");
    document.getElementById("liffIdErrorMessage").classList.remove("hidden");
  } else {
    initializeLiff(myLiffId);
  }
}

/**
 * Initialize LIFF
 * @param {string} myLiffId The LIFF ID of the selected element
 */
function initializeLiff(myLiffId) {
  liff
    .init({
      liffId: myLiffId
    })
    .then(() => {
      // start to use LIFF's api
      initializeApp();
    })
    .catch(err => {
      document.getElementById("liffAppContent").classList.add("hidden");
      document.getElementById("liffAppLogin").classList.add("hidden");
      document
        .getElementById("liffInitErrorMessage")
        .classList.remove("hidden");
    });
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
  displayLiffData();
  displayIsInClientInfo();
  registerButtonHandlers();

  // check if the user is logged in/out, and disable inappropriate button
  if (liff.isLoggedIn()) {
    document.getElementById("liffLoginBtn").classList.add("hidden");
    document.getElementById("liffLogoutBtn").classList.remove("hidden");
  } else {
    document.getElementById("liffLogoutBtn").classList.add("hidden");
    document.getElementById("liffLoginBtn").classList.remove("hidden");
  }
}

/**
 * Display data generated by invoking LIFF methods
 */
function displayLiffData() {
  liff
    .getProfile()
    .then(profile => {
      document.getElementById("profileUser").textContent = profile.displayName;
    })
    .catch(e => {
      console.log("error", e);
    });
  document.getElementById("OSUser").textContent = liff.getOS();
  document.getElementById("isClientUser").textContent = liff.isInClient();
  document.getElementById("isLoggedInUser").textContent = liff.isLoggedIn();
}

/**
 * Toggle the login/logout buttons based on the isInClient status, and display a message accordingly
 */
function displayIsInClientInfo() {
  if (liff.isInClient()) {
    document.getElementById("liffLoginBtn").classList.toggle("hidden");
    document.getElementById("liffLogoutBtn").classList.toggle("hidden");
  }
}

/**
 * Register event handlers for the buttons displayed in the app
 */
function registerButtonHandlers() {
  // openWindow call
  document
    .getElementById("openWindowBtn")
    .addEventListener("click", function() {
      liff.openWindow({
        url: "https://catatanliffv2.herokuapp.com/", // Isi dengan Endpoint URL aplikasi web Anda
        external: true
      });
    });

  // closeWindow call
  document
    .getElementById("closeWindowBtn")
    .addEventListener("click", function() {
      if (!liff.isInClient()) {
        sendAlertIfNotInClient();
      } else {
        liff.closeWindow();
      }
    });

  // login call, only when external browser is used
  document.getElementById("liffLoginBtn").addEventListener("click", function() {
    if (!liff.isLoggedIn()) {
      // set `redirectUri` to redirect the user to a URL other than the front page of your LIFF app.
      liff.login();
    }
  });

  // logout call only when external browse
  document
    .getElementById("liffLogoutBtn")
    .addEventListener("click", function() {
      if (liff.isLoggedIn()) {
        liff.logout();
        window.location.reload();
      }
    });
}

/**
 * Alert the user if LIFF is opened in an external browser and unavailable buttons are tapped
 */
function sendAlertIfNotInClient() {
  alert(
    "This button is unavailable as LIFF is currently being opened in an external browser."
  );
}

/**
 * Toggle specified element
 * @param {string} elementId The ID of the selected element
 */
function toggleElement(elementId) {
  const elem = document.getElementById(elementId);
  if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
    elem.style.display = "none";
  } else {
    elem.style.display = "block";
  }
}
