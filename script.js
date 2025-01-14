const symbols = ["⚡", "🌩️", "👑", "🍇", "🍒"];
const spinButton = document.getElementById("spinButton");
const resultDisplay = document.getElementById("result");
const balanceDisplay = document.getElementById("balance");
const amountInput = document.getElementById("amount");
const depositButton = document.getElementById("depositButton");
const withdrawButton = document.getElementById("withdrawButton");
const spinSound = document.getElementById("spinSound");
const winSound = document.getElementById("winSound");
const backgroundMusic = document.getElementById("backgroundMusic");

let balance = 100; // Saldo awal

function PlaySound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function spinReels() {
    PlaySound(spinSound);
    const results = [];
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * symbols.length);
        results.push(symbols[randomIndex]);
        document.getElementById(`reel${i + 1}`). textContent = symbols[randomIndex];
    }
    return results
}



// Fungsi untuk memperbarui saldo di tampilan
function updateBalance() {
    balanceDisplay.textContent = balance;
}

// Fungsi untuk memutar mesin slot
spinButton.addEventListener("click", () => {
    if (balance <= 0) {
        alert("Saldo Anda tidak cukup untuk bermain!");
        return;
    }

    balance -= 10; // Mengurangi saldo saat bermain
    updateBalance();

    const reel1 = document.getElementById("reel1");
    const reel2 = document.getElementById("reel2");
    const reel3 = document.getElementById("reel3");

    // Animasi putaran
    reel1.style.transform = "rotate(360deg)";
    reel2.style.transform = "rotate(360deg)";
    reel3.style.transform = "rotate(360deg)";

    setTimeout(() => {
        const result1 = symbols[Math.floor(Math.random() * symbols.length)];
        const result2 = symbols[Math.floor(Math.random() * symbols.length)];
        const result3 = symbols[Math.floor(Math.random() * symbols.length)];

        reel1.textContent = result1;
        reel2.textContent = result2;
        reel3.textContent = result3;

        checkWin(result1, result2, result3);
    }, 1000); // Delay untuk animasi
});

// Fungsi untuk memeriksa kemenangan
function checkWin(result1, result2, result3) {
    if (result1 === result2 && result2 === result3) {
        resultDisplay.textContent = "Selamat! Anda menang!";
        balance += 30; // Menambahkan saldo saat menang
    } else {
        resultDisplay.textContent = "Coba lagi!";
    }
    updateBalance();
}

// Fungsi untuk deposit
depositButton.addEventListener("click", () => {
    const amount = parseInt(amountInput.value);
    if (amount > 0) {
        balance += amount;
        updateBalance();
        amountInput.value = ""; // Mengosongkan input setelah deposit
    } else {
        alert("Masukkan jumlah yang valid untuk deposit.");
    }
});

// Fungsi untuk withdraw
withdrawButton.addEventListener("click", () => {
    const amount = parseInt(amountInput.value);
    if (amount > 0 && amount <= balance) {
        balance -= amount;
        updateBalance();
        amountInput.value = ""; // Mengosongkan input setelah withdraw
    } else {
        alert("Masukkan jumlah yang valid untuk withdraw.");
    }
});

// Memperbarui tampilan saldo saat halaman dimuat
updateBalance();

document.addEventListener("DOMContentLoaded", function() {
    const spinButton = document.getElementById("spinButton");
    const balanceDisplay = document.getElementById("balance");
    const resultDisplay = document.getElementById("result");
    const amountInput = document.getElementById("amount");
    const depositButton = document.getElementById("depositButton");
    const withdrawButton = document.getElementById("withdrawButton");
    const backgroundMusic = document.getElementById("backgroundMusic");
    const spinSound = document.getElementById("spinSound");
    const winSound = document.getElementById("winSound");
    const toggleDarkMode = document.getElementById("toggleDarkMode");

    backgroundMusic.play(); // Memulai musik latar belakang

    spinButton.addEventListener("click", async () => {
        spinSound.play(); // Memainkan suara putaran
        const response = await fetch("/api/spin");
        const result = await response.json();
        document.getElementById("reel1").innerText = result[0];
        document.getElementById("reel2").innerText = result[1];
        document.getElementById("reel3").innerText = result[2];
        resultDisplay.innerText = `Hasil: ${result.join(" ")}`;
        // Logika untuk menangani kemenangan bisa ditambahkan di sini
    });

    depositButton.addEventListener("click", async () => {
        const amount = parseInt(amountInput.value);
        if (amount > 0) {
            await fetch(`/api/deposit?amount=${amount}`, { method: "POST" });
            updateBalance();
        }
    });

    withdrawButton.addEventListener("click", async () => {
        const amount = parseInt(amountInput.value);
        if (amount > 0) {
            await fetch(`/api/withdraw?amount=${amount}`, { method: "POST" });
            updateBalance();
        }
    });

    async function updateBalance() {
        const response = await fetch("/api/balance");
        const balance = await response.json();
        balanceDisplay.innerText = balance;
    }

    toggleDarkMode.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
});