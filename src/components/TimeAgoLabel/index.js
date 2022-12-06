import React from 'react'
import TimeAgo from 'react-timeago'
import Strings from 'react-timeago/lib/language-strings/id'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'

const TimeAgoLabel = ({ date, short = true }) => {
  const timeAgoFormatter = buildFormatter(Strings);
  if (isNaN(date)) {
    return <span>Tidak ada data</span>
  }

  const complement = short ? '' : 'Diperbarui '

  const style = {
    fontWeight: 'light',
  };

  return (
    <span>
      {complement}
      <TimeAgo
        live
        date={date}
        formatter={timeAgoFormatter}
        style={style}
      />
    </span>
  )
}

export default TimeAgoLabel
