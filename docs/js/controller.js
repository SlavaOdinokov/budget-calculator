var controller = (function(budgetCtrl, uiCtrl){

    var setupEventListeners = function(){
        var dom = uiCtrl.getDOMstrings()
        // Слушаем клик по кнопки 'Добавить'
        document.querySelector(dom.form).addEventListener('submit', ctrlAddItem)
        // Слушаем клик по всей тадлицы Доходы/Расходы и удаляем запись функцией ctrlDeleteItem
        document.querySelector(dom.budgetTable).addEventListener('click', ctrlDeleteItem)
    }

    // Функция пересчета % у каждой записи расходов
    function updatePercentages(){
        // Посчитаем % для каждой записи расходов
        budgetCtrl.calculatePercentages()
        // budgetCtrl.test()
        // Получаем обновленные % из модели
        var idsAndPercents = budgetCtrl.getAllIdAndPercentage()
        // Обновляем шаблон с новыми %
        uiCtrl.updateItemsPercenetage(idsAndPercents)
    }
    
    // Функция срабатывабщая при отправки формы
    function ctrlAddItem(e){
        e.preventDefault()
        // Получаем данные из формы
        var input = uiCtrl.getInput()

        // Проверка на пустые поля
        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // Добавляем полученные из формы данные в модель
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value)
            // budgetCtrl.test()
            // Добавляем запись на страницу
            uiCtrl.renderListItem(newItem, input.type)
            // Отчищаем форму
            // uiCtrl.clearFields()
            generateTestData.init()
            // Обновляем общий бюджет
            updateBudget()
            // Обновляем проценты у каждой записи расходов
            updatePercentages()
        }
    }

    // Функция для удаления записи
    function ctrlDeleteItem(e){
        var itemID, splitID, type, ID

        if (e.target.closest('.item__remove')) {
            // Находим ID записи которую нужно удалить
            itemID = e.target.closest('li.budget-list__item').id
            splitID = itemID.split('-') // 'inc-0' => ['inc', '0']
            type = splitID[0]
            ID = parseInt(splitID[1])
            // Удаляем запись из модели
            budgetCtrl.deleteItem(type, ID)
            // Удаляем запись из шаблона
            uiCtrl.deleteListItem(itemID)
            // Обновляем общий бюджет
            updateBudget()
            // Обновляем проценты у каждой записи расходов
            updatePercentages()
        }
    }

    // Функция пересчета общего дохода/расхода
    function updateBudget(){
        // Расчитываем бюджет в модели
        budgetCtrl.calculateBudget()
        // Получаем расчитанный бюджет из модели
        budgetObj = budgetCtrl.getBudget()
        // Отобразить в шаблоне 
        uiCtrl.updateBudget(budgetObj)
    }

    return {
        init: function(){
            console.log('App started!')
            uiCtrl.displayMonth()
            setupEventListeners()
            uiCtrl.updateBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            })
        }
    }

})(modelController, viewController)

controller.init()
