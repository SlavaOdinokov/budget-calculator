var modelController = (function(){
    
    var Income = function(id, description, value){
        this.id = id,
        this.description = description,
        this.value = value
    }

    var Expense = function(id, description, value){
        this.id = id,
        this.description = description,
        this.value = value,
        this.percentage = -1
    }

    // Метод для расходов, определяющий сколько % составляет каждая запись расходов от общего дохода
    Expense.prototype.calcPercentage = function(totalIncome){
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100)
        } else {
            this.percentage = -1
        }
    }
    // Метод возвращает значение из calcPercentage
    Expense.prototype.getPercentage = function(){
        return this.percentage
    }

    // Функция создающая новые записи (доход или расход)
    function addItem(type, desc, val){
        var newItem, ID = 0

        // Расчитываем ID
        if (data.allItems[type].length > 0) {
            var lastIndex = data.allItems[type].length - 1
            ID = data.allItems[type][lastIndex].id + 1
        } 
        
        // В зависимости от типа данных (доход, расход) создаем новый объект
        if (type === 'inc') {
            newItem = new Income(ID, desc, parseFloat(val))
        } else if (type === 'exp') {
            newItem = new Expense(ID, desc, parseFloat(val))
        }
        // Записываем новую запись/объект в переменную data
        data.allItems[type].push(newItem)
        // Возвращаем новый объект
        return newItem
    }

    // Функция удаления записи доход/расход
    function deleteItem(type, id){
        // 1 вариант
        // // Создаем новый массив с id элементов
        // var ids = data.allItems[type].map(function(item){
        //     return item.id
        // })
        // // Записываем id текущего элемента в index
        // index = ids.indexOf(id)

        // 2 вариант
        // Метод для поиска индекса согласно заданному условию
        var index = data.allItems[type].findIndex(item => item.id === id)

        // Удаляем текущий элмемент из массива по его id
        if (index !== -1) {
            data.allItems[type].splice(index, 1)
        }
    }
    
    // Функция считает общую сумму доходов/расходов
    function calculateTotalSum(type){
        var sum = 0

        data.allItems[type].forEach(function(item){
            sum = sum + item.value
        })

        return sum
    }
    
    // Функция расчета бюджета
    function calculateBudget(){
        // Считаем все доходы
        data.totals.inc = calculateTotalSum('inc')
        // Считаем все расходы
        data.totals.exp = calculateTotalSum('exp')
        // Расчет общего бюджета
        data.budget = data.totals.inc - data.totals.exp
        // Считаем процент для расходов
        if (data.totals.inc > 0) {
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
        } else {
            data.percentage = -1
        }
    }

    //Функция возвращает данные по бюджету
    function getBudget(){
        return {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage
        }
    }

    // Функция пересчета % у всех записей расходов
    function calculatePercentages(){
        data.allItems.exp.forEach(function(item){
            item.calcPercentage(data.totals.inc)
        })
    }

    // Функция возвращает массив с id элементов и %, которые необходимо изменить в шаблоне 
    function getAllIdAndPercentage(){
        // [[0, 15], [1, 25], [2, 50]]
        var allPerc = data.allItems.exp.map(function(item){
            return [item.id, item.getPercentage()]
        })

        return allPerc
    }

    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        addItem: addItem,
        calculateBudget: calculateBudget,
        getBudget: getBudget,
        deleteItem: deleteItem,
        calculatePercentages: calculatePercentages,
        getAllIdAndPercentage: getAllIdAndPercentage,
        // test: function(){
        //     console.log(data)
        // }
    }

})()
