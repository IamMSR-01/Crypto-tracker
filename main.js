let cryptoData = []; // Global variable to store data

const fetchCryptoData = async () => {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=true");
        const data = await response.json();
        console.log(data); // ✅ Debugging ke liye
        cryptoData = data; // Store data globally
        displayCryptoData(cryptoData);
        generateTop5Chart(); // ✅ Top 5 cryptos ka graph alag se
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const displayCryptoData = (filteredData) => {
    const tableBody = document.getElementById("crypto-table");
    tableBody.innerHTML = ""; // Clear previous content

    filteredData.forEach(coin => {
        const row = document.createElement("tr");
        row.setAttribute("data-coin-id", coin.id);
        row.innerHTML = `
            <td class="p-2 flex items-center">
                <img src="${coin.image}" alt="${coin.name}" class="w-6 h-6 mr-2">
                ${coin.name}
            </td>
            <td class="p-2">${coin.symbol.toUpperCase()}</td>
            <td class="p-2">$${coin.current_price.toLocaleString()}</td>
            <td class="p-2 ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}">
                ${coin.price_change_percentage_24h.toFixed(2)}%
            </td>
            <td class="p-2">
                <canvas id="chart-${coin.id}" width="100" height="40"></canvas>
            </td>
        `;
        tableBody.appendChild(row);

        // ✅ Mini Graphs
        generateMiniGraph(`chart-${coin.id}`, coin.sparkline_in_7d?.price || []);
    });
};

document.getElementById("crypto-table").addEventListener("click", function(e) {
    let targetRow = e.target.closest("tr"); // ✅ Nearest `tr` find karega
    if (targetRow && targetRow.dataset.coinId) {
        window.location.href = `coin.html?coinId=${targetRow.dataset.coinId}`;
    }
});


// ✅ Search Filter Function
document.getElementById("search").addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredCoins = cryptoData.filter(coin =>
        coin.name.toLowerCase().includes(searchTerm) || 
        coin.symbol.toLowerCase().includes(searchTerm)
    );
    displayCryptoData(filteredCoins);
});


// ✅ Mini Graphs for Individual Coins
const generateMiniGraph = (canvasId, priceData) => {
    if (!priceData || priceData.length === 0) {
        console.warn(`No price data for ${canvasId}`);
        return;
    }

    const ctx = document.getElementById(canvasId).getContext("2d");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: Array(priceData.length).fill(""), // Empty labels
            datasets: [{
                data: priceData,
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.1)",
                borderWidth: 1,
                pointRadius: 0, // Hide points
                tension: 0.4 // Smooth curve
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                x: { display: false },
                y: { display: false }
            }
        }
    });
};

// ✅ Top 5 Cryptos Price Trend Chart (Alag Section)
const generateTop5Chart = () => {
    const top5Coins = cryptoData.slice(0, 5); // ✅ Sirf Top 5 Cryptos

    const ctx = document.getElementById("cryptoChart").getContext("2d");

    if (window.top5Chart) {
        window.top5Chart.destroy(); // ✅ Purana chart hatao pehle
    }

    window.top5Chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: Array(7).fill("").map((_, i) => `Day ${i + 1}`),
            datasets: top5Coins.map(coin => ({
                label: coin.name,
                data: coin.sparkline_in_7d?.price.slice(-7) || [],
                borderColor: getRandomColor(),
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderWidth: 2,
                tension: 0.4
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: "Last 7 Days" } },
                y: { title: { display: true, text: "Price (USD)" }, beginAtZero: false }
            }
        }
    });
};

// ✅ Random Color Generator for Graph
const getRandomColor = () => {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
};

fetchCryptoData();



    // Mobile Menu Toggle
    document.getElementById("mobile-menu-btn").addEventListener("click", function() {
        const menu = document.getElementById("mobile-menu");
        menu.classList.toggle("hidden");
    });

    // Search Bar Toggle
    document.getElementById("search-btn").addEventListener("click", function() {
        const searchBar = document.getElementById("search-bar");
        searchBar.classList.toggle("hidden");
    });

    // Dark Mode Toggle
    document.getElementById("dark-mode-toggle").addEventListener("click", function() {
        document.body.classList.toggle("bg-gray-900");
        document.body.classList.toggle("bg-white");
        document.body.classList.toggle("text-black");
    });

    document.getElementById("crypto-table").addEventListener("click", function(e) {
        if (e.target.closest("tr")) {
            const coinId = e.target.closest("tr").dataset.coinId;
            window.location.href = `coin.html?coinId=${coinId}`;
        }
    });
    