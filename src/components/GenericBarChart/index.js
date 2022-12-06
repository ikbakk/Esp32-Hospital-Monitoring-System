import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts';


const GenericBarChart = ({ 
  data, 
  dataKeyX, 
  dataKeyY, 
  syncId, 
  fillColor, 
  unit, 
  barName, 
  labelColor }) => {
     


  return (
    <ResponsiveContainer width="100%" height="80%">
      <BarChart syncId={syncId} data={data} margin={{ left: 25, right: 25 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis stroke='#E0C097' dataKey={dataKeyX} />
        <YAxis stroke='#E0C097' unit={unit} />
        <Tooltip 
          labelStyle={{color:'#B85C38'}}
          contentStyle={{
            background:'#E0C097', 
            border: 'solid',
            borderColor: 'black',
            borderWidth: '1px',
            borderRadius: '8px'
          }}
        />
        <Legend layout="horizontal" verticalAlign="top" align="center" />
        <Bar
          name={barName}
          unit={unit}
          dataKey={dataKeyY}
          fill={fillColor}
          label={{
            formatter: (str) => str + unit,
            position: 'center',
            fill: labelColor || 'white',
            fontSize: '18px',
            fontWeight: 500,
          }}
          isAnimationActive={true}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GenericBarChart;
