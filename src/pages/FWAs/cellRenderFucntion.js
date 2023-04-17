export const getTime = (data) => {
  if (data.colDef.field === 'nextDate') {
    let dateTime = new Date(data.value).toLocaleString()
    return dateTime
  } else {
    let dateTime = new Date(data.value).toLocaleDateString()
    // return dateTime
    if (dateTime !== '1/1/1') {
      return dateTime
    }
  }
}

export const getBackgroundColor = (data) => {
  switch (data.value) {
    case '1': {
      return (
        <div style={{ backgroundColor: 'white', textAlign: 'center' }}>
          As Scheduled
        </div>
      )
    }
    case '2': {
      return (
        <div style={{ backgroundColor: 'red', textAlign: 'center' }}>High</div>
      )
    }
    case '3': {
      return (
        <div style={{ backgroundColor: 'lightgreen', textAlign: 'center' }}>
          Low
        </div>
      )
    }
  }
}

export const CheckboxData = (data) => {
  if (data.colDef.field === 'availableForUseInField') {
    return (
      <div>
        <input type="checkbox" checked={data.value}></input>
      </div>
    )
  }
  if (data.colDef.field === 'isContractWork') {
    return (
      <div>
        <input type="checkbox" checked={data.value}></input>
      </div>
    )
  }
}

export const TotalHours = function (data) {
  // console.log("gdsvgvdf",data)
  var totalHrs = 0
  var OvtHours = 0
  var TravelHours = 0
  for (var i = 0; i < data.value.length; i++) {
    OvtHours = OvtHours + data.value[i].ovtHrs + data.value[i].ovt2Hrs
    TravelHours = TravelHours + data.value[i].travelHrs
    totalHrs =
      totalHrs +
      data.value[i].regHrs +
      data.value[i].ovtHrs +
      data.value[i].ovt2Hrs +
      data.value[i].travelHrs
  }
  if (data.colDef.colId === 'TravelHour') {
    return TravelHours
  }
  if (data.colDef.colId === 'OvtHour') {
    return OvtHours
  }
  if (data.colDef.colId === 'TotalHours') {
    return totalHrs
  }
}

export const MapIcon = function (data) {
  return (
    <div className="text-center">
      <span class="fas fa-map-pin fa-lg"></span>
    </div>
  )
}
