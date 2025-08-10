function startGame() {
    console.log("Game started!");
    window.Telegram.WebApp.showAlert("Тоглоом эхэллээ!"); // Telegram alert
    // Тоглоомын логик эндээс эхэлнэ
}

function openSkins() {
    console.log("Skins menu opened!");
    window.Telegram.WebApp.showPopup({
        title: "Skins",
        message: "Шинэ skin сонгох уу?",
        buttons: [{ type: "ok" }, { type: "cancel" }]
    });
}

function showLeaderboard() {
    console.log("Leaderboard opened!");
    window.Telegram.WebApp.showAlert("Онооны жагсаалт удахгүй нэмэгдэнэ!");
}

function openShop() {
    console.log("Shop opened!");
    window.Telegram.WebApp.showAlert("Дэлгүүр удахгүй нэмэгдэнэ!");
}

function openUpgrade() {
    console.log("Upgrade menu opened!");
    window.Telegram.WebApp.showAlert("Шинэчлэл удахгүй нэмэгдэнэ!");
}