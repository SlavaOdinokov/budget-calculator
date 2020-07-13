var generateTestData = (function(){
    var ExampleItem = function(type, desc, sum){
        this.type = type,
        this.desc = desc,
        this.sum = sum
    }
    
    var testData = [
        new ExampleItem('inc', 'Зарплата', 53000),
        new ExampleItem('inc', 'Фриланс', 21600),
        new ExampleItem('inc', 'Партнерская программа', 5300),
        new ExampleItem('inc', 'Продажи digital', 3900),
        new ExampleItem('exp', 'Рента', 10000),
        new ExampleItem('exp', 'Бензин', 4100),
        new ExampleItem('exp', 'Продукты', 15000),
        new ExampleItem('exp', 'Развлечения', 6800)
    ]
    
    function getRandomInt(max){
        return Math.floor(Math.random()*max)
    }
    
    function insertInUi(){
        var random = getRandomInt(testData.length)
        var randomItem = testData[random]
        
        document.querySelector('#input__type').value = randomItem.type
        document.querySelector('#input__description').value = randomItem.desc
        document.querySelector('#input__value').value = randomItem.sum
    }
    
    return {
        init: insertInUi
    }
})()

generateTestData.init()
