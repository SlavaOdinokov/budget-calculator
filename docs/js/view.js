var viewController = (function(){
    
    var DOMstrings = {
        inputType: '#input__type',
        inputDescription: '#input__description',
        inputValue: '#input__value',
        form: '#budget-form',
        incomeContainer: '#income__list',
        expensesContainer: '#expenses__list',
        budgetLabel: '#budget-value',
        incomeLabel: '#income-label',
        expensesLabel: '#expenses-label',
        expensesPersentLabel: '#expenses-persent-label',
        budgetTable: '#budget-table',
        monthLabel: '#month',
        yearLabel: '#year'
    }

    function getInput(){
        return {
            type: document.querySelector(DOMstrings.inputType).value,
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: document.querySelector(DOMstrings.inputValue).value
        }
    }

    // Функция форматирует значения
    function formatNumber(num, type){
        var numSplit, int, dec, newInt, resultNumber

        // // Убираем знак '-' у отрицательных чисел
        // num = Math.abs(num)
        // // Добавляем два знака после точки
        // num = num.toFixed(2)
        // // Выделяем у числа сотые 
        // numSplit = num.split('.') // 45.78 => [45, 78]
        // int = numSplit[0] // 45
        // dec = numSplit[1] // 48

        // Тоже самое с помощью деструктуризации массива
        // var [int, dec] = Math.abs(num).toFixed(2).split('.')
        var [int, dec] = num.toFixed(2).split('.')

        // Раставляем запятые, делим число на части по 3 цифры, начиная справа 123456789 => 123,456,789 
        // if (int.length > 3) {
        //     newInt = ''
            
        //     for (var i = 0; i < int.length / 3; i++) {
        //         // Формируем новую строку с заяпятыми через каждые 3 знака
        //         newInt = ',' + int.substring(int.length - 3 * (i + 1), int.length - 3 * i) + newInt
        //     }
        //     // Убираем запятую в начале, если она есть
        //     if (newInt[0] === ',') {
        //         newInt = newInt.substring(1)
        //     }
        // } else if (int === '0') {
        //     newInt = '0'
        // } else {
        //     newInt = int
        // }
        newInt = new Intl.NumberFormat('en-RU').format(int)

        // Формируем итоговое число и добавляем + или - перед числом в зависимости от типа
        // resultNumber = newInt + '.' + dec
        
        // if (newInt === '0') {
        //     resultNumber = resultNumber
        // } else if (type === 'exp') {
        //     resultNumber = '- ' + resultNumber
        // } else if (type === 'inc') {
        //     resultNumber = '+ ' + resultNumber
        // }

        // тоже самое (в updateBudget у budgetLabel убрать type)
        resultNumber = type ? type === 'exp' ? '- ': '+ ': ''
        resultNumber += newInt + '.' + dec + ' \u20BD'

        return resultNumber
    }

    // Метод который будет добавлять новую запись в разметку
    function renderListItem(obj, type){
        var containerElement, html

        if (type === 'inc') {
            containerElement = DOMstrings.incomeContainer
            html = `<li id="inc-%id%" class="budget-list__item item item--income">
                        <div class="item__title">%description%</div>
                        <div class="item__right">
                            <div class="item__amount">%value%</div>
                            <button class="item__remove">
                                <img
                                    src="./img/circle-green.svg"
                                    alt="delete"
                                />
                            </button>
                        </div>
                    </li>`
        } else {
            containerElement = DOMstrings.expensesContainer
            html = `<li id="exp-%id%" class="budget-list__item item item--expense">
                        <div class="item__title">%description%</div>
                        <div class="item__right">
                            <div class="item__amount">
                                %value%
                                <div class="item__badge">
                                    <div class="item__percent badge badge--dark">
                                        15%
                                    </div>
                                </div>
                            </div>
                            <button class="item__remove">
                                <img src="./img/circle-red.svg" alt="delete" />
                            </button>
                        </div>
                    </li>`
        }
        
        // Передаем значения новой строчки в разметку HTML
        newHtml = html.replace('%id%', obj.id)
        newHtml = newHtml.replace('%description%', obj.description)
        newHtml = newHtml.replace('%value%', formatNumber(obj.value, type))

        document.querySelector(containerElement).insertAdjacentHTML('beforeend', newHtml)
    }
    
    // Функция очистки формы после ввода данных
    function clearFields(){
        var inputDesc, inputVal

        inputDesc = document.querySelector(DOMstrings.inputDescription)
        inputVal = document.querySelector(DOMstrings.inputValue)

        inputDesc.value = ''
        inputDesc.focus()
        inputVal.value = ''

    }

    // Функция удаляет запись со страницы
    function deleteListItem(itemID){
        document.getElementById(itemID).remove()
    }

    // Функция выводит на страницу общий бюджет, доход/расход
    function updateBudget(obj){
        var type
        // Проверяем положительный бюджет или отрицательный 
        if (obj.budget > 0) {
            type = 'inc'
        } else {
            type = 'exp'
        }

        document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget)
        document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc')
        document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp')

        if (obj.percentage > 0) {
            document.querySelector(DOMstrings.expensesPersentLabel).textContent = obj.percentage + '%'
        } else {
            document.querySelector(DOMstrings.expensesPersentLabel).textContent = '--'
        }
    }

    // Функция обновляет % у расходов на странице
    function updateItemsPercenetage(items){
        items.forEach(function(item){
            var el = document.getElementById(`exp-${item[0]}`).querySelector('.item__percent')
            // Делаем проверку, если значение % = -1, когда нет доходов
            if (item[1] >= 0) {
                // Показываем бейдж с %
                el.parentElement.style.display = 'block'
                // Меняем контент внутри бейджа
                el.textContent = item[1] + '%'
            } else {
                // Если нет, то скрываем бейдж
                el.parentElement.style.display = 'none'
            }
        })
    }

    // Функция выводит месяц и год
    function displayMonth(){
        var now, year, month, monthArr

        now = new Date()
        year = now.getFullYear() // 2020
        month = now.getMonth() // если июль вернется 6

        monthArr = [
            'Январь', 'Февраль', 'Март',
            'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь',
            'Октябрь', 'Ноябрь', 'Декабрь'
        ]

        month = monthArr[month]

        document.querySelector(DOMstrings.monthLabel).innerText = month
        document.querySelector(DOMstrings.yearLabel).innerText = year

    }

    return {
        getInput: getInput,
        renderListItem: renderListItem,
        clearFields: clearFields,
        updateBudget: updateBudget,
        deleteListItem: deleteListItem,
        updateItemsPercenetage: updateItemsPercenetage,
        displayMonth: displayMonth,
        getDOMstrings: function(){
            return DOMstrings
        }
    }

})()
