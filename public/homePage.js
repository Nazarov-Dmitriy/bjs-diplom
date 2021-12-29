const logoutButton = new LogoutButton();
const ratesBoard = new RatesBoard();
const moneyManager = new MoneyManager();
const favoritesWidget = new FavoritesWidget();

// Выход пользователя

logoutButton.action = () => {
    ApiConnector.logout(response => {
        if (response.success) {
            document.location.reload();
        }
    });
};

// Получение текущего пользователя


ApiConnector.current(response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

// Получение курса валют

function getExchangeRates() {
    ApiConnector.getStocks(response => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
}

getExchangeRates();
setInterval(getExchangeRates, 60000);

// Пополнение баланса

moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, `Счет успешно пополнен  на ${data.amount} ${data.currency}`);
        } else {
            moneyManager.setMessage(response.success, `Ошибка пополнения средств`);
        }
    });
};

// Конвертирование валюты

moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {

        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, `Успешно конвектировано  ${data.fromCurrency} в ${data.targetCurrency}`);
        } else {
            moneyManager.setMessage(response.success, response.error);
        }
    });
};

// Перевод валюты

moneyManager.sendMoneyCallback = data => {

    ApiConnector.transferMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, `Успешно переведено  ${data.amount} ${data.currency}`);
        } else {
            moneyManager.setMessage(response.success, response.error);
        }
    });
};

//Работа с избранным

//Запрос списка избанного

function getUsersFavorit() {
    ApiConnector.getFavorites(data => {
        if (data.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(data.data);
            moneyManager.updateUsersList(data.data);
        }
    });
}
getUsersFavorit();

favoritesWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            getUsersFavorit();
            favoritesWidget.setMessage(response.success, `Пользователь  ${data.name} успешно добавлен в список избранного`)
        } else {
            favoritesWidget.setMessage(response.success, response.error);
        }
    });
};


favoritesWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            getUsersFavorit();
            favoritesWidget.setMessage(response.success, `Пользователь успешно удален из список избранного`)
        } else {
            favoritesWidget.setMessage(response.success, response.error);
        }
    });
};