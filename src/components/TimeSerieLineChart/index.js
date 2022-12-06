import React from 'react'
import { range } from 'lodash'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

import defaultTimeFormatter from '../../config/timeFormatter'

import './styles.css'

const TimeSerieLineChart = ({
  data,
  dataKeyX,
  dataKeyY,
  syncId,
  fillColor,
  unit,
  lineName,
  timeFormatter,
  valueFormatter,
  fixedDomain,
  fixedTicks,
  tickStep,
  rangeLimit,
}) => {
  const calculateTicks = (step = 5, dataRange = rangeLimit || [0, Number.POSITIVE_INFINITY]) => {
    const dataMin = Math.min.apply(Math, data);
    const dataMax = fixedDomain ? fixedDomain[1] : Math.max.apply(Math, data)
    let start = Math.max(dataRange[0], Math.floor(dataMin / step) * step)
    let end = Math.min(dataRange[1], Math.ceil(dataMax / step) * step)
    return range(start, end + 1, step)
  }

  const timeLabelFormatter = (value) => {
    if (isNaN(value)) {
      return value;
    }
    return timeFormatter ? timeFormatter(value) : defaultTimeFormatter(value);
  }

  const valueLabelFormatter = (value) => {
    return valueFormatter ? valueFormatter(value) : value;
  }

  return (
    <ResponsiveContainer width="100%" height="80%">
      <LineChart data={data} syncId={syncId} margin={{ top: 8, right: 25, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis 
          
          allowDataOverflow={true}  
          dataKey={dataKeyX} 
          interval={'preserveStartEnd'} 
          // domain={[0, 'dataMax']}
          tickFormatter={(timeStr) => timeLabelFormatter(timeStr)} 
          // type='number'
        />
        <YAxis
          type="number"
          interval="preserveStartEnd"
          domain={fixedDomain || [(dataMin) => dataMin]}
          axisLine={false}
          unit={unit}
          ticks={fixedTicks || calculateTicks(tickStep)}
          tickFormatter={(value) => valueLabelFormatter(value)}
          minTickGap={2}
          stroke='#E0C097'
        />
        <Tooltip
          labelFormatter={(timeStr) => timeLabelFormatter(timeStr)}
          formatter={(value) => valueLabelFormatter(value)}
          labelStyle={{color:'#E0C097'}}
          contentStyle={{
            background:'#B85C38', 
            border: 'solid',
            borderColor: 'black',
            borderWidth: '1px',
            borderRadius: '8px'
          }}
        />
        <Line
          name={lineName}
          type="monotone"
          dataKey={dataKeyY}
          stroke={fillColor}
          fill={fillColor}
          dot={false}
          strokeWidth={2}
          isAnimationActive={true}
          unit={unit}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default TimeSerieLineChart
