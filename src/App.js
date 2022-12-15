import React, { useEffect, useState } from "react";
import CurrencyRow from "./CurrencyRow";
 
function App() {
  const [currencyOptions, setCurrencyOptions]  = useState([])  
  // установим по умолчанию имена валют
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  //установим обмен
const [exchangeRate, setExchangeRate] = useState()
  // установим сумму по умолчанию
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)
// определим переменные для текущего курса для From и To  
let toAmount;
let fromAmount;
if(amountInFromCurrency) {
  fromAmount = amount;
  toAmount = amount * exchangeRate  || 0
 
} else {
  toAmount = amount;
  fromAmount = amount / exchangeRate  
}
 
 

useEffect(()=> {

 fetch( 'https://www.cbr-xml-daily.ru/latest.js')    // берем с российского сервера
 // fetch( './currencyData.json')  // если из локальной БД
      .then(response => response.json())
       .then(data => {
       // установим первую валюту которая в To
         const firstToCurrency = Object.keys(data.rates)[0] 
        setToCurrency(firstToCurrency)
         setCurrencyOptions([data.base,  ...Object.keys(data.rates)]) 
        setExchangeRate(data.rates[firstToCurrency]) 
       })  
      }, []) 


 //UseEffect - lля смены названий валют в полях   
 useEffect(()=> {
  // повторять запрос при смене валюты
 if(fromCurrency != null && toCurrency != null ) {
    // fetch( `./currencyData.json?base=${fromCurrency}&symbols=${toCurrency}`)  // если с локальной БД
    fetch( `https://www.cbr-xml-daily.ru/latest.js?base=${fromCurrency}&symbols=${toCurrency}`)   
    .then(response => response.json())
     .then(data => {
      setExchangeRate(data.rates[toCurrency] )
  })
}
 },[fromCurrency, toCurrency]) // реагировать на смену названий валют

 // ф. изменения данных в полях ввода
 function handleFromAmountChange(e) {
   setAmount(e.target.value)
   setAmountInFromCurrency(true)
 }
 function handleToAmountChange(e) { 
  setAmount(e.target.value)
  setAmountInFromCurrency(false)
}
  return (
    <>
   <h2>Конвертер рублей</h2>
  <CurrencyRow
  currencyOptions={ currencyOptions }
  // передаем какая валюта по умолчанию в поле
  selectedCurrency={fromCurrency}
  // вызываем ф. которая меняет валюту в списке
  onChangeCurrency={(e)=> setFromCurrency(e.target.value)}
  // передаем курсы обмена  -  обрезаем лишние знаки после запятой
 amount={Number(fromAmount).toFixed(0)}
  // передаем данные при смене кол-ва числа в поле ввода
  onChangeAmount={handleFromAmountChange}
  />
  <div className='equals' >=</div>
  <CurrencyRow
   currencyOptions={currencyOptions}
   selectedCurrency={toCurrency}
   onChangeCurrency={(e)=> setToCurrency(e.target.value)}
   amount={Number(toAmount).toFixed(3)}
   onChangeAmount={handleToAmountChange}
  />
    </>
  );
}
export default App;
