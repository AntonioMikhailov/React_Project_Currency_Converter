export default function CurrencyRow({ currencyOptions, selectedCurrency, onChangeCurrency, amount, onChangeAmount}) {  
  return (
<div>
<input onChange={onChangeAmount} value={amount} type="number"  className='input' />
<select value={selectedCurrency}  onChange={onChangeCurrency} >
  {
    currencyOptions.map((item, i)=> { 
     return ( 
      <option  key={i} value={item}>{item}</option>
      )})  
  }
</select>
</div>
  )
}
